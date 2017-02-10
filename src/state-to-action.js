const FETCH_STATES = require('./fetch-states');

/**
 * State to action is a helper function to create a function that maps the state of the request into an action.
 * You don't need to create a function to do that. Use this function instead.
 * @param {(Function|Object)} fetchStarted - Action creator or action that will be dispatched when fetch starts
 * @param {(Function|Object)} fetchCompleted - Action creator or action that will be dispatched when fetch completes
 * @param {(Function|Object)} fetchError - Action creator or action that will be dispatched when fetch fails
 * @param {(Function|Object)} fetchCancelled - Action creator or action that will be dispatched when fetch gets cancelled
 * @returns {Function}
 */
function stateToAction(fetchStarted, fetchCompleted, fetchError, fetchCancelled) {
  return function (state) {
    switch(state) {
      case FETCH_STATES.FETCH_STARTED : return fetchStarted;
      case FETCH_STATES.FETCH_COMPLETED : return fetchCompleted;
      case FETCH_STATES.FETCH_ERROR : return fetchError;
      case FETCH_STATES.FETCH_CANCELLED : return fetchCancelled;
    }
  }
};

module.exports = stateToAction;
