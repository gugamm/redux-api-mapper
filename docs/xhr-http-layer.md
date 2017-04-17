# XhrHttpLayer

This section will provide you examples and all options supported by the XhrHttpLayer. This is *not* the default http-layer used by redux-api-mapper.

### How to use the XhrHttpLayer

This is the default http-layer. Once you create an apiMapper using `createMapper`, this will be the http-layer.

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

You can call this function to pass a listener for each state of the request. This way you can chain requests.

```js
  api.Users.getUsers()(
    (parsedResponse) => console.log('OnSuccess', response),
    (parsedResponse) => console.log('OnError', response),
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
`afterResponse` is a function called after the response have been parsed and the request has failed

#### afterAbort :: (Request) -> any
`afterResponse` is a function called after the response have been parsed and the request has been aborted

#### parseBody  :: (Body) -> ParsedBody
`parseBody` is a function called to parse a body before making the request.
The FetchHttpLayer already provides a default behavior for this. It parse the body into a string using `JSON.stringify`

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


