import FetchStates from '../mapper/fetch-states';

/**
 * A helper function that maps each handler to a specific request state
 * @param {Function|Object} handleFetch
 * @param {Function|Object} handleComplete
 * @param {Function|Object} handleError
 * @param {Function|Object} handleCancel
 * @returns {Function}
 */
function stateToAction(handleFetch, handleComplete, handleError, handleCancel) {
  return function (state) {

    switch (state) {
      case FetchStates.FETCH_STARTED   : return handleFetch;
      case FetchStates.FETCH_COMPLETED : return handleComplete;
      case FetchStates.FETCH_ERROR     : return handleError;
      case FetchStates.FETCH_CANCELLED : return handleCancel;
    }

    throw new Error('Unknown state : ' + state);
  };
}

export default stateToAction;
