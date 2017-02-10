const HTTP_METHODS  = require('./http-methods');
const FETCH_STATES  = require('./fetch-states');
const MAPPER        = require('./mapper');
const BROWSER_LAYER = require('./http-layers/browser-promise-layer');
const stateToAction = require('./state-to-action');
const apiConnect    = require('./api-connect');
const ApiProvider   = require('./ApiProvider');

module.exports = {
  HttpMethods                  : HTTP_METHODS,
  FetchStates                  : FETCH_STATES,
  createMapper                 : MAPPER.createMapper,
  addEndPointToMapper          : MAPPER.addEndPointToMapper,
  addResourceToMapper          : MAPPER.addResourceToMapper,
  createPromiseHttpLayer       : BROWSER_LAYER.createPromiseBrowserHttpLayer,
  createPromiseResponseHandler : BROWSER_LAYER.createPromiseResponseHandler,
  stateToAction                : stateToAction,
  apiConnect                   : apiConnect,
  ApiProvider                  : ApiProvider
};