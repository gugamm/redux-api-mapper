# Http-Layers

This section will guide you to create your own Http-Layer. Keep in mind that Redux-Api-Mapper has a default Http-Layer. If you don't specify a http layer when creating the mapper with ``createMapper``, the default http-layer will be used.

### What is a Http-Layer

An ``http-layer`` is a plain javascript object with just a couple of few methods that you can implement. The methods are ``optional``. You just need to implement those that you know you gonna need.

### Why do we need a http-layer

This library is very flexible and tries to attend any implementation you need. When you do a request, you can be in a browser, in a server or anywhere. The http-layer is an object implementing all the http-methods. So when a call is made, the library will call the correct http-method in the http-layer. The http-layer should make the request. Since he is responsible for making the request, he can also be responsible for dispatching the state of the request(we will see that in action).

### Lets create a Http-Layer

Lets create a http-layer that will use fetch and only handle "get" requests.

```js
//Remember: An http-layer is just an object with the http-methods

const myHttpLayer = {
   //All methods receive a stateDispatcher and a request and can return anything(the return will be the return of the call function)
    get : function (stateDispatcher, request) {
        stateDispatcher(FETCH_STARTED);
        fetch(request.fullPath).then(response => stateDispatcher(FETCH_COMPLETED, response)); 
    }
}
```
And that's it. We've created our own Http-Handler. Whenever we make a "get" request. This method will be called. 

### Accepting options

This is an advanced feature and it's where things start to get cool. We can chose to support any options we want. Supose we want to extend our simple http-layer to suport an option that will parse the response after the response has been received.

So the option could be : parseResponse(response) => newResponse

```js
const myHttpLayer = {
   //All methods receive a stateDispatcher and a request and can return anything(the return will be the return of the call function)
    get : function (stateDispatcher, request) {
      //Here we are receiving the parseResponse options
      var parser = (request.options.parseResponse) || ((response) => response);
      stateDispatcher(FETCH_STARTED);
        fetch(request.fullPath).then(response => stateDispatcher(FETCH_COMPLETED, parse(response))); 
    }
}
```

<b>That's it! You can implement any options you would like to. For example the default http-layer support ``beforeRequest``, ``afterResponse``, ``parseResponse``, ``parseBody``.</b>

### Merge options and merge headers

By default, the redux-api-mapper will merge the configuration from outsite to inside, which means that everything we define in a endPoint, would override the definitions in a Resource for example.

We can change this behavior by implementing ``mergeOptions`` and ``mergeHeaders`` in our layers.

```js
const myHttpLayer = {
  mergeOptions : function (mapperOptions, resourceOptions, endPointOptions, requestOptions) {
      return Object.assign({}, requestOptions, endPointOptions, resourceOptions, mapperOptions);
    },
  mergeHeaders : function (mapperHeaders, resourceHeaders, endPointHeaders, requestHeaders) {
     return Object.assign({}, requestHeaders, endPointHeaders, resourceHeaders, mapperHeaders);
  }   
}
```

Here we changed how the merge works. We are merging from inside to outside. You can do anything here. This is very powerful. 

For example, if the user define ``parseResponse`` at the resource and the endPoint, we could, instead of overriding, chain these parses. This is useful for logging for example.
