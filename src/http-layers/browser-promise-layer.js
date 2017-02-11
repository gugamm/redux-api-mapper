import HttpMethods from '../http-methods';
import FetchStates from '../fetch-states';

/**
 * Create a promise based browser http layer. A request will return a promise that will resolve in a response object
 * @returns {{get: get, put: put, post: post, head: head, delete: delete, patch: patch}}
 */
export function createPromiseBrowserHttpLayer() {
  function doHttpRequest(method, request) {
    return new Promise(function (resolve) {
      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          const response = {
            data : xhr.response,
            status: xhr.status,
            statusText: xhr.statusText,
            getResponseHeader: xhr.getResponseHeader,
            request: request,
            method: method,
            ok: (xhr.status >= 200 && xhr.status <= 299)
          };
          resolve(response);
        }
      };
      xhr.open(method, request.fullPath, true);
      for (let hKey in request.headers)
        xhr.setRequestHeader(hKey, request.headers[hKey]);
      xhr.send(request.body);
    });
  }

  return {
    get : function (request) {
      return doHttpRequest(HttpMethods.GET, request);
    },
    put : function (request) {
      return doHttpRequest(HttpMethods.PUT, request);
    },
    post : function (request) {
      return doHttpRequest(HttpMethods.POST, request);
    },
    head : function (request) {
      return doHttpRequest(HttpMethods.HEAD, request);
    },
    delete : function (request) {
      return doHttpRequest(HttpMethods.DELETE, request);
    },
    patch : function (request) {
      return doHttpRequest(HttpMethods.PATCH, request);
    }
  }
};

/**
 * Create a promise response handler. It can be used with the default PromiseBrowserHttpLayer. When a response complete, it will
 * dispatch a FETCH_COMPLETED state or a FETCH_ERROR state on error. The state which will be transformed by the action transformer
 * function defined in the end point.
 * @returns {Function}
 */
export function createPromiseResponseHandler() {
  return function (stateDispatcher, httpLayerResult) {
    httpLayerResult.then(
      response => {
        if (response.ok)
          stateDispatcher(FetchStates.FETCH_COMPLETED, response);
        else
          stateDispatcher(FetchStates.FETCH_ERROR, response);
      }
    )
  }
}
