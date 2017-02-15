import { buildCallMethod } from './internals';
import { createDefaultHttpLayer } from './http-layers/default';

/**
 * Creates an api mapper object
 * @param {Object} store - The redux store object
 * @param {Object} config - An object defining api mapper
 * @param {Object} [httpLayer] - An object for resolving http requests
 */
export function createMapper(store, config, httpLayer) {
  let mapper = {};

  mapper.httpLayer = httpLayer || createDefaultHttpLayer();
  mapper.host      = config.host;
  mapper.headers   = config.headers;
  mapper.options   = config.options;
  mapper.store     = store;

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
  mapper[resource.name] = {path : resource.path, headers : resource.headers, options : resource.options};
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
    options : endPoint.options,
    call    : buildCallMethod(mapper, resource, endPoint)
  };
}
