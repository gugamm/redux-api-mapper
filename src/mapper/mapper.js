import HttpMethods from './http-methods';
import buildRequestPath from '../utils/path-builder';
import buildRequest from './request';
import buildStateDispatcher from './state-dispatcher';
import buildActionBuilder from '../reducer/action-builder';
import { FetchHttpLayer } from '../http-layers';
import advancedMerge from '../utils/merge';

/**
 * Create an api object for mapping an api
 * @param {Object} store - redux store
 * @param {Object} config - Configuration object
 * @param {Object} [httpLayer] - http layer object
 * @param {Function} [transformer] - a transformer function that takes the http layer response and transform into something else
 * @returns {{store: *, name: String, httpLayer: Object, host: String, headers: Object.<String, (String|Function)>, options: Object}}
 */
export function createMapper(store, config, httpLayer, transformer) {
  let mapper = {
    store      : store,
    name       : config.name,
    httpLayer  : (httpLayer) ? httpLayer : new FetchHttpLayer(),
    host       : config.host,
    params     : config.params,
    headers    : config.headers,
    options    : config.options,
    transformer: transformer || ((httpLayerResponse) => httpLayerResponse)
  };

  const resources = config.resources;

  resources.forEach(resource => {
    addResourceToMapper(mapper, resource);
  });

  return mapper;
}

function addResourceToMapper(mapper, resource) {
  let mResource = {
    _mapper : mapper,
    name    : resource.name,
    path    : resource.path,
    params  : resource.params,
    headers : resource.headers,
    options : resource.options
  };

  const endPoints = resource.endPoints;

  endPoints.forEach(endPoint => {
    addEndPointToResource(mResource, endPoint);
  });

  mapper[resource.name] = mResource;
}

function addEndPointToResource(resource, endPoint) {
  let mEndPoint = {
    _resource : resource,
    name      : endPoint.name,
    path      : endPoint.path,
    params    : endPoint.params,
    headers   : endPoint.headers,
    options   : endPoint.options,
    method    : (endPoint.method) ? endPoint.method : HttpMethods.GET,
    action    : endPoint.action
  };

  let actionBuilder = buildActionBuilder(resource.name, mEndPoint.name, resource._mapper.name);

  resource[endPoint.name]            = buildEndPointFunc(mEndPoint);
  resource[endPoint.name].path       = mEndPoint.path;
  resource[endPoint.name].headers    = mEndPoint.headers;
  resource[endPoint.name].options    = mEndPoint.options;
  resource[endPoint.name].method     = mEndPoint.method;
  resource[endPoint.name].action     = mEndPoint.action;
  resource[endPoint.name].params     = mEndPoint.params;
  resource[endPoint.name].clearState = function () {
    let { dispatch } = resource._mapper.store;
    dispatch({type : actionBuilder("CLEAR_STATE")});
  };
  resource[endPoint.name].dispatch   = function (action) {
    if (action.type)
      action.type = actionBuilder(action.type);

    resource._mapper.store.dispatch(action);
  }
}

function buildEndPointFunc(mEndPoint) {
  return function (params, body, headers, options) {
    const mapper      = mEndPoint._resource._mapper;
    const transformer = mapper.transformer;
    const resource    = mEndPoint._resource;
    const endPoint    = resource[mEndPoint.name];
    const httpLayer   = mEndPoint._resource._mapper.httpLayer;
    const store       = mapper.store;

    const ePath    = endPoint.path;
    const eHeaders = endPoint.headers;
    const eOptions = endPoint.options;
    const eAction  = endPoint.action;
    const eMethod  = endPoint.method;

    const mapperParams   = mapper.params || {};
    const resourceParams = resource.params || {};
    const endPointParams = endPoint.params || {};
    const requestParams  = advancedMerge(mapperParams, resourceParams, endPointParams, params);

    const fullPath = buildRequestPath(mapper.host, resource.path, ePath, requestParams);

    if (httpLayer.mergeHeaders)
      headers = httpLayer.mergeHeaders(mapper.headers, resource.headers, eHeaders, headers);
    else
      headers = advancedMerge(mapper.headers, resource.headers, eHeaders, headers);

    if (httpLayer.mergeOptions)
      options = httpLayer.mergeOptions(mapper.options, resource.options, eOptions, options);
    else
      options = advancedMerge(mapper.options, resource.options, eOptions, options);

    const request = buildRequest(fullPath, eMethod, requestParams, headers, body, mapper, resource, endPoint, options);

    const stateDispatcher = buildStateDispatcher(store, eAction, mEndPoint);

    if (!httpLayer[eMethod])
      throw new Error('Current http-layers do not support ' + eMethod + ' method');

    return transformer(httpLayer[eMethod](stateDispatcher, request));
  };
}
