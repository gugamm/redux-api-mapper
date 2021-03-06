# XhrHttpLayer

This section will provide you examples and all options supported by the XhrHttpLayer. This is *not* the default http-layer used by redux-api-mapper.

### How to use the XhrHttpLayer

To use this http-layer, you need to import and pass as an argument to createMapper function.

```js
import { createMapper, XhrHttpLayer } from 'redux-api-mapper';
import store from './path_to_store';

const config =/*...*/;

//pass the xhrHttpLayer as a prop to createMapper
const apiMapper = createMapper(store, config, new XhrHttpLayer());
```

### Response Object
Here is the definition of the response object

```js
const response = {
    data: xhr.response,
    status: xhr.status,
    statusText: xhr.statusText,
    ok: (xhr.status >= 200 && xhr.status < 300),
    responseHeaders: xhr.getAllResponseHeaders(),
    getResponseHeader: xhr.getResponseHeader
}
```

### Return value
When using this http-layer, whenever you make a call to your api using one of your endPoints, this http-layer will return a function with the following definition:

`(onSuccess, onError, onAbort) -> Void`

You can call this function to **add** a listener for each state of the request. 

```js
/* Passing listeners directly */

  api.Users.getUsers()(
    (parsedResponse) => console.log('OnSuccess', parsedResponse),
    (parsedResponse) => console.log('OnError', parsedResponse),
    () => console.log('OnAbort')
  );
  
/* Using a "subscribe" variable to store the subscribe function (I recommend using this method because you can call the subscribe function many times you want) */
  const subscribe =  api.Users.getUsers();
  subscribe(
    (parsedResponse) => console.log('OnSuccess', parsedResponse),
    (parsedResponse) => console.log('OnError', parsedResponse),
    () => console.log('OnAbort')
  );
```

### Methods

#### abortRequest :: (EndPoint) -> Boolean
Abort the request of the provided endPoint(if any).

```js
  //This will abort the request of getUsers
  httpLayer.abortRequest(api.Users.getUsers);
```

### Supported options
Now let's take a look at all options supported by the XhrHttpLayer.

#### beforeRequest :: (Request) -> any
`beforeRequest` is a function called before starting the request. 

#### afterResponse :: (Request, ParsedResponse) -> any
`afterResponse` is a function called after the response have been parsed and the request has succeed

#### afterError :: (Request, ParsedResponse) -> any
`afterError` is a function called after the response have been parsed and the request has failed. A fail means a network error or a response status error like 500, 401, 400, 404...

#### afterAbort :: (Request) -> any
`afterAbort` is a function called after the response have been parsed and the request has been aborted

#### payload :: Object
`payload` is an object that will be used to merge with the action payload that will be dispatched. This prop is useful to pass extra data for reducers.

#### parseBody  :: (Body) -> ParsedBody
`parseBody` is a function called to parse a body before making the request.
This layer already provides a default behavior for this. It parse the body into a string using `JSON.stringify`

#### parseResponse :: (Response) -> ParsedResponse
`parseResponse` is a function called after the request has been completed. You can use this function to parse the response. 

#### memResponse :: Object | Function(Request) -> Response
`memResponse` is an option to help you at development when you don't have an api method implemented yet. You can provide a `memory response`, so every time you use the method you gonna get the memory response. You can also provide a function to this option.

#### delay :: Number
`delay` is a option used to delay the response of the emulated memory response. You can use this option to be able to see spinners.

#### cacheHandler :: (Request) -> any
`cacheHandler` is a function that you can use to implement a cache behavior. Whenever this function returns anything, it will be used as the response of the request. If this function does not return anything, then the request will be made.

#### responseType :: String
`responseType` is a string defining the responseType of the request. For more information go to [ResponseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType)

#### mimeType :: String
`mimeType` is a string defining the mimeType of the request. For more information go to [MimeType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Handling_binary_data)


