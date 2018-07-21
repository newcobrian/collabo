import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
  	case ActionTypes.CREATE_PAGE_UNLOADED:
  		return {};
    case ActionTypes.CREATE_SUBMIT_ERROR:
      if (action.source === Constants.ORG_INVITE_PAGE) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
    case ActionTypes.SET_IN_PROGRESS:
      return {
        ...state,
        inProgress: true
      }
    case ActionTypes.ORG_INVITE_PAGE_LOADED:
      return {
        ...state,
        org: action.org
      }
    case ActionTypes.USERS_INVITED_TO_ORG:
      return {}
  	case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.ORG_INVITE_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    default:
      return state;
  }
};