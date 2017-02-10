# Redux-Api-Mapper

## Motivation

Many react/redux applications interact with an api. To solve this problem with redux, we use middlewares that are able to handle async actions, such as a http request. Using data in this approach is not wrong, however, sometimes it generates a lot of boilerplate. Especially when handling api requests.

## Solution

Redux-Api-Mapper for rescue! It's a small but powerful utility for mapping any api with a config definition and returning an object with methods for accessing your api. It will automatically dispatch actions for the store based on the state of the request.

## Documentation (I'm writing this...)

* [Introduction](/docs/introduction.md)
* [Config shape](/docs/config.md)
* [Http-Layers](/docs/http-layer.md)
* [ApiProvider and apiConnect](/docs/provider.md)

## Install

```bash
npm i redux-api-mapper
```

## Quick Start

Consider the [github api](https://developer.github.com/v3/repos/#list-user-repositories). We could map this api with a config like this

```js
var config = {
  host : "https://api.github.com",
  resources : [
	{
		name : 'Repos',
		path : '/',
		endPoints : [
			{
				name : 'userRepos',
				path : 'users/{username}/repos',
				action : stateToAction(actionOnFetch, actionOnComplete)
			}
		]
	}
  ]
}
```

This is a common javascript object. The cool parts to notice here is the `/users/{username}/repos` in the end point and the `action` property. Redux-Api-Mapper automatically fullfill these parameter when making the request. Also, `stateToAction` is a function that maps the state of the request into an `action object` or `action creator` and dispatches to the redux store. Here is a full example:

```js
import { MAPPER, stateToAction } from 'redux-api-mapper';
import {store} from './yourstorefile';

// Define the config
const config = /*...*/

// Create your api mapper
const api = MAPPER.createMapper(store, config, /* http-layer */, /* http-response-handler */);

// Use your api
api.Repos.userRepos.call({username : 'gugamm'});
```

This will initialize your request, dispatch the "FETCH" action to your store. Once it completes, it will dispatch the "FETCH_COMPLETE" action with the response.

One thing to notice here is the `http-layer` and `http-response-handler` parameters. This library is isomorphic and was made to work with any kind of http library out there(fetch, axios, jquery...). For this to work, when creating a mapper, you must specify an object to handle the http request and an function to handle the result that the http-layer will produce (Promise, Observables...) and dispatch new state, so the library can dispatch the correct actions to your store. More on this in the documentation. 

## Dependencies

React
