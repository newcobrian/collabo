import { AUTH_USER, SIGN_OUT_USER, AUTH_ERROR } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        authenticated: true,
        inProgress: false,
        // errors: action.error ? action.payload.errors : null
        errors: action.error ? [action.payload] : null
      };
    case 'LOGIN_PAGE_UNLOADED':
    case 'REGISTER_PAGE_UNLOADED':
      return {};
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
        authenticated: true,
        inProgress: false,
        error: null
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: [action.payload.message]
      };
    case SIGN_OUT_USER:
      return {
        ...state,
        authenticated: false,
        error: null
      };
  }

  return state;
};