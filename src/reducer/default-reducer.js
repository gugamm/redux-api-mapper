import { FetchStates } from '../mapper';

function defReducerBuilder(actionBuilder, reducerData) {
  const defState = {
    isFetching    : false,
    isError       : false,
    isSuccess     : false,
    isCancelled   : false,
    cancelledData : null,
    data          : reducerData || null,
    errorData     : null
  };

  const FETCH_STARTED   = actionBuilder(FetchStates.FETCH_STARTED);
  const FETCH_COMPLETED = actionBuilder(FetchStates.FETCH_COMPLETED);
  const FETCH_ERROR     = actionBuilder(FetchStates.FETCH_ERROR);
  const FETCH_CANCELLED = actionBuilder(FetchStates.FETCH_CANCELLED);
  const CLEAR_STATE     = actionBuilder("CLEAR_STATE");

  return function reducer(prevState = defState, action) {
    switch (action.type) {
      case FETCH_STARTED   : return {...defState, isFetching: true};
      case FETCH_COMPLETED : return {...defState, isSuccess : true, data : action.payload.data};
      case FETCH_CANCELLED : return {...defState, isCancelled : true, cancelledData : action.payload.data};
      case FETCH_ERROR     : return {...defState, isError : true, errorData : action.payload.data};
      case CLEAR_STATE     : return defState;
    }
    return prevState;
  };
};

export default defReducerBuilder;
