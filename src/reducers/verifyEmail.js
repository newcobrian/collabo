import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

const initialState = { emailNotFound: false }
export default (state = initialState, action) => {
  switch (action.type) {
  	case ActionTypes.EMAIL_CODE_LOADED:
      return {
        ...state,
        email: action.email,
        timeSent: action.timeSent,
        emailNotFound: false
      }
    case ActionTypes.EMAIL_CODE_NOT_FOUND:
      return {
        ...state,
        emailNotFound: true
      }
    case ActionTypes.UNLOAD_EMAIL_CODE:
      return initialState
    default:
      return state;
  }
};