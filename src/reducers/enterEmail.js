import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
  	case ActionTypes.CREATE_PAGE_UNLOADED:
    case ActionTypes.RESET_VERIFICATION_PAGE:
  		return {};
    case ActionTypes.CREATE_SUBMIT_ERROR:
      if (action.source === Constants.ENTER_EMAIL_PAGE) {
        return {
          ...state,
          errors: [action.error],
          emailTaken: false,
          emailSent: false
        }
      }
      else return {...state}
    case ActionTypes.SET_IN_PROGRESS:
      return {
        ...state,
        emailTaken: false,
        emailSent: false
      }
    case ActionTypes.EMAIL_ADDRESS_TAKEN:
      return {
        ...state,
        emailTaken: true,
        emailSent: false
      }
    case ActionTypes.EMAIL_VERIFICATION_SENT:
      return {
        ...state,
        emailTaken: false,
        emailSent: true
      }
  	case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.ENTER_EMAIL_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    default:
      return state;
  }
};