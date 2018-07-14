import * as ActionTypes from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_THREAD:
      return {
        ...state,
        thread: action.thread,
        createdBy: action.createdBy
      }
    case ActionTypes.THREAD_NOT_FOUND_ERROR:
      return {
        ...state,
        threadNotFoundError: true
      }
    case ActionTypes.THREAD_UPDATED:
      return {
        ...state
      }
    case ActionTypes.UNLOAD_THREAD:
      return {}
    default:
      return state;
  }
};