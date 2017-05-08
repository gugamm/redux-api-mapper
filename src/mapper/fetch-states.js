/**
 * Possible request fetch states
 * @type {{FETCH_STARTED: string, FETCH_COMPLETED: string, FETCH_ERROR: string, FETCH_CANCELLED: string}}
 */
const FetchStates = {
  FETCH_STARTED   : "@@FETCH_STARTED@@",
  FETCH_COMPLETED : "@@FETCH_COMPLETED@@",
  FETCH_ERROR     : "@@FETCH_ERROR@@",
  FETCH_CANCELLED : "@@FETCH_CANCELLED@@"
};

export default FetchStates;
