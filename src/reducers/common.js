import { AUTH_USER, SIGN_OUT_USER, REVIEW_SUBMITTED, APP_USER_LOADED, EMPTY_FRIEND_SELECTOR,
  GET_INBOX_COUNT, HOME_PAGE_NO_AUTH, ASK_FOR_AUTH, FRIEND_SELECTOR_SUBMIT, REVIEW_DELETED,
  FORWARD_MODAL, REVIEW_MODAL, ITINERARY_CREATED, ITINERARY_UPDATED, EDITOR_PAGE_NO_AUTH, ITINERARY_DELETED } from '../actions';
import * as ActionTypes from '../actions/types'

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
        userInfo: action.userInfo ? action.userInfo : null
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
      // const redirectUrl = `review/${action.subjectId}/${action.reviewId}`;
      if (action.path === REVIEW_MODAL) {
        return { ...state };
      }
      else {
        const redirectUrl = '/select';
        return { ...state, redirectTo: redirectUrl };
      }
    case ITINERARY_CREATED:
      return {
        ...state,
        redirectTo: '/guide/' + action.itineraryId
      }
    case ITINERARY_UPDATED:
      return {
        ...state,
        redirectTo: '/guide/' + action.itineraryId
      }
    case FRIEND_SELECTOR_SUBMIT:
      if (action.path === FORWARD_MODAL) {
        return {...state}
      }
      else return { ...state, redirectTo: action.redirect }
    case EMPTY_FRIEND_SELECTOR:
      return { ...state, redirectTo: '/' };
    case 'SETTINGS_SAVED':
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        // currentUser: action.error ? null : action.payload.user
      };
    case REVIEW_DELETED:
    case ITINERARY_DELETED:
      return { 
        ...state,
        redirectTo: action.redirect ? action.redirect : null
      };
    case HOME_PAGE_NO_AUTH:
      return {
        ...state,
        redirectTo: '/global'
      }
    case ASK_FOR_AUTH:
      return {
        ...state,
        redirectTo: '/login'
      }
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload,
        redirectTo: action.error ? null : '/',
        error: null
      };
    case ActionTypes.SIGN_UP_USER:
      return {
        ...state,
        authenticated: action.payload,
        redirectTo: action.error ? null : '/explore',
        error: null
      }
    case SIGN_OUT_USER:
      return {
        ...state,
        authenticated: false,
        error: null,
        redirectTo: action.error ? null : '/'
      };
    case EDITOR_PAGE_NO_AUTH:
      return {
        ...state,
        redirectTo: '/guide/' + action.itineraryId
      }
    default: 
      return state;
  }
};