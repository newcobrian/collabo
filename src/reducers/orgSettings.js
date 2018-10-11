import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ORG_USERS_LOADED: {
        if (action.source === Constants.ORG_SETTINGS_PAGE) {
            return {
                ...state,
                payload: action.payload
            }
        }
        return state;
    }
    case ActionTypes.UNLOAD_ORG_USERS: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          payload: []
        }
      }
    }
    case ActionTypes.CHANGE_ORG_SETTINGS_TAB: {

      return {
        ...state,
        tab: action.tab,
        payload: action.payload
      }
    }
    case ActionTypes.LOAD_ORG: {
        if (action.source === Constants.ORG_SETTINGS_PAGE) {
          return {
            ...state,
            orgId: action.orgId,
            org: action.organization,
            invalidOrgUser: false
          }
        }
    }
    case ActionTypes.LIST_ADDED_ACTION:
    case ActionTypes.LIST_CHANGED_ACTION:
        if (action.source === Constants.ORG_SETTINGS_PAGE && action.listType === Constants.PROJECT_LIST_TYPE) {
            const newState = Object.assign({}, state);
            newState.usersProjects = newState.usersProjects || {};
            newState.usersProjects = Object.assign({}, newState.usersProjects);
            newState.usersProjects[action.id] = action.data
            return newState;
        }
        return state;
    case ActionTypes.LIST_REMOVED_ACTION:
        if (action.source === Constants.ORG_SETTINGS_PAGE && action.listType === Constants.PROJECT_LIST_TYPE) {
            const newState = Object.assign({}, state);
            newState.usersProjects = newState.usersProjects || {};
            newState.usersProjects = Object.assign({}, newState.usersProjects);
            delete newState.usersProjects[action.id]
            return newState;
        }
        return state;
    case ActionTypes.LOAD_ORG: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          orgId: action.orgId,
          invalidOrgUser: false
        }
      }
      return state;
    }
    // case ActionTypes.LOAD_PROJECT_NAMES:
    //     if (action.source === Constants.ORG_SETTINGS_PAGE) {
    //         return {
    //             ...state,
    //             projectNames: action.projectNames
    //         }
    //     }
    // case ActionTypes.UNLOAD_PROJECT_NAMES:
    //     if (action.source === Constants.ORG_SETTINGS_PAGE) {
    //         return {
    //             ...state,
    //             projectNames: {}
    //         }
    //     }
    case ActionTypes.MEMBER_ADDED: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.membersList] = newState[action.membersList] || [];
        newState[action.membersList] = newState[action.membersList].slice();
        newState[action.membersList] = newState[action.membersList].concat(Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username}));
        newState[action.membersList].sort(Helpers.byUsername);
        return newState;
      }
      return state;
    }
    case ActionTypes.MEMBER_CHANGED: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.membersList] = newState[action.membersList] || [];
        newState[action.membersList] = newState[action.membersList].slice();
        for (let i = 0; i < newState[action.membersList].length; i++) {
          if (newState[action.membersList][i].id === action.id) {
            newState[action.membersList][i] = Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username})
            newState[action.membersList].sort(Helpers.byUsername);
            return newState;
          }
        }
        return state;
      }
      return state;
    }
    case ActionTypes.MEMBER_REMOVED: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.membersList] = newState[action.membersList] || [];
        newState[action.membersList] = newState[action.membersList].slice();
        
        for (let i = 0; i < newState[action.membersList].length; i++) {
          if (newState[action.membersList][i].id === action.id) {
            newState[action.membersList].splice(i, 1);
            return newState;    
          }
        }
        return state;
      }
      return state;
    }
    case ActionTypes.UNLOAD_MEMBERS:
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          [action.membersList]: []
        }
      }
      return state
    default:
      return state;
  }
};