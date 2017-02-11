# Http-Layers and Response Handlers

This section will guide you to create your own Http-Layer and Response Handlers. Keep in mind that Redux-Api-Mapper has some default Http-Layers that you can use, but if you need something more specific, you can create your own.

### What is a Http-Layer

An ``http-layer`` is a plain javascript object with just a couple of few methods that you can implement. The methods are ``optional``. You just need to implement those that you know you gonna need.

### Why do we need a http-layer

This library is very flexible and tries to attend any implementation you need. When you do a request, you can be in a browser, in a server or anywhere. The http-layer is an object implementing all the http-methods. So when a call is made, the library will call the correct http-method in the http-layer. The http-layer should make the request. The problem is that the http-layer can return anything. Could be a Promise, an Observable, an XmlHttpRequest object... Anything. To handle this return value we gonna need a Response Handler.

### Response Handler

A response handler is a function that accept two arguments: ``stateDispatcher`` and ``httpLayerReturn``. This function will handle the return from the httpLayer and will dispatch the new state of the request. If the request is completed, we can dispatch a FETCH_COMPLETED. If something went wrong, we can dispatch a FETCH_ERROR.
Redux-Api-Mapper will then dispatch the correct action for the redux store based on the new state of the request.

### Lets create a Http-Layer

Lets create a http-layer that will use fetch and only handle "get" requests.

```js
//Remember: An http-layer is just an object with the http-methods

const myHttpLayer = {
   //All methods receive a request and can return anything
    get : function (request) {
        return fetch(request.fullPath); //we are returning a promise
    }
}
```
And that's it. We've created our own Http-Handler. Whenever we make a "get" request. This method will be called. Now we need something to handle this promise that we are returning. Lets create a Response Handler

```js
//Remember : A response handler is a function that receive a stateDispatcher and the httpLayerReturn

const promiseHandler = function (stateDispatcher, httpLayerReturn) {
    httpLayerReturn.then(response => response.json()).then(data => stateDispatcher(FETCH_STATES.FETCH_COMPLETED, data)); //we are not handling errors here, but we could
}

```

This handler will subscribe to the promise. Once the promise resolve, it will parse the response into json and dispatch the ``FETCH_COMPLETED`` state with the response data. Redux-Api-Mapper will dispatch the corresponding action for FETCH_COMPLETED (see in the config file how to do this), with the ``data`` as a payload to that action.

<b>And thats it! You've just created an http-layer and a response handler. Now you can pass them as a parameter to ``createMapper`` and your mapper will you your http-layer</b>

### Caveats
* There are some features we didn't covered here yet. That's because we are still in early release, but http-layers can receive aditional parameters for each request inside the "options" property of the request. You can implement any kind of behavior you want: like middlewares, automatically parse your data, or anything.
* We gonna cover these features soon. You will be able to set default options in your config definition, so you can pass parameters to your http-layer in a easy manner.
* At the moment you can only pass options as the 4th parameter of the "call" method
