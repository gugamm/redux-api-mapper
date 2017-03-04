import HttpMethods from './http-methods';

/**
 * Build a function that receive parameters, headers, body and options and dispatch a request to the correct http layer method
 * The dispatch function will invoke middlewares and the responseHandler. The result of the call function will be the result of a
 * middleware or of the response handler. Middlewares are not supported yet
 * @param {Object} mapper - Mapper object
 * @param {Object} resource - Resource object
 * @param {Object} endPoint - An end point object
 * @returns {Function}
 */
export function buildCallMethod(mapper, resource, endPoint) {
  return function (params, reqHeaders, reqBody, reqOptions) {
    const { httpLayer } = mapper;
    const path          = applyParamsToPath(resource.path + endPoint.path, params);
    const method        = (endPoint.method)? endPoint.method.toUpperCase() : HttpMethods.GET;
    const headersBuilt  = httpLayer.mergeHeaders ? httpLayer.mergeHeaders(mapper.headers, resource.headers, endPoint.headers, reqHeaders) : mergeHeaders(mapper.headers, resource.headers, endPoint.headers, reqHeaders);
    const optionsBuilt  = httpLayer.mergeOptions ? httpLayer.mergeOptions(mapper.options, resource.options, endPoint.options, reqOptions) : Object.assign({}, mapper.options, resource.options, endPoint.options, reqOptions);
    const request       = buildRequest(mapper.host + path, path, params, headersBuilt, reqBody, optionsBuilt);

    return dispatchRequest(method, mapper.store, endPoint.action, httpLayer, request, mapper);
  };
};

/**
 * Default implementation of merge headers. It also add support for functions, so a header value can be a function that will be called on merge
 * If the value or the function return null or undefined the header is not added to the merged headers object
 * @param mapperHeaders - Headers object
 * @param resourceHeaders - Headers object
 * @param endPointHeaders - Headers object
 * @param requestHeaders - Headers object
 * @returns {*} - New headers object
 */
function mergeHeaders(mapperHeaders, resourceHeaders, endPointHeaders, requestHeaders) {
  function headersToPlainObject(headers) {
    if (!headers)
      return null;

    let newHeaders = {};
    let hValue;

    for (let header in headers) {
      if (typeof headers[header] === 'function') {
        hValue = headers[header]();
        if (hValue !== null && hValue !== undefined)
          newHeaders[header] = hValue;
      }
      else
        if (headers[header])
          newHeaders[header] = headers[header];
    }

    return newHeaders;
  }

  return Object.assign({},
    headersToPlainObject(mapperHeaders),
    headersToPlainObject(resourceHeaders),
    headersToPlainObject(endPointHeaders),
    headersToPlainObject(requestHeaders)
  );
}

/**
 * This function build a stateDispatcher and call the correct http layer method
 * @param {String} method
 * @param {Object} store
 * @param {(Object|Function)} action
 * @param {Object} httpLayer
 * @param {Object} request
 * @param {Object} mapper
 */
export function dispatchRequest(method, store, action, httpLayer, request, mapper) {
  let stateDispatcher = buildStateDispatcher(store.dispatch, action, mapper);
  let lMethod = method ? method.toLowerCase() : 'get';

  if (httpLayer[lMethod]) //method is implemented
    return httpLayer[lMethod](stateDispatcher, request);
  else //method is not implemented
    throw new Error(`Method ${lMethod} is not supported by http-layer`);
}

/**
 * This is a helper function to dispatch a new action to the store based on the current state of the request
 * @param {Function} storeDispatcher - The store dispatcher function
 * @param {Function} action - A function that maps a state into an action
 * @param {Object} mapper - The api mapper
 * @returns {Function} - A function that dispatch a new action to the store based on the state being dispatched
 */
export function buildStateDispatcher(storeDispatcher, action, mapper) {
  function handleDispatchAction(actionToDispatch, payload) {
    //no action to dispatch
    if (actionToDispatch === null || actionToDispatch === undefined)
      return;

    //Multiple actions to dispatch
    if (Array.isArray(actionToDispatch)) {
      actionToDispatch.forEach(action => handleDispatchAction(action, payload));
      return;
    }

    let fnResult;

    //Function
    if (typeof actionToDispatch === 'function') {
      fnResult = actionToDispatch(payload, mapper, storeDispatcher);

      //no need to dispatch
      if (fnResult === null || fnResult === undefined)
        return;

      handleDispatchAction(fnResult, payload);
      return;
    }

    //Object
    if (typeof actionToDispatch === 'object') {
      storeDispatcher(actionToDispatch);
      return;
    }

    throw new Error('Cannot handle ' + typeof actionToDispatch + '. Invalid action dispatcher handler');
  }

  return function (state, payload) {
    let stateToAction = action(state);
    handleDispatchAction(stateToAction, payload);
  };
}

/**
 * Apply params into a path
 * @param {String} path - A path string
 * @param {Object} params - An object containing all parameters
 * @returns {string} - A new string with the parameters applied
 */
export function applyParamsToPath(path, params) {
  if (!params)
    return path;

  let queryString = "";
  let tmpPath = path.slice();
  for (let param in params) {
    let reg = new RegExp(`{${param}}`);
    const newPath = tmpPath.replace(reg, params[param]);
    if (newPath === tmpPath)
      queryString = (queryString) ? queryString + `&${param}=${params[param]}` : `${param}=${params[param]}`;
    tmpPath = newPath;
  }
  return (queryString) ? tmpPath + '?' + queryString : tmpPath;
}

/**
 * Build a request object
 * @param {String} fullPath - A full path containing host + path
 * @param {String} path - A path string
 * @param {Object} params - A parameters object
 * @param {Object} headers - A header object
 * @param {*} body - A body
 * @param {*} options - Optional parameters
 * @returns {{path: String, params: Object, headers: Object, body: *, options: *}}
 */
export function buildRequest(fullPath, path, params, headers, body, options) {
  return {fullPath, path, params, headers, body, options};
}
