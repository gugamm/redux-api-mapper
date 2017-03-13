# Redux-Api-Mapper

[![NPM Version](https://badge.fury.io/js/redux-api-mapper.svg)](https://www.npmjs.com/package/redux-api-mapper)

## Motivation

Many react/redux applications interact with an api. To solve this problem with redux, we use middlewares that are able to handle async actions, such as a http request. Using this approach is not wrong, however, sometimes it generates a lot of boilerplate. Especially when handling api requests.

## Solution

Redux-Api-Mapper for rescue! It's a small but powerful utility for mapping any api with a simple config definition. You can create an object with methods for accessing your api. It will automatically dispatch actions for your reducers based on the state of the request. This library also create an apiReducer so you don't have to create any reducer or actions by hand.

## Documentation (updated to version 2.0.0)

* [Introduction](/docs/introduction.md)
* [ApiReducer](/docs/api-reducer.md)
* [Config shape](/docs/config.md)
* [ApiProvider and apiConnect](/docs/api-provider.md)
* [Api Docs](/docs/api.md)
* [Http-Layers](/docs/http-layers.md)

## Install

```bash
npm install --save redux-api-mapper
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
				name : 'getRepos',
				path : 'users/{username}/repos'
			}
		]
	}
  ]
}
```

This is a common javascript object. The cool parts to notice here is the `/users/{username}/repos` in the end point. Redux-Api-Mapper will automatically fullfill these parameter when making the request. Here is a full example:

```js
import { createMapper } from 'redux-api-mapper';
import { store } from './yourstorefile';

// Define the config
const config = /*...*/

// Create your api mapper
const api = createMapper(store, config);

// Use your api
api.Repos.getRepos({username : 'gugamm'});
```

Depending on how you are using this library, you can take advantage of the built-in api reducer, provide your own or use an external one. When making the request, the library will automatically dispatch actions to your reducers depending on the state of the request.

## Todos

- [x] Add better "options" support
- [ ] Write tests (writing)
- [x] Add more http-layers (improved the default http-layer)
- [x] Better documentation
- [x] Add api reducer