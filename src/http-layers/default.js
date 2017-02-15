import HttpMethods from '../http-methods';
import FetchStates from '../fetch-states';

/**
 * Create a browser http layer. A request will return a function that can be used to abort the request. An argument can be passed
 * to the function. It will be dispatched to the store. If action is a function, then the argument will be passed to the function
 * creator.
 * Options Supported :
 *  beforeRequest
 *  bodyParse
 *  afterResponse
 *  responseParse
 *
 * @returns {{get: get, put: put, post: post, head: head, delete: delete, patch: patch}}
 */
export function createDefaultHttpLayer() {
  function doHttpRequest(stateDisptacher, method, request) {
    function loadHandler() {
      let afterResponse  = request.options && request.options.afterResponse; //(response) => response
      let responseParse  = request.options && request.options.responseParse; //(response) => any
      const xhr          = this;

      let response    = {
        data              : xhr.response,
        status            : xhr.status,
        statusText        : xhr.statusText,
        getResponseHeader : xhr.getResponseHeader,
        request           : request,
        method            : method,
        ok: (xhr.status >= 200 && xhr.status <= 299)
      };
      let responseOk  = response.ok;

      let newResponse = afterResponse && afterResponse(response);

      if (newResponse)
        response = newResponse;

      response = responseParse ? responseParse(response) : response;

      if (responseOk)
        stateDisptacher(FetchStates.FETCH_COMPLETED, response);
      else
        stateDisptacher(FetchStates.FETCH_ERROR, response);
    };

    let beforeRequest  = request.options && request.options.beforeRequest; //(request)  => void
    let bodyParse      = request.options && request.options.bodyParse;     //(body)     => body
    let xhr            = new XMLHttpRequest();

    xhr.addEventListener('load',loadHandler);
    xhr.open(method, request.fullPath, true);
    for (let hKey in request.headers)
      xhr.setRequestHeader(hKey, request.headers[hKey]);

    if (beforeRequest)
      beforeRequest(request);

    stateDisptacher(FetchStates.FETCH_STARTED);
    xhr.send(bodyParse ? bodyParse(request.body) : request.body);

    return (payload) => {
      xhr.removeEventListener('load');
      xhr.abort();
      stateDisptacher(FetchStates.FETCH_CANCELLED, payload);
    };
  }

  return {
    get : function (stateDisptacher, request) {
      doHttpRequest(stateDisptacher, HttpMethods.GET, request);
    },
    put : function (stateDisptacher, request) {
      doHttpRequest(stateDisptacher, HttpMethods.PUT, request);
    },
    post : function (stateDisptacher, request) {
      doHttpRequest(stateDisptacher, HttpMethods.POST, request);
    },
    head : function (stateDisptacher, request) {
      doHttpRequest(stateDisptacher, HttpMethods.HEAD, request);
    },
    delete : function (stateDisptacher, request) {
      doHttpRequest(stateDisptacher, HttpMethods.DELETE, request);
    },
    patch : function (stateDisptacher, request) {
      doHttpRequest(stateDisptacher, HttpMethods.PATCH, request);
    }
  }
};