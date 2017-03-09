import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { createMapper, buildEndPointFunc, addResourceToMapper, addEndPointToResource } from '../../src/mapper/mapper';

/*
export function buildEndPointFunc(mEndPoint) {
  let endPointFunc = function (params, body, headers, options) {
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

    const request         = buildRequest(fullPath, eMethod, params, headers, body, options);
    const stateDispatcher = buildStateDispatcher(store, eAction, mEndPoint);

    if (!httpLayer[eMethod])
      throw new Error('Current http-layer do not support ' + eMethod + ' method');

    return httpLayer[eMethod](stateDispatcher, request);
  };

  return endPointFunc;
}

*/

describe('[MAPPER] - mapper', function () {
  const mockStore = {};
  const mockHttpLayer = { get : () => {}, mergeOptions : () => "MERGE_OPTIONS", mergeHeaders : () => "MERGE_HEADERS" };

  const MOCK_ENDPOINT_PATH = "/mock";
  const mockEndPoint = {
    name : "MOCK_NAME",
    path : MOCK_ENDPOINT_PATH,
    headers : {},
    options : {
      a : 'a',
      b : 'b'
    },
    method : 'get'
  };

  const MOCK_RESOURCE_PATH = "/mock";
  const mockResource = {
    "MOCK_NAME" : mockEndPoint,
    path : MOCK_RESOURCE_PATH,
    name : "MOCK_RESOURCE"
  };

  const MOCK_HOST = "http://test/api";
  const mapper = {
    store : mockStore,
    host : MOCK_HOST,
    httpLayer : mockHttpLayer,
    "MOCK_RESOURCE" : mockResource
  };


  sinon.stub(mockHttpLayer, 'get', () => "HTTP_LAYER_TEST");

  mockEndPoint._resource = mockResource;
  mockResource._mapper = mapper;

  it('should create a function', function () {
    expect(typeof buildEndPointFunc(mockEndPoint)).to.equal('function');
  });
});
