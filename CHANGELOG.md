## 4.0.0 (05/23/2017)

### Bug fix
* Now FetchHttpLayer call beforeRequest and afterResponse even if it's a memResponse or cacheHandler

### Features
* New `params` config option. This option can be used to define default params to the request
* New `payload` option for FetchHttpLayer and XhrHttpLayer. It allows pass payload data to the action that will be dispatched to the reducers. (It can be used to pass the page that is being fetched, for example)
* `transfomer` is a new feature that allows `transform` the result of a http-layer into something else. This can be used to create a single use interface even by changing http-layers. For example, you can `transform` the response of the XhrHttpLayer into a Promise. This will make the XhrHttpLayer work like the FetchHttpLayer.

### Breaking changes
* Removed `mergeHeaders` optional method for `http-layers`. Only the default implementation is used now. (Note that the `mergeOptions` is still available and will always be)

## 3.7.1 (05/07/2017)

### Bug fix
* Fix invalid buildActionHandler internal call

## 3.7.0 (04/29/2017)

### Features

* New `name` prop at root level. If using multiple `apiMappers` and multiple `apiReducers`, it's possible that you may end up with the same combination of `resource name` + `end-point name`. To solve this problem, you can add a `name` property to your root configuration. This will make the api reducers more unique and it will avoid conflicts. This prop is totally optional. It's only a new feature and should only be used if you are mapping more than one api at the same time. 

## 3.6.0 (04/18/2017)

### Features

* new `reducerData` config prop. You can use this prop to provide an initial data for your api reducer. You can set this prop at config, resource or endPoint level.

## 3.5.1 (04/17/2017)

### Features

* New http-layer (`XhrHttpLayer`). Please read the documentation

### Patch

* Add docs for `XhrHttpLayer`
* Fix a small bug on cacheHandler for `XhrHttpLayer`

## 3.4.0 (04/17/2017)

### Features

* `Request` object now has `api`, `resource`, `endPoint` too.

## 3.3.2 (04/07/2017)

### Features

* FetchHttpLayer support `credentials` option

## 3.2.1 (04/07/2017)

### Features

* FetchHttpLayer `memResponse` (in case of a function) receive the request as a parameter.

## 3.1.1 (04/07/2017)

### Breaking Changes

* FetchHttpLayer `timeout` renamed to `delay`

### Features

* FetchHttpLayer `memResponse` can be a function
* FetchHttpLayer `errorHandler` is called with the error object. The result of this function will be dispatched to the store with FetchState = Error

## 3.0.0 (04/05/2017)

### Features

* New http-layer (FetchHttpLayer)
* New options supported by the default http-layer
* parseResponse and parseBody has a default behavior to work with json data
* Default http-layer support memory response and timeout using `memResponse` and `timeout` options
* Default http-layer support cacheHandler. A function called with the request to be made. If the function returns anything, then this will be the response of the request.
* FetchHttpLayer returns a promise, so it's now possible to chain requests.

### Breaking Changes

* Default http-layer is now FetchHttpLayer
* FetchHttpLayer makes use of the isomorphic-fetch library
* It's not possible to cancel a request anymore. By using the default http-layer(FetchHttpLayer), the result of calling an EndPoint is a Promise.

## 2.1.1 (03/13/2017)

### Features

* It's possible to dispatch actions to a specific end point reducer by using `endPoint.dispatch(action)`.

## 2.0.1 (03/12/2017)

### Features

* Update documentation

## 2.0.0 (03/12/2017)

### Features

* Api reducer. Each endpoint has a reducer. The reducer can be customized.
* stateToAction is optional now since in most cases we only need the reducer
* New configs props : reducerName and reducerBuilder
* Added createApiReducer

### Breaking Changes

* No more "call" method. All methods are called directly by the end point name.
* End point methods are now (params, body, headers, options)
* Removed mock mapper
* Removed addResourceToMapper
* Removed addEndPointToMapper

## 1.2.3 (03/04/2017)

### Features

* createMockMapper - Creates an api mock mapper for testing
* request state handler now can be: "an action object" or a function returning an action object or an array of action object or action creators, or returning nothing(in this case, the handler can dispatch the objects itself)
* request state handler now has this signature : (parsedResponse, apiMapper, storeDispatcher) => null|undefined|Array<Obj|Fn>|Obj

### Bug fix

* Fix multiple exports of the same module

## 1.1.2 (03/02/2017)

### Features

* apiProvider pass the api and ownProps to the mapper function
* Default http-layer accept both "parseResponse" or "responseParse" and "bodyParse" or "parseBody"

## 1.1.1 (02/16/2017)

### Features

* Headers can have a function as a value. The function will be called on merge before doing the request.

## 1.1.0 (02/15/2017)

### Breaking changes

* No more response http handler. All request state should be handled by the http-layer
* Http-layer now accept two arguments : stateDispatcher and Request
* The return of the http-layer will be the return of the "call" function

### Features

* Config can have an "options" property in config-level, resource-level, request-level or as a parameter to the call method
* The config will be merged by default into a sigle object. Http-layers can override this behavior by implementing mergeOptions method. This method accept 4 parameters(mapper.options, resource.options, endPoint.options, requestOptions) and must return a merged options
* Http-layers can override the merge default of the headers options too by implementing a mergeHeaders that accept 4 parameters in the same order as mergeOptions and must return the merged header
* The default http-layer support 4 options to be defined in the config : beforeRequest, afterResponse, bodyParse, responseParse. Since the default htt-layer do not override the default merge behavior of options, the inner defined options will execute. beforeRequest accept a request object. afterResponse accept a response object, afterResponse accept a response object. bodyParse accept the body and must return a new body, responseParse accept a response object and can return anything to be passed to actions.
* After a "call", the default http-layer returns a cancel function. This function can be used to cancel a request. A parameter can be passed as a payload to be dispatched in actions.

## 1.0.9 (02/14/2017)

### changes

* Fix null and undefined check bug in version 1.0.8


## 1.0.8 (02/14/2017)

### changes

* stateToAction can receive null as parameter, so action will not be dispatched

## 1.0.7 (02/11/2017)

### Breaking changes

* Default http-layer constructor is not exported anymore. It is used by default if no layer is passed to ``createMapper``
