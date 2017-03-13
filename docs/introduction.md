# Introduction

Redux-Api-Mapper is a small library that will help you handle http requests. There are some concepts you should learn before getting started.

### ApiProvider

If you come from redux. You've probably have used ``<Provider />`` before. This library has an ``ApiProvider`` for the same purpose, so you can ``connect`` your components to api methods and make calls from inside your components.

### apiConnect

``apiConnect`` is the function used to connect your components to api methods. It's very easy to use. Just as ``connect`` from react-redux is.

### States of a request

A request can be in 4 states : ``Starting``, ``Completed``, ``Error``, ``Cancelled``. This library support all of these states. The default http-layer also helps you cancel an http-request after it has been started.

### apiReducer

This library helps you to build a reducer to keep track of the state of all your api requests. This way, you don't have to create a reducer for each request. For each end point, a default reducer is created. It's possible to override the default reducer at Global, Resource and EndPoint level.

<b>Thats it! Now you know all hard stuff from redux-api-mapper.</b>
