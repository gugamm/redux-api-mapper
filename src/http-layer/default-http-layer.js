import HttpMethods from '../mapper/http-methods';
import FetchStates from '../mapper/fetch-states';

export function createDefaultHttpLayer() {
  function doHttpRequest(stateDisptacher, method, request) {
    let requestCompleted = false;
    let requestCancelled = false;
    function loadHandler() {
      requestCompleted = true;
      let afterResponse  = request.options && request.options.afterResponse; //(response) => response
      let responseParse  = request.options && (request.options.responseParse || request.options.parseResponse); //(response) => any
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

      if (afterResponse)
        afterResponse(response);

      response = responseParse ? responseParse(response) : response;

      if (responseOk)
        stateDisptacher(FetchStates.FETCH_COMPLETED, response);
      else
        stateDisptacher(FetchStates.FETCH_ERROR, response);
    };

    let beforeRequest  = request.options && request.options.beforeRequest; //(request)  => void
    let bodyParse      = request.options && (request.options.bodyParse || request.options.parseBody);     //(body)     => body
    let xhr            = new XMLHttpRequest();

    xhr.addEventListener('load',loadHandler);
    xhr.open(method, request.fullPath, true);
    for (let hKey in request.headers)
      xhr.setRequestHeader(hKey, request.headers[hKey]);

    if (beforeRequest)
      beforeRequest(Object.assign({},request));

    stateDisptacher(FetchStates.FETCH_STARTED);
    xhr.send(bodyParse ? bodyParse(request.body) : request.body);

    return (payload) => {
      if (!requestCompleted && !requestCancelled) {
        requestCancelled = true;
        xhr.removeEventListener('load', loadHandler);
        xhr.abort();
        stateDisptacher(FetchStates.FETCH_CANCELLED, payload);
      }
    };
  }

  return {
    get : function (stateDisptacher, request) {
      return doHttpRequest(stateDisptacher, HttpMethods.GET, request);
    },
    put : function (stateDisptacher, request) {
      return doHttpRequest(stateDisptacher, HttpMethods.PUT, request);
    },
    post : function (stateDisptacher, request) {
      return doHttpRequest(stateDisptacher, HttpMethods.POST, request);
    },
    head : function (stateDisptacher, request) {
      return doHttpRequest(stateDisptacher, HttpMethods.HEAD, request);
    },
    delete : function (stateDisptacher, request) {
      return doHttpRequest(stateDisptacher, HttpMethods.DELETE, request);
    },
    patch : function (stateDisptacher, request) {
      return doHttpRequest(stateDisptacher, HttpMethods.PATCH, request);
    }
  }
};
