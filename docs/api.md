# API Reference

- [Mapper](#mapper)
  - [`createMapper`](#createMapper)
  - [`call`](#call)
  
- [DefaultHttpLayer](#defaultHttpLayer)
  - [`beforeRequest`](#beforeRequest)
  - [`afterResponse`](#afterResponse)
  - [`bodyParse`](#bodyParse)
  - [`responseParse`](#responseParse)
  - [`Response`](#response)
  - [`Request`](#request)   
  
- [RequestStateHandler](#requestStateHandler)
          
- [Utilities](#utilities)
  - [`addResourceToMapper`](#addResourceToMapper)
  - [`addEndPointToMapper`](#addEndPointToMapper)
  - [`stateToAction`](#stateToAction)
  
- [Mock](#mock)
  - [`createMockMapper`](#createMockMapper)


## Mapper

### `createMapper`
##### `store` (required)
The redux store object

##### `config` (required)
The config object, defining resources, endPoints...

##### `http-layer` (optional)
A custom http-layer implementation. If not provided, the DefaultHttpLayer will be used

```js
import { createMapper } from 'redux-api-mapper'
import { store } from './store'
import { config } from './config'

const api = createMapper(store, config);
```

### `call`
After creating a mapper, redux-api-mapper will add a "call" method to your endPoints. You can access by : mapper.[Resource-Name].[EndPoint-Name].call()

This function returns whatever the http-layer returns. The default http-layer returns a function that can be used to cancel a request.

##### `params` (optional)
An object with key/value. If the key is in the path, then it will be used to build the url. If it's not, then it will be used to build the querysting.

##### `headers` (optional)
An object with key/value to be used as request headers

##### `body` (optional)
Anything to be used as a body for the request

##### `options` (optional)
Usually an object. The properties that you can pass depend on the http-layer you are using. For the default layer, please see the API doc for the DefaultHttpLayer.

```js
api.Users.getUsers.call({count : 10}, {'Content-Type' : 'application/json'});
api.Auth.signin.call(null, {'Content-Type' : 'application/json'}, {username : 'blabla', password : 'blablum'});

//Cancelling a request
const cancel = api.Users.getUsers.call({count : 10}, {'Content-Type' : 'application/json'});
cancel('Reason for cancelling'); //This is passed as a payload to the CANCELLED action

const cancel = api.Auth.signin.call(null, {'Content-Type' : 'application/json'}, {username : 'blabla', password : 'blablum'});
cancel({reason : 'Because I want'}); //This is passed as a payload to the CANCELLED action

```

## DefaultHttpLayer
This is the default http-layer that is used in case you don't pass an http-layer when creating a mapper.

The http layer accept these options :

### `beforeRequest`
A function that receive the request object and do anything. The return will be ignored. Called before dispatching FETCH_START

### `afterResponse`
A function that receive an response object after the request complete. Called before `responseParse`.

### `bodyParse`
A function used to parse the body that will be send to the request. Receive a body(anything) and return a new body(anything)

### `responseParse`
A function that receive an response object and <b>MUST(required to)</b> parse the response into something else. Called before calling FETCH_COMPLETE or FETCH_ERROR

```js
const config = {
  /* host, resources, headers... */
  options : {
    beforeRequest : (request)  => console.log(request),
    afterResponse : (response) => console.log(response),
    bodyParse     : (body)     => JSON.stringify(body),
    responseParse : (response) => JSON.parse(response.data)
  }
}
```

### `Response`
This is the response object that is returned by the http-layer

```js
const response = {
  data              : xhr.response,
  status            : xhr.status,
  statusText        : xhr.statusText,
  getResponseHeader : xhr.getResponseHeader,
  request           : request,
  method            : method,
  ok                : (xhr.status >= 200 && xhr.status <= 299)
}
```

### `Request`
This is the request object that is passed to the http-layers

```js
const request = {fullPath : string, path : string, params : Object, headers : Object, body : any, options : any};
```

## RequestStateHandler
The request state handler is a function that handle a state of a request. The request has 4 possible states : `FETCHING`, `COMPLETED`, `ERROR` or `CANCELLED`. You can handle all of these states but you are not required to.
A request state handler can return an Action Object, an Array of Action Object or Action Creators, or nothing(in this case we consider that the state handler has dispatched the necessary actions).

```js

const handleFetch = (parsedResponse, api, dispatch) => {
  console.log('Fetching');
  api.headers['Content-Type'] = 'application/json';
  dispatch(coolAction());
  
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

### `addResourceToMapper`
This is a helper function to add a resource to an already created api mapper. This function is very helpful when we are using code splitting

##### `mapper` (required)
The mapper object

##### `resource` (required)
The resource to be added to the mapper

```js
import { MyCoolResource } from './resources/cool';
import { api } from './api';

addResourceToMapper(api, MyCoolResource);
```

### `addEndPointToMapper`
This is a helper function to add a endPoint to a resource. This function is very helpful when we are using code splitting


##### `mapper` (required)
The mapper object

##### `resource` (required)
The resource object

##### `endPoint` (required)
The endPoint object

```js
import { MyCoolResource } from './resources/cool';
import { MyAwesomeEndPoint } from './endpoints/awesome';
import { api } from './api';

//Here MyCoolResource is already in the api mapper
addEndPointToMapper(api, MyCoolResource, MyAwesomeEndPoint);
```

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
      path : '/users'
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

## Mock

### `createMockMapper`

This function is used for mocking purposes. It creates an apiMapper with the same signature of the original mapper plus testing functions. To make testing even easier, the `call` method is just a function that does nothing and returns a function that also do nothing. 
*since the return of the call method depends on the http-layer, we recommend using the default http-layer to avoid compatibilities issues*

##### `config` (required)
The config object defining the api

```js
import { createMockMapper } from 'redux-api-mapper';

const config = /*...*/;

const mockApi = createMockMapper(config);

describe('Test the mock api', function () {
  it('should call getUsers', function () {
    mockApi.Users.getUsers.call();
    expect(mockApi.Users.getUsers.called()).to.equal(true);
  });
});
```

**testing with react and enzyme**

```js
import { mount } from 'enzyme';
import { createMockMapper, ApiProvider } from 'redux-api-mapper';

class Users extends Component {
  componentDidMount() {
    this.props.getUser({id : 1});
  }
  
  render() {/*...*/}
}

describe('<Users />', function () {
  const mockApi = createMockMapper(/*config*/);
  const wrapper = mount(<ApiProvider api={mockApi}><Users /></ApiProvider>);
  
  it('should have called getUser', function () {
    expect(mockApi.Users.getUser.called()).to.equal(true);
  });
  
  it('should have called with id = 1', function () {
    expect(mockApi.Users.getUsers.getMockData().params['id']).to.equal(1);
  });
});

```

### `mockMapper`
This is the object returned by `createMockMapper`

##### `call` (Function)
Simulate a call to the api(do not do the request, it store the information that the method has been called). Returns a function that can also be used to simulate cancelling a request

##### `called` (Function)
A function that returns a boolean indicating if the method has been called

##### `cancelled` (Function)
A function that returns a boolean indicating if the method has been cancelled

##### `calledTimes` (Function)
A function that returns how many times a method has been called

##### `cancelledTimes` (Function)
A function that returns how many times a method has been cancelled

##### `getMockData` (Function)
A function that returns an object containing all mock metadata
```js
mockData = {
  called : boolean
  calledTimes : number
  cancelled : boolean
  cancelledTimes : number
  params : object
  reqHeaders : object
  reqBody : object
  reqOptions : object
}
```

##### `reset` (Function)
A function that reset the mock data of an endPoint, resource or the entire apiMock object

```js

const apiMock = /*....*/;

//Reset entire mock data
apiMock.reset();

//Reset Users resource mock data
apiMock.Users.reset();

//Reset getUsers endPoint mock data
apiMock.Users.getUsers.reset();

```
