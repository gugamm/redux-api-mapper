# FetchHttpLayer

This section will provide you examples and all options supported by the FetchHttpLayer. This is the default http-layer used by redux-api-mapper and it's build on top of isomorphic-fetch.

### How to use the FetchHttpLayer

Since this is the default http-layer, once you create an apiMapper using `createMapper`, this will be the http-layer.

```js
import { createMapper } from 'redux-api-mapper';
import store from './path_to_store';

const config =/*...*/;

//This mapper will use the FetchHttpLayer by default
const apiMapper = createMapper(store, config);
```

### The returned value

This layer returns a `Promise<ParsedResponse>`.

```js
//create apiMapper...
apiMapper.Users.getUsers().then(users => console.log(users)).catch(err => console.err(err));

```

### Supported options
Now let's take a look at all options supported by the FetchHttpLayer.

#### beforeRequest :: (Request) -> any
`beforeRequest` is a function called before starting the request. 

#### afterResponse :: (Request, ParsedResponse) -> any
`afterResponse` is a function called after the response have been parsed

#### parseBody  :: (Body) -> ParsedBody
`parseBody` is a function called to parse a body before making the request.
The FetchHttpLayer already provides a default behavior for this. It parse the body into a string using `JSON.stringify`

#### parseResponse :: (Response) -> Promise\<ParsedResponse\>
`parseResponse` is a function called after the request has been completed. You can use this function to parse the response. The FetchHttpLayer already provides a default behavior for this function. It uses response.json(). Please refer to the [FetchApi](https://github.com/github/fetch) for more information about the `Response` object.

#### memResponse :: Object | Function(Request) -> Response
`memResponse` is an option to help you at development when you don't have an api method implemented yet. You can provide a `memory response`, so every time you use the method you gonna get the memory response. You can also provide a function to this option.

#### delay :: Number
`delay` is a option used to delay the response of the emulated memory response. You can use this option to be able to see spinners.

#### errorHandler :: (Error) -> any
`errorHandler` is a function called when there is a connection error or parsing error. You can handle this error and return an object that will be dispatched to your store. For example, you can return an message to be displayed in the ui. For the `Error` object, please see refer to [FetchApi](https://github.com/github/fetch). 

#### cacheHandler :: (Request) -> any
`cacheHandler` is a function that you can use to implement a cache behavior. Whenever this function returns anything, it will be used as the response of the request. If this function does not return anything, then the request will be made.

#### credentials :: String
`creadentials` is an option used internally by the [FetchApi](https://github.com/github/fetch). Please refer to the Fetch Api documentation for more information on how to use it.
