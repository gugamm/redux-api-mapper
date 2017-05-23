# API Reference

- [Mapper](#mapper)
  - [`createMapper`](#createMapper)
  - [`making requests`](#makingRequests)
  
- [Request](#request)   
 
- [RequestStateHandler](#requestStateHandler)
          
- [Utilities](#utilities)
  - [`stateToAction`](#stateToAction)

## Mapper

### `createMapper`
##### `store` (required)
The redux store object

##### `config` (required)
The config object, defining resources, endPoints...

##### `http-layer` (optional)
A custom http-layer implementation. If not provided, the default http-layer (FetchHttpLayer) will be used

```js
import { createMapper } from 'redux-api-mapper'
import { store } from './store'
import { config } from './config'

const api = createMapper(store, config);
```

### `making requests`
Your mapper object will contain functions to access your api.
These functions returns whatever the http-layer returns. The default http-layer returns a promise that will resolve with the parsed response.

##### `params` (optional)
An object with key/value. If the key is in the path, then it will be used to build the url. If it's not, then it will be used to build the querysting.

##### `body` (optional)
Anything to be used as a body for the request

##### `headers` (optional)
An object with key/value to be used as request headers

##### `options` (optional)
Usually an object. The properties that you can pass depend on the http-layer you are using. For the default layer, please see the API doc for the DefaultHttpLayer.

```js
api.Users.getUsers({count : 10});
api.Auth.signIn(null, {username : 'blabla', password : 'blablum'}, {'Content-Type' : 'application/json'});
//
//chaining request
api.Auth.signIn(null, {username : 'blabla', passwordl : 'blablum'}).then(api.Users.getUsers());
```

## Request
This is the request object that is passed to the http-layers and may be passed to some options callback

```js
const request = {
  fullPath : string, 
  method   : string, 
  params   : Object<string, string>, 
  headers  : Object<string, string>, 
  body     : any, 
  api      : Object,
  resource : Object,
  endPoint : Object,
  options  : any
};
```

## RequestStateHandler
This library provides an ApiReducer, so you don't need to create reducers or actions by hand. However, sometimes we want to use a separeted reducer or do something else when the state of the request change. This is where the RequestStateHandler comes into play. It is just a function that will receive `parsedResponse, api, dispatch` as props. These functions are handled by the redux-api-mapper like this:
* If the function return an `Object`, then it is considered as an action to be dispatched to the store
* If the function doesn't return anything, then nothing is done
* If the function returns another function, then it is considered to be an action creator or even another RequestStateHandler, so it calls this function with the same parameters (parsedResponse, api, dispatch), and handle the return of this function in the same way
* If the function returns an array, then it takes the correct action of each element of the array. If it's a object then dispatch, if it's a function, resolve the function.

You can define a handler for each state of a request by using stateToAction helper function. Let's see an example:

```js

const handleFetch = (parsedResponse, api, dispatch) => {
  console.log('Fetching');
  api.headers['Content-Type'] = 'application/json';
  dispatch(coolAction());
  
  //The return array will be handled by the redux-api-library. If it returns an object, it will dispatch to the store
  return [{type : EXAMPLE}, createExample, createExampleAction()];
}

const config = {
  host : 'http://localhost/api',
  resources : [
    {
      name : 'Users',
      path : '/',
      endPoints : [
        {
          name : 'getUsers',
          path : '/',
          // DEFINE STATE HANDLERS HERE
          action : stateToAction(handleFetch, handleComplete, handleError, handleCancelled)
        }
      ]
    }
  ]
}

``` 

## Utilities

### `stateToAction`

This is a helper function to be used when defining a configuration. It maps a state of a request to an action(object or function) to be dispatched. In case of a function, the function will be called with a payload(response of the request) and must return an action object.

##### `actionOnFetch` (optional)
The function or object to be dispatched before a request start. It can be null if you don't want any action to be dispatched in this state

##### `actionOnComplete` (optional)
The function or object to be dispatched if the request complete with no error. It can be null if you don't want any action to be dispatched in this state

##### `actionOnError` (optional)
The function or object to be dispatched if the request complete with an error. It can be null if you don't want any action to be dispatched in this state

##### `actionOnCancel` (optional)
The function or object to be dispatched if the request is cancelled. It can be null if you don't want any action to be dispatched in this state

```js
import { stateToAction } from 'redux-api-mapper';

const fetchUsers = { type : 'FETCH_USERS' };

const fetchUsersComplete = (users) => {
  return {
    type : 'FETCH_USERS_COMPLETE',
    payload : users
  };
};

var config = {
  host : /* ... */,
  resources : [
    {
      name : 'Users',
      path : '/users',
      endPoints : [
        {
          name : 'getUsers',
          path : '/',
          options : {
            responseParse : (response) => JSON.parse(response.data)
          },
          action : stateToAction(fetchUsers, fetchUsersComplete)
        }
      ]
    }
  ]
}
```
