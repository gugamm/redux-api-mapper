import FetchStates from '../mapper/fetch-states';
import HttpMethods from '../mapper/http-methods';

import 'fetch-everywhere';

class FetchHttpLayer {
  handleRequest(stateDispatcher, request, method) {
    const beforeRequest     = request.options.beforeRequest || (() => {});
    const afterResponse     = request.options.afterResponse || (() => {});
    const parseResponse     = request.options.parseResponse || request.options.responseParse || ((r) => r.json());
    const parseBody         = request.options.parseBody     || request.options.bodyParse     || ((b) => b ? JSON.stringify(b) : b);
    const payload           = request.options.payload       || {};
    const cacheHandler      = request.options.cacheHandler;
    const errorHandler      = request.options.errorHandler  || ((e) => e);
    const delay             = request.options.delay;
    const memResponse       = request.options.memResponse;
    const credentials       = request.options.credentials;

    beforeRequest(request);
    stateDispatcher(FetchStates.FETCH_STARTED, payload);

    if (memResponse !== undefined) {
      const memResponseFn = (typeof memResponse === "function") ? memResponse : (() => memResponse);

      return new Promise((resolve) => {
        if (delay > 0) {
          stateDispatcher(FetchStates.FETCH_STARTED, payload);
          setTimeout(() => {
            const response = memResponseFn(request);

            stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: response }));
            afterResponse(response);
            resolve(response)
          }, delay);
        }
        else {
          const response = memResponseFn(request);

          stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: response }));
          afterResponse(response);
          resolve(response);
        }
      });
    }

    if (cacheHandler) {
      const cacheResponse = cacheHandler(request);

      if (cacheResponse !== undefined) {
        return new Promise((resolve) => {
          stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: cacheResponse }));
          afterResponse(cacheResponse);
          resolve(cacheResponse);
        });
      }
    }

    fetch(request.fullPath, {
      method      : method,
      headers     : request.headers,
      body        : parseBody(request.body),
      credentials : credentials
    }).then(
      response => {
        return new Promise((resolve) => {
          let hasError = (response.status < 200 || response.status >= 300);

          parseResponse(response).then(
            parsedResponse => {
              afterResponse(request, parsedResponse);

              if (hasError)
                stateDispatcher(FetchStates.FETCH_ERROR, Object.assign({}, payload, { data: parsedResponse }));
              else
                stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: parsedResponse }));

              resolve(parsedResponse);
            }
          );
          
        });
      }
    ).catch((e) => {
      stateDispatcher(FetchStates.FETCH_ERROR, Object.assign({}, payload, { data: errorHandler(e) }));
    });
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