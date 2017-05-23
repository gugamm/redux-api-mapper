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

const REQUEST_STATE_SUCCESS = "REQUEST_STATE_SUCCESS";
const REQUEST_STATE_ERROR = "REQUEST_STATE_ERROR";
const REQUEST_STATE_ABORTED = "REQUEST_STATE_ABORTED";

class ObservableRequest {
  constructor() {
    this.listeners = [];
    this.state = null;
    this.data = null;
  }

  subscribe(listener, state) {
    this.listeners = [...this.listeners, {listener, state}];
    if (this.state !== null && state === this.state)
      listener(this.data);
  }

  setState(reqState, data) {
    this.state = reqState;
    this.data = data;

    this.listeners.forEach(({ listener, state }) => {
      if (state === this.state)
        listener(this.data);
    });
  }
};

class XhrHttpLayer {
  constructor() {
    this.requestsContainer = [];
  }

  addRequest(xhr, endPoint) {
    const req = { endPoint, xhr };
    this.requestsContainer = [...this.requestsContainer, req];

    return req;
  }

  addMemRequest(timeoutId, endPoint, observableRequest) {
    const req = {
      endPoint,
      xhr : {
        abort: () => {
          clearTimeout(timeoutId);
          observableRequest.setState(REQUEST_STATE_ABORTED);
        }
      }
    };

    this.requestsContainer = [...this.requestsContainer, req];

    return req;
  }

  handleRequest(stateDispatcher, request, method) {
    const options = request.options;
    const beforeRequest = options.beforeRequest || (() => {});
    const afterResponse = options.afterResponse || (() => {});
    const afterError    = options.afterError    || (() => {});
    const afterAbort    = options.afterAbort    || (() => {});
    const parseResponse = options.parseResponse || options.responseParse || ((r) => r.data);
    const parseBody     = options.parseBody     || options.bodyParse || ((b) => b ? JSON.stringify(b) : b);
    const payload       = options.payload       || {};

    const memResponse   = options.memResponse;
    const delay         = options.delay;
    const cacheHandler  = options.cacheHandler;

    const responseType  = options.responseType || "json";
    const mimeType      = options.mimeType;

    let observableRequest = new ObservableRequest();
    let currentRequest = null;

    //memory response
    if (memResponse !== undefined) {
      let memResponseFn = memResponse;

      beforeRequest(request);
      stateDispatcher(FetchStates.FETCH_STARTED, payload);

      if (typeof memResponse !== "function")
        memResponseFn = (() => memResponse);

      if (delay > 0) {
        const timeoutId = setTimeout(() => {
          const response = memResponseFn(request);
          stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: response }));
          afterResponse(request, response);

          observableRequest.setState(REQUEST_STATE_SUCCESS, response);
          this.removeRequest(currentRequest);
        }, delay);

        currentRequest = this.addMemRequest(timeoutId, request.endPoint, observableRequest);
      } else {
        const response = memResponseFn(request);
        stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: response }));
        afterResponse(request, response);

        observableRequest.setState(REQUEST_STATE_SUCCESS, response);
      }
    } else {
      beforeRequest(request);
      stateDispatcher(FetchStates.FETCH_STARTED, payload);
      let cacheResponse;

      if (cacheHandler)
        cacheResponse = cacheHandler(request);

      if (cacheResponse !== undefined) {
        stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: cacheResponse }));
        afterResponse(request, cacheResponse);

        observableRequest.setState(REQUEST_STATE_SUCCESS, Object.assign({}, payload, { data: cacheResponse }));
      } else {
        const xhr = new XMLHttpRequest();
        currentRequest = this.addRequest(xhr, request.endPoint);

        const handleLoad = () => {
          const response = buildXhrResponse(xhr);
          const parsedResponse = parseResponse(response);

          if (response.ok)
            stateDispatcher(FetchStates.FETCH_COMPLETED, Object.assign({}, payload, { data: parsedResponse }));
          else
            stateDispatcher(FetchStates.FETCH_ERROR, Object.assign({}, payload, { data: parsedResponse }));

          afterResponse(request, parsedResponse);

          if (response.ok)
            observableRequest.setState(REQUEST_STATE_SUCCESS, parsedResponse);
          else
            observableRequest.setState(REQUEST_STATE_ERROR, parsedResponse);

          this.removeRequest(currentRequest);
        };

        const handleError = () => {
          const parsedResponse = parseResponse(buildXhrResponse(xhr));
          stateDispatcher(FetchStates.FETCH_ERROR, Object.assign({}, payload, { data: parsedResponse }));
          afterError(request, parsedResponse);

          observableRequest.setState(REQUEST_STATE_ERROR, parsedResponse);
          this.removeRequest(currentRequest);
        };

        const handleAbort = () => {
          stateDispatcher(FetchStates.FETCH_CANCELLED, payload);
          afterAbort(request);

          observableRequest.setState(REQUEST_STATE_ABORTED);
          this.removeRequest(currentRequest);
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

    return function (cbSuccess, cbError, cbAbort) {
      if (cbSuccess)
        observableRequest.subscribe(cbSuccess, REQUEST_STATE_SUCCESS);

      if (cbError)
        observableRequest.subscribe(cbError, REQUEST_STATE_ERROR);

      if (cbAbort)
        observableRequest.subscribe(cbAbort, REQUEST_STATE_ABORTED);
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

  removeRequest(r) {
    this.requestsContainer = this.requestsContainer.filter(req => req === r);
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
