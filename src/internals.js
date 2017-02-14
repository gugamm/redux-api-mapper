import FetchStates from './fetch-states';
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
  return function (params, headers, body, options) {
    const { httpLayer, httpResponseHandler } = mapper;
    const path = applyParamsToPath(resource.path + endPoint.path, params);
    const method = (endPoint.method)? endPoint.method.toUpperCase() : HttpMethods.GET;
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
export function dispatchRequest(method, httpResponseHandler, store, action, httpLayer, request) {
  let stateDispatcher = buildStateDispatcher(store.dispatch, action);

  //dispatch pre-fetch action here
  stateDispatcher(FetchStates.FETCH_STARTED);

  let lMethod = method ? method.toLowerCase() : 'get';

  if (httpLayer[lMethod]) //method is implemented
    return httpResponseHandler(stateDispatcher, httpLayer[lMethod](request));
  else //method is not implemented
    throw new Error(`Method ${lMethod} is not supported by http-layer`);
}

/**
 * This is a helper function to dispatch a new action to the store based on the current state of the request
 * @param {Function} storeDispatcher - The store dispatcher function
 * @returns {Function} - A function that dispatch a new action to the store based on the state being dispatched
 */
export function buildStateDispatcher(storeDispatcher, action) {
  return function (state, payload) {
    let actionResult = action(state);
    let actionObj;

    if (typeof actionResult === "function")
      actionObj = actionResult(payload);
    else if (typeof actionResult === "object")
      actionObj = Object.assign({}, actionResult, {payload});
    else if (actionResult === null || actionResult === undefined)
      return;
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
