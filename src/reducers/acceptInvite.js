import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.INVITE_LOADED:
      return {
        ...state,
        invite: action.invite,
        sender: action.sender,
        loadInviteError: false,
        inviteType: action.inviteType
      }
    case ActionTypes.ACCEPT_INVITE_ERROR:
      return {
        ...state,
        message: action.message
      }
    case ActionTypes.LOAD_INVITE_ERROR:
      return {
        ...state,
        loadInviteError: true,
        errorMessage: action.errorMessage
      }
    default:
      return state;
  }
};