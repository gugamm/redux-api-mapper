import { buildCallMethod } from './internals';
import { createPromiseBrowserHttpLayer, createPromiseResponseHandler } from './http-layers/browser-promise-layer';

/**
 * Creates an api mapper object
 * @param {Object} store - The redux store object
 * @param {Object} config - An object defining api mapper
 * @param {Object} [httpLayer] - An object for resolving http requests
 * @param {Function} [httpResponseHandler] - A function to handle the response from the http layer and dispatch new request state
 */
export function createMapper(store, config, httpLayer, httpResponseHandler) {
  let mapper = {};

  httpLayer           = httpLayer || createPromiseBrowserHttpLayer();
  httpResponseHandler = httpResponseHandler || createPromiseResponseHandler();

  mapper.host                = config.host;
  mapper.headers             = config.headers;
  mapper.httpResponseHandler = httpResponseHandler;
  mapper.httpLayer           = httpLayer;
  mapper.store               = store;

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
export function addResourceToMapper(mapper, resource) {
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
export function addEndPointToMapper(mapper, resource, endPoint) {
  mapper[resource.name][endPoint.name] = {
    path    : endPoint.path,
    headers : endPoint.headers,
    method  : endPoint.method,
    action  : endPoint.action,
    call    : buildCallMethod(mapper, resource, endPoint)
  };
}
