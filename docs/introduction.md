# Introduction

Redux-Api-Mapper is a small library that will help you handle http requests. There are some concepts you should learn before getting started.

### Http layer

The api mapper doesn't know(by default) how to make a http request. We need to provide an object with this functionality. The http layer is a simple object with methods with the same name as http methods(get, post, put, patch...). This object can be created by anyone. It just need to follow the pattern. Each method receive a request object and can return anything. Anything? This looks strange... This is where the Http Layer response Handler comes into play.

### Http Layer Response Handler

As said above, the http layer receives an request object and can return anything. Can be a Promise, an Observable or some Mock data. However, it would be impossible for the api mapper to handle every possible cases. The Http Layer Response Handler is a function that receives an ``stateDispatcher`` and the ``httpResponse``. The httpResponse here is the result of a method from the httpLayer object. It can be a Promise, Observable or anything. Do not confuse with the real http response.<br />
The handler knows how to handle the ``httpResponse``. If it's an Observable, it can subscribe to it. If it's a Promise, it can wait the promise to resolve. Since he knows how to handle this, he will dispatch the new state of the request. At this point, the request can be COMPLETED, ERROR or CANCELLED. It's the responsability of the handler to dispatch the correct state using the ``stateDispatcher``.

### ApiProvider

If you come from redux. You've probably have used ``<Provider />`` before. This library has an ``ApiProvider`` for the same purpose, so you can ``connect`` your components to api methods and make calls from inside your components.

### apiConnect

``apiConnect`` is the function used to connect your components to api methods. It's very easy to use. Just as ``connect`` from react-redux is.

<b>Thats it! Now you know all hard stuff from redux-api-mapper.</b>

Go to the next section to learn about the api, build your own http-layer and more!
