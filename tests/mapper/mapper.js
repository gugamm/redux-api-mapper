import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { createMapper, buildEndPointFunc, addResourceToMapper, addEndPointToResource } from '../../src/mapper/mapper';

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
