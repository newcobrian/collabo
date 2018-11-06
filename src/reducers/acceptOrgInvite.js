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
        inviteType: action.inviteType,
        emailRegistered: false
      }
    case ActionTypes.ACCEPT_INVITE_ERROR:
      return {
        ...state,
        message: action.message,
        emailRegistered: false
      }
    case ActionTypes.LOAD_INVITE_ERROR:
      return {
        ...state,
        loadInviteError: true,
        errorMessage: action.errorMessage,
        emailRegistered: false
      }
    case ActionTypes.LOAD_NEW_ORG_USER_INFO:
      if (action.source === Constants.ACCEPT_ORG_INVITE_PAGE) {
        return {
          ...state,
          username: action.username ? action.username : null,
          fullName: action.fullName ? action.fullName : null,
          image: action.image ? action.image : null
        }
      }
      else return state;
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.ACCEPT_ORG_INVITE_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ActionTypes.CREATE_SUBMIT_ERROR:
      if (action.source === Constants.ACCEPT_ORG_INVITE_PAGE) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
    case ActionTypes.EMAIL_ALREADY_REGISTERED:
    return {
      ...state,
      emailRegistered: true
    }
    default:
      return state;
  }
};