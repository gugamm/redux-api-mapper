import { FetchStates, HttpMethods } from '../mapper';

const buildXhrResponse = (xhr) => {
  return {
    data: xhr.response,
    status: xhr.status,
    statusText: xhr.statusText,
    ok: (xhr.status >= 200 && xhr.status < 300),
    responseHeaders: xhr.getAllResponseHeaders(),
    getResponseHeader: xhr.getResponseHeader
  };
};

class XhrHttpLayer {
  constructor() {
    this.requestsContainer = [];
  }

  addRequest(xhr, endPoint) {
    const req = { endPoint, xhr };
    this.requestsContainer = [...this.requestsContainer, req];
  }

  addMemRequest(timeoutId, endPoint, onAbort) {
    const req = {
      endPoint,
      xhr : {
        abort: () => {
          clearTimeout(timeoutId);
          onAbort();
        }
      }
    };

    this.requestsContainer = [...this.requestsContainer, req];
  }

  handleRequest(stateDispatcher, request, method) {
    const options = request.options;
    const beforeRequest = options.beforeRequest || (() => {});
    const afterResponse = options.afterResponse || (() => {});
    const afterError    = options.afterError    || (() => {});
    const afterAbort    = options.afterAbort    || (() => {});
    const parseResponse = options.parseResponse || options.responseParse || ((r) => r.data);
    const parseBody     = options.parseBody     || options.bodyParse || ((b) => b ? JSON.stringify(b) : b);

    const memResponse   = options.memResponse;
    const delay         = options.delay;
    const cacheHandler  = options.cacheHandler;

    const responseType  = options.responseType || "json";
    const mimeType      = options.mimeType;

    let cbSuccess = () => {};
    let cbError   = () => {};
    let cbAbort   = () => {};

    if (memResponse !== undefined) {
      beforeRequest(request);
      stateDispatcher(FetchStates.FETCH_STARTED);

      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          stateDispatcher(FetchStates.FETCH_COMPLETED, memResponse);
          afterResponse(request, memResponse);
          cbSuccess(memResponse);
        }, delay);
        this.addMemRequest(timeoutId, request.endPoint, cbAbort);
      } else {
        stateDispatcher(FetchStates.FETCH_COMPLETED, memResponse);
        afterResponse(request, memResponse);
        cbSuccess(memResponse);
      }
    } else {
      beforeRequest(request);
      stateDispatcher(FetchStates.FETCH_STARTED);

      if (cacheHandler) {
        const cacheResponse = cacheHandler(request);

        stateDispatcher(FetchStates.FETCH_COMPLETED, cacheResponse);
        afterResponse(request, cacheResponse);
        cbSuccess(cacheResponse);
      } else {
        const xhr = new XMLHttpRequest();
        this.addRequest(xhr, request.endPoint);

        const handleLoad = () => {
          const parsedResponse = parseResponse(buildXhrResponse(xhr));
          stateDispatcher.dispatch(FetchStates.FETCH_COMPLETED, parsedResponse);
          afterResponse(request, parsedResponse);
          cbSuccess(parsedResponse);
        };

        const handleError = () => {
          const parsedResponse = parseResponse(buildXhrResponse(xhr));
          stateDispatcher.dispatch(FetchStates.FETCH_ERROR, parsedResponse);
          afterError(request, parsedResponse);
          cbError(parsedResponse);
        };

        const handleAbort = () => {
          stateDispatcher.dispatch(FetchStates.FETCH_CANCELLED);
          afterAbort(request);
          cbAbort();
        };

        xhr.addEventListener('load', handleLoad);
        xhr.addEventListener('error', handleError);
        xhr.addEventListener('abort', handleAbort);

        xhr.open(method, request.fullPath);

        for (let header in request.headers)
          xhr.setRequestHeader(header, request.headers[header]);

        xhr.responseType = responseType;

        if (mimeType)
          xhr.overrideMimeType(mimeType);

        xhr.send(parseBody(request.body));
      }
    }

    return function (onSuccess = cbSuccess, onError = cbError, onAbort = cbAbort) {
      cbSuccess = onSuccess;
      cbError   = onError;
      cbAbort   = onAbort;
    };
  }

  abortRequest(endPoint) {
    let aborted = false;

    this.requestsContainer = this.requestsContainer.filter(req => {
      if (req.endPoint === endPoint) {
        req.xhr.abort();
        aborted = true;
        return false;
      }
      return true;
    });

    return aborted;
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

export default XhrHttpLayer;
