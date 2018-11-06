import { AUTH_USER, SIGN_OUT_USER, REVIEW_SUBMITTED, APP_USER_LOADED, EMPTY_FRIEND_SELECTOR,
  GET_INBOX_COUNT, HOME_PAGE_NO_AUTH, ASK_FOR_AUTH, FRIEND_SELECTOR_SUBMIT, REVIEW_DELETED,
  FORWARD_MODAL, REVIEW_MODAL, ITINERARY_CREATED, ITINERARY_UPDATED, EDITOR_PAGE_NO_AUTH, ITINERARY_DELETED } from '../actions';
import * as ActionTypes from '../actions/types'

const defaultState = {
  appName: 'Koi',
  authenticated: false,
  token: null,
  authRedirect: '',
  organization: {},
  invalidOrgUser: false
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
    case ActionTypes.NOT_AN_ORG_USER:
      return {
        ...state,
        invalidOrgUser: true
      }
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
    case ActionTypes.PROJECT_CREATED:
      return {
        ...state,
        redirectTo: '/' + action.orgURL + '/' + action.projectId
      }
    case ASK_FOR_AUTH:
      return {
        ...state,
        redirectTo: '/register'
      }
    case AUTH_USER:
      return {
        ...state,
        authenticated: action.payload,
        redirectTo: action.error ? null : (action.redirect ? action.redirect : '/'),
        error: null
      };
    case ActionTypes.SIGN_UP_USER:
      return {
        ...state,
        authenticated: action.payload,
        redirectTo: action.error ? null : (action.redirect ? action.redirect : '/'),
        error: null
      }
    case SIGN_OUT_USER:
      return {
        ...state,
        authenticated: false,
        error: null,
        userInfo: null,
        redirectTo: action.error ? null : '/'
      };
    case ActionTypes.THREAD_CREATED:
      return {
        ...state,
        redirectTo: '/' + action.orgURL + '/' + action.projectId + '/' + action.threadId
      }
    case ActionTypes.ORG_CREATED:
      return {
        ...state,
        redirectTo: '/' + action.orgURL
      }
    case ActionTypes.USERS_INVITED_TO_ORG:
      return {
        ...state,
        redirectTo: '/' + action.orgURL
      }
    case ActionTypes.ORG_INVITE_ACCEPTED:
      return {
        ...state,
        redirectTo: '/' + action.orgURL
      }
    case ActionTypes.THREAD_DELETED:
      return { 
        ...state,
        redirectTo: action.redirect
      };
    case ActionTypes.LOAD_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.mql.matches
      }
    case ActionTypes.SET_SIDEBAR_OPEN:
      return {
        ...state,
        sidebarOpen: true
      }
    case ActionTypes.SET_SIDEBAR:
      return {
        ...state,
        sidebarOpen: action.sidebarOpen
      }
    case ActionTypes.ON_ALL_PROJECTS_CLICK:
      return {
        ...state,
        redirectTo: '/' + action.orgURL
      }
    case ActionTypes.PROJECT_INVITE_ACCEPTED:
      return {
        ...state,
        redirectTo: '/' + action.orgURL + '/' + action.projectId
      }
    case ActionTypes.ORG_PROJECT_MISMATCH:
      return {
        ...state,
        redirectTo: '/' + action.orgURL + '/' + action.projectId
      }
    case ActionTypes.LOAD_ORG_USER:
      return {
        ...state,
        orgUser: action.orgUser
      }
    case ActionTypes.LOAD_REGISTER_WITH_EMAIL:
      return {
        ...state,
        redirectTo: '/verify/' + action.verifyId
      }
    case ActionTypes.SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: '/' + action.orgURL + '/user/' + action.username
      }
    default: 
      return state;
  }
};