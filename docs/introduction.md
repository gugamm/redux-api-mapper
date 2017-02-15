# Introduction

Redux-Api-Mapper is a small library that will help you handle http requests. There are some concepts you should learn before getting started.

### Http layer

The api mapper doesn't know how to make a http request. We need to provide an object with this functionality. The http layer is a simple object with methods with the same name as http methods(get, post, put, patch...). This object can be created by anyone. It just need to follow the pattern. Each method receive a stateDispatcher and request object and can return anything. The return will be the return of the ``call`` method. The library already has a default http-layer, so you don't need to implement yours.

### ApiProvider

If you come from redux. You've probably have used ``<Provider />`` before. This library has an ``ApiProvider`` for the same purpose, so you can ``connect`` your components to api methods and make calls from inside your components.

### apiConnect

``apiConnect`` is the function used to connect your components to api methods. It's very easy to use. Just as ``connect`` from react-redux is.


### States of a request

A request can be in 4 states : ``Starting``, ``Completed``, ``Error``, ``Cancelled``. This library support all of these states. The default http-layer also helps you cancel an http-request after it has been started.

<b>Thats it! Now you know all hard stuff from redux-api-mapper.</b>

Go to the next section to learn about the api, build your own http-layer and more!
