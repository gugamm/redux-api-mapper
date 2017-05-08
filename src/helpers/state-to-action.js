import FetchStates from '../mapper/fetch-states';

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
