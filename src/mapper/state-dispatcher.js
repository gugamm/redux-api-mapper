import buildActionBuilder from '../reducer/action-builder';

/**
 * Build a state dispatcher
 * @param store
 * @param stateToAction
 * @param mEndPoint
 * @returns {stateDispatcher}
 */
function buildStateDispatcher(store, stateToAction, mEndPoint) {
  const storeDispatcher = store.dispatch;
  const mapper          = mEndPoint._resource._mapper;
  const resource        = mEndPoint._resource;
  const actionBuilder   = buildActionBuilder(resource.name, mEndPoint.name, mapper.name);

  /**
   * Dispatch an action according to the state of the request to the redux store. If any state handler is provided, than it will
   * be called according to the state.
   * @param {FetchStates} state - The state of the request
   * @param {Object} [payload] - The payload to be dispatched
   */
  let stateDispatcher = function (state, payload) {

    //Dispatch actions defined by the stateToAction
    if (stateToAction) {
      const actionToDispatch = stateToAction(state);
      if (actionToDispatch)
        handleActionToDispatch(mapper, storeDispatcher, actionToDispatch, payload);
    }

    //Dispatch action to the store
    const actionType = actionBuilder(state);

    const action = {
      type    : actionType,
      payload : payload
    };

    storeDispatcher(action);
  };

  return stateDispatcher;
}

function handleActionToDispatch(mapper, storeDispatcher, actionToDispatch, payload) {
  //no action to dispatch
  if (actionToDispatch === null || actionToDispatch === undefined)
    return;

  //Multiple actions to dispatch
  if (Array.isArray(actionToDispatch)) {
    actionToDispatch.forEach(action => handleActionToDispatch(mapper, storeDispatcher, action, payload));
    return;
  }

  let fnResult;

  //Function
  if (typeof actionToDispatch === 'function') {
    fnResult = actionToDispatch(payload, mapper, storeDispatcher);

    //no need to dispatch
    if (fnResult === null || fnResult === undefined)
      return;

    handleActionToDispatch(mapper, storeDispatcher, fnResult, payload);
    return;
  }

  //Object
  if (typeof actionToDispatch === 'object') {
    storeDispatcher(actionToDispatch);
    return;
  }

  throw new Error('Cannot handle ' + typeof actionToDispatch + '. Invalid action dispatcher handler');
}

export default buildStateDispatcher;
