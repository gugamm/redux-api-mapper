import HttpMethods from './http-methods';
import buildRequestPath from '../utils/path-builder';
import buildRequest from './request';
import buildStateDispatcher from './state-dispatcher';
import buildActionBuilder from '../reducer/action-builder';
import { FetchHttpLayer } from '../http-layers';
import { mergeHeaders, mergeOptions } from '../utils/merge';

export function createMapper(store, config, httpLayer) {
  let mapper = {
    store      : store,
    name       : config.name,
    httpLayer  : (httpLayer) ? httpLayer : new FetchHttpLayer(),
    host       : config.host,
    headers    : config.headers,
    options    : config.options
  };

  const resources = config.resources;

  resources.forEach(resource => {
    addResourceToMapper(mapper, resource);
  });

  return mapper;
}

export function addResourceToMapper(mapper, resource) {
  let mResource = {
    _mapper : mapper,
    name    : resource.name,
    path    : resource.path,
    headers : resource.headers,
    options : resource.options
  };

  const endPoints = resource.endPoints;

  endPoints.forEach(endPoint => {
    addEndPointToResource(mResource, endPoint);
  });

  mapper[resource.name] = mResource;
}

export function addEndPointToResource(resource, endPoint) {
  let mEndPoint = {
    _resource : resource,
    name      : endPoint.name,
    path      : endPoint.path,
    headers   : endPoint.headers,
    options   : endPoint.options,
    method    : (endPoint.method) ? endPoint.method : HttpMethods.GET,
    action    : endPoint.action
  };

  let actionBuilder = buildActionBuilder(resource.name, endPoint.name, resource._mapper.name);

  resource[endPoint.name]            = buildEndPointFunc(mEndPoint);
  resource[endPoint.name].path       = mEndPoint.path;
  resource[endPoint.name].headers    = mEndPoint.headers;
  resource[endPoint.name].options    = mEndPoint.options;
  resource[endPoint.name].method     = mEndPoint.method;
  resource[endPoint.name].action     = mEndPoint.action;
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

export function buildEndPointFunc(mEndPoint) {
  return function (params, body, headers, options) {
    const mapper    = mEndPoint._resource._mapper;
    const resource  = mEndPoint._resource;
    const httpLayer = mEndPoint._resource._mapper.httpLayer;
    const store     = mapper.store;

    const ePath    = resource[mEndPoint.name].path;
    const eHeaders = resource[mEndPoint.name].headers;
    const eOptions = resource[mEndPoint.name].options;
    const eAction  = resource[mEndPoint.name].action;
    const eMethod  = resource[mEndPoint.name].method;

    const fullPath = buildRequestPath(mapper.host, resource.path, ePath, params);

    if (httpLayer.mergeHeaders)
      headers = httpLayer.mergeHeaders(mapper.headers, resource.headers, eHeaders, headers);
    else
      headers = mergeHeaders(mapper.headers, resource.headers, eHeaders, headers);

    if (httpLayer.mergeOptions)
      options = httpLayer.mergeOptions(mapper.options, resource.options, eOptions, options);
    else
      options = mergeOptions(mapper.options, resource.options, eOptions, options);

    const request = buildRequest(fullPath, eMethod, params, headers, body, mapper, resource, resource[mEndPoint.name], options);
    const stateDispatcher = buildStateDispatcher(store, eAction, mEndPoint);

    if (!httpLayer[eMethod])
      throw new Error('Current http-layers do not support ' + eMethod + ' method');

    return httpLayer[eMethod](stateDispatcher, request);
  };
}

