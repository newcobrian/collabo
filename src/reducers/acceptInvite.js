import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.INVITE_LOADED:
      return {
        ...state,
        invite: action.invite,
        sender: action.sender
      }
    case ActionTypes.ACCEPT_INVITE_ERROR:
      return {
        ...state,
        message: action.message
      }
    default:
      return state;
  }
};