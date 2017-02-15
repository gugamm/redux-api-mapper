# Redux-Api-Mapper

[![NPM Version](https://badge.fury.io/js/redux-api-mapper.svg)](https://www.npmjs.com/package/redux-api-mapper)

## Motivation

Many react/redux applications interact with an api. To solve this problem with redux, we use middlewares that are able to handle async actions, such as a http request. Using data in this approach is not wrong, however, sometimes it generates a lot of boilerplate. Especially when handling api requests.

## Solution

Redux-Api-Mapper for rescue! It's a small but powerful utility for mapping any api with a config definition and returning an object with methods for accessing your api. It will automatically dispatch actions for the store based on the state of the request.

## Documentation (updated to version 1.1.0)

* [Introduction](/docs/introduction.md)
* [Config shape](/docs/config.md)
* [Http-Layers](/docs/http-layers.md)
* [ApiProvider and apiConnect](/docs/api-provider.md)
* [Api Docs](/docs/api.md)
* [Code Splitting](/docs/code-splitting.md)

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
import { createMapper, stateToAction } from 'redux-api-mapper';
import { store } from './yourstorefile';

// Define the config
const config = /*...*/

// Create your api mapper
const api = createMapper(store, config, /* http-layer */);

// Use your api
api.Repos.userRepos.call({username : 'gugamm'});
```

This will initialize your request, dispatch the "FETCH" action to your store. Once it completes, it will dispatch the "FETCH_COMPLETE" action with the response.

One thing to notice here is the `http-layer`parameter. This library is isomorphic and was made to work with any kind of http library out there(fetch, axios, jquery...). For this to work, when creating a mapper, you <b>can(but not need to)</b> specify an object to handle the http request and dispatch new state, so the library can dispatch the correct actions to your store. <b>If you don't provide an http-layer, the library will use one by default.</b> 

## Todos

- [x] Add better "options" support
- [ ] Write tests
- [x] Add more http-layers (improved the default http-layer)
- [x] Better documentation
- [ ] Add support for mapperReducer (so we don't need to create reducers anymore)