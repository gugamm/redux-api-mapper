import FetchStates from '../mapper/fetch-states';
import HttpMethods from '../mapper/http-methods';

import 'isomorphic-fetch';

class FetchHttpLayer {
  handleRequest(stateDispatcher, request, method) {
    const beforeRequest     = request.options.beforeRequest || (() => {});
    const afterResponse     = request.options.afterResponse || (() => {});
    const parseResponse     = request.options.parseResponse || request.options.responseParse || ((r) => r.json());
    const parseBody         = request.options.parseBody     || request.options.bodyParse     || ((b) => JSON.stringify(b));

    const cacheHandler      = request.options.cacheHandler;
    const errorHandler      = request.options.errorHandler  || ((e) => console.error(e));
    const timeout           = request.options.timeout;
    const memResponse       = request.options.memResponse;

    if (memResponse !== undefined) {
      return new Promise((resolve) => {
        if (timeout > 0) {
          stateDispatcher(FetchStates.FETCH_STARTED);
          setTimeout(() => {
            stateDispatcher(FetchStates.FETCH_COMPLETED, memResponse);
            resolve(memResponse)
          }, timeout);
        }
        else {
          stateDispatcher(FetchStates.FETCH_COMPLETED, memResponse);
          resolve(memResponse);
        }
      });
    }

    if (cacheHandler) {
      const cacheResponse = cacheHandler(request);

      if (cacheResponse !== undefined) {
        return new Promise((resolve) => {
          stateDispatcher(FetchStates.FETCH_COMPLETED, cacheResponse);
          resolve(cacheResponse);
        });
      }
    }

    beforeRequest(request);
    stateDispatcher(FetchStates.FETCH_STARTED);
    fetch(request.fullPath, {
      method  : method,
      headers : request.headers,
      body    : parseBody(request.body)
    }).then(
      response => {
        return new Promise((resolve) => {
          let hasError = (response.status < 200 || response.status >= 300);

          parseResponse(response).then(
            parsedResponse => {
              afterResponse(request, parsedResponse);

              if (hasError)
                stateDispatcher(FetchStates.FETCH_ERROR, parsedResponse);
              else
                stateDispatcher(FetchStates.FETCH_COMPLETED, parsedResponse);

              resolve(parsedResponse);
            }
          );
          
        });
      }
    ).catch(errorHandler);
  }

  get(stateDispatcher, request) {
    return this.handleRequest(stateDispatcher, request, HttpMethods.GET);
  }

  post(stateDispatcher, request) {
    return this.handleRequest(stateDispatcher, request, HttpMethods.POST);
  }

  put(stateDispatcher, request) {
    return this.handleRequest(stateDispatcher, request, HttpMethods.PUT);
  }

  delete(stateDispatcher, request) {
    return this.handleRequest(stateDispatcher, request, HttpMethods.DELETE);
  }

  patch(stateDispatcher, request) {
    return this.handleRequest(stateDispatcher, request, HttpMethods.PATCH);
  }

  head(stateDispatcher, request) {
    return this.handleRequest(stateDispatcher, request, HttpMethods.HEAD);
  }
}

export default FetchHttpLayer;