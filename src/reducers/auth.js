import { AUTH_USER, SIGN_OUT_USER, AUTH_ERROR, UNLOAD_AUTH,
  FORGOT_PASSWORD_SENT, SET_GOOGLE_AUTHORED, SET_GOOGLE_SDK_LOADED } from '../actions';
import * as ActionTypes from '../actions/types'
import * as Constants from '../constants'

const initialState = { emailCodeNotFound: false }
export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        authenticated: true,
        inProgress: false,
        emailCodeNotFound: false,
        // errors: action.error ? action.payload.errors : null
        errors: action.error ? [action.payload] : null
      };
    case 'LOGIN_PAGE_UNLOADED':
    case 'REGISTER_PAGE_UNLOADED':
      return initialState;
    case 'ASYNC_START':
      if (action.subtype === 'LOGIN' || action.subtype === 'REGISTER') {
        return { ...state, inProgress: true };
      }
      break;
    case 'UPDATE_FIELD_AUTH':
      return { ...state, [action.key]: action.value };
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload,
        inProgress: false,
        error: null
      };
    case AUTH_ERROR:
      return {
        ...state,
        errors: [action.error.message]
      };
    case SIGN_OUT_USER:
      return {
        ...state,
        authenticated: false,
        error: null
      };
    case FORGOT_PASSWORD_SENT:
      return {}
    case UNLOAD_AUTH:
      let newState = {};
      if (state.authRedirect) {
        newState.authRedirect = state.authRedirect
      }
      return newState;
    case ActionTypes.SET_AUTH_REDIRECT:
      return {
        ...state,
        authRedirect: action.redirect
      }
    case ActionTypes.ASK_FOR_AUTH:
      return {
        ...state,
        message: action.message
      }
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.REGISTER_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}

    case SET_GOOGLE_AUTHORED:
      return {
        ...state,
        isGoogleAuthored: action.payload
      }
    case SET_GOOGLE_SDK_LOADED:
      return {
        ...state,
        isGoogleSDKLoaded: true
      }
    case ActionTypes.EMAIL_CODE_LOADED:
      return {
        ...state,
        email: action.email,
        timeSent: action.timeSent,
        emailCodeNotFound: false
      }
    case ActionTypes.EMAIL_CODE_NOT_FOUND:
      return {
        ...state,
        emailCodeNotFound: true
      }
    default:
      return state;
  }
};