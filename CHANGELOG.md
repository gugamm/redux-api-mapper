## 1.1.0 (still testing)

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