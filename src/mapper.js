let FETCH_STATES = require('./fetch-states');
let HTTP_METHODS = require('./http-methods');

/**
 * Creates an api mapper object
 * @param {Object} config - An object defining api mapper
 * @param {(Object|Function)} httpLayer - An object or function for resolving http requests
 */
function createMapper(store, config, httpLayer, httpResponseHandler) {
  let mapper = {};

  mapper.host = config.host;
  mapper.headers = config.headers;
  mapper.httpResponseHandler = httpResponseHandler;
  mapper.httpLayer = httpLayer;
  mapper.store = store;

  config.resources.forEach(
    resource => addResourceToMapper(mapper, resource)
  );

  return mapper;
}

/**
 * Add a resource to a mapper
 * @param {Object} mapper - An object mapper
 * @param {Object} resource - An object resource
 */
function addResourceToMapper(mapper, resource) {
  mapper[resource.name] = {path : resource.path, headers : resource.headers};
  resource.endPoints.forEach(
    endPoint => addEndPointToMapper(mapper, resource, endPoint)
  );
};

/**
 * Add the end point to the mapper.
 * @param {Object} mapper - An mapper object
 * @param {Object} resource - A resource object
 * @param endPoint
 */
function addEndPointToMapper(mapper, resource, endPoint) {
  mapper[resource.name][endPoint.name] = {
    path    : endPoint.path,
    headers : endPoint.headers,
    method  : endPoint.method,
    action  : endPoint.action,
    call    : buildCallMethod(mapper, resource, endPoint)
  };
}

/**
 * Build a function that receive parameters, headers, body and options and dispatch a request to the correct http layer method
 * The dispatch function will invoke middlewares and the responseHandler. The result of the call function will be the result of a
 * middleware or of the response handler. Middlewares are not supported yet
 * @param {Object} mapper - Mapper object
 * @param {Object} resource - Resource object
 * @param {Object} endPoint - An end point object
 * @returns {Function}
 */
function buildCallMethod(mapper, resource, endPoint) {
  return function (params, headers, body, options) {
    const { httpLayer, httpResponseHandler } = mapper;
    const path = applyParamsToPath(resource.path + endPoint.path, params);
    const method = (endPoint.method)? endPoint.method.toUpperCase() : HTTP_METHODS.GET;
    const headersBuilt = Object.assign({}, mapper.headers, resource.headers, endPoint.headers, headers);
    const request = buildRequest(mapper.host + path, path, params, headersBuilt, body, options);

    return dispatchRequest(method, httpResponseHandler, mapper.store, endPoint.action, httpLayer, request);
  };
};

/**
 * This function dispatch a pre-fetch action in the store and call the correct http layer method
 * @param {String} method
 * @param {Function} httpResponseHandler
 * @param {Object} store
 * @param {(Object|Function)} action
 * @param {Object} httpLayer
 * @param {Object} request
 */
function dispatchRequest(method, httpResponseHandler, store, action, httpLayer, request) {
  let stateDispatcher = buildStateDispatcher(store.dispatch, action);

  //dispatch pre-fetch action here
  stateDispatcher(FETCH_STATES.FETCH_STARTED);

  switch (method) {
    case HTTP_METHODS.GET     : return httpResponseHandler(stateDispatcher, httpLayer.get(request)); break;
    case HTTP_METHODS.PUT     : return httpResponseHandler(stateDispatcher, httpLayer.put(request)); break;
    case HTTP_METHODS.POST    : return httpResponseHandler(stateDispatcher, httpLayer.post(request)); break;
    case HTTP_METHODS.DELETE  : return httpResponseHandler(stateDispatcher, httpLayer.delete(request)); break;
    case HTTP_METHODS.HEAD    : return httpResponseHandler(stateDispatcher, httpLayer.head(request)); break;
    case HTTP_METHODS.PATCH   : return httpResponseHandler(stateDispatcher, httpLayer.patch(request)); break;
    default : return httpResponseHandler(stateDispatcher, httpLayer.get(request));
  }
}

/**
 * This is a helper function to dispatch a new action to the store based on the current state of the request
 * @param {Function} storeDispatcher - The store dispatcher function
 * @returns {Function} - A function that dispatch a new action to the store based on the state being dispatched
 */
function buildStateDispatcher(storeDispatcher, action) {
  return function (state, payload) {
    let actionResult = action(state);
    let actionObj;

    if (typeof actionResult === "function")
      actionObj = actionResult(payload);
    else if (typeof actionResult === "object")
      actionObj = Object.assign({}, actionResult, {payload});
    else
      throw new Error('Action mapper is not returning an action creator or action object. Cannot dispatch action to redux.');

    storeDispatcher(actionObj);
  }
}

/**
 * Apply params into a path
 * @param {String} path - A path string
 * @param {Object} params - An object containing all parameters
 * @returns {string} - A new string with the parameters applied
 */
function applyParamsToPath(path, params) {
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
function buildRequest(fullPath, path, params, headers, body, options) {
  return {fullPath, path, params, headers, body, options};
}

module.exports = {
  createMapper : createMapper,
  addResourceToMapper : addEndPointToMapper,
  addEndPointToMapper : addEndPointToMapper
};