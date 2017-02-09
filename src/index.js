const PRE_FETCH  = "@@PRE_FETCH";
const COMPLETED  = "@@COMPLETED";
const ERROR      = "@@ERROR";
const CANCELLED  = "@@CANCELLED";

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
    call    : buildCallMethod(mapper, resource, mapper[resource.name][endPoint.name])
  };
}

/**
 * Build a function that receive parameters, headers, body and options and dispatch a request to the correct http layer method
 * @param {Object} mapper - Mapper object
 * @param {Object} resource - Resource object
 * @param {Object} endPoint - An end point object
 * @returns {Function}
 */
function buildCallMethod(mapper, resource, endPoint) {
  return function (params, headers, body, options) {
    const { httpLayer, httpResponseHandler } = mapper;
    const path = applyParamsToPath(resource.path + endPoint.path, params);
    const method = endPoint.method.toUpperCase();
    const headersBuilt = Object.assign({}, mapper.headers, resource.headers, endPoint.headers, headers);
    const request = buildRequest(mapper.host + path, path, params, headersBuilt, body, options);

    dispatchRequest(method, httpResponseHandler, mapper.store, endPoint.action, httpLayer, request);
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
  //dispatch pre-fetch action here
  dispatchState(store.dispatch, PRE_FETCH, action);

  switch (method) {
    case 'GET'  : httpResponseHandler(store, action, httpLayer.get(request)); break;
    case 'POST' : httpResponseHandler(store, action, httpLayer.post(request)); break;
  }

  throw new Error('Invalid method has been provided to this end point.');
}

/**
 * This is a helper function to dispatch a new action to the store based on the current state of the request
 * @param {Function} dispatch - The store dispatcher function
 * @param {String} state - The current state of the request
 * @param {Function} action - The function that receive a state and return an action or action creator
 * @param {*} payload - The payload to be dispatched
 */
function dispatchState(dispatch, state, action, payload) {
  let actionObj;

  if (typeof action === 'function')
    actionObj = action();
  else
    actionObj = action;

  if (payload)
    actionObj.payload = payload;

  dispatch(actionObj)
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


var config = {
  host : 'http://google.com',
  headers : {
    'authorization' : 'this is my token'
  },
  resources : [
    {
      name : 'Users',
      path : '/users',
      headers : {
        'Content-Type' : 'application/json'
      },
      endPoints : [
        {
          name : 'users',
          path : '',
          method : 'get',
          action : () => 'FETCH_USER'
        },
        {
          name : 'user',
          path : '/{id}',
          method : 'get',
          action : () => 'FETCH_USER'
        }
      ]
    }
  ]
};

const mapper = createMapper({}, config, {}, {});
console.log(mapper.Users);

mapper.Users.users.call();
