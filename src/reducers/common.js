import { AUTH_USER, SIGN_OUT_USER, REVIEW_SUBMITTED, APP_USER_LOADED, GET_INBOX_COUNT, HOME_PAGE_NO_AUTH, ASK_FOR_AUTH } from '../actions';

const defaultState = {
  appName: 'Reccoon',
  authenticated: false,
  token: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'APP_LOAD':
      return {
        ...state,
        authenticated: action.authenticated,
        // token: action.token || null,
        appLoaded: true,
        currentUser: action.currentUser ? action.currentUser : null,
      };
    case APP_USER_LOADED:
      return {
        ...state,
        userInfo: action.payload ? action.payload : null
      }
    case GET_INBOX_COUNT:
      return {
        ...state,
        unreadMessages: action.payload
      }
    case 'REDIRECT':
      return { ...state, redirectTo: null };
    case 'LOGOUT':
      return { ...state, authenticated: false, redirectTo: '/', token: null, currentUser: null };
    case REVIEW_SUBMITTED:
      // const redirectUrl = `article/${action.payload.article.slug}`;
      const redirectUrl = `review/${action.subjectId}/${action.reviewId}`;
      return { ...state, redirectTo: redirectUrl };
    case 'SETTINGS_SAVED':
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        // currentUser: action.error ? null : action.payload.user
      };
    case 'DELETE_ARTICLE':
      return { ...state, redirectTo: '/' };
    case HOME_PAGE_NO_AUTH:
      return {
        ...state,
        redirectTo: 'global'
      }
    case ASK_FOR_AUTH:
      return {
        ...state,
        redirectTo: 'login'
      }
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload,
        redirectTo: action.error ? null : '/',
        error: null
      };
    case SIGN_OUT_USER:
      return {
        ...state,
        authenticated: false,
        error: null,
        redirectTo: action.error ? null : '/'
      };
    default: 
      return state;
  }
};