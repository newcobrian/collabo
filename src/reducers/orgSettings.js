import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    // case ActionTypes.USERNAME_ADDED_ACTION: {
    //   if (action.source === Constants.ORG_SETTINGS_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.usersList = newState.usersList || [];
    //     newState.usersList = newState.usersList.slice();
    //     newState.usersList = newState.usersList.concat(Object.assign({}, { userId: action.userId }, action.userData));
    //     return newState;
    //   }
    //   return state;
    // }
    // case ActionTypes.USERNAME_CHANGED_ACTION: {
    //   if (action.source === Constants.ORG_SETTINGS_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.usersList = newState.usersList || [];
    //     newState.usersList = newState.usersList.slice();
    //     for (let i = 0; i < newState.usersList.length; i++) {
    //       if (newState.usersList[i].userId === action.userId) {
    //         newState.usersList[i] = Object.assign({}, {userId: action.userId}, action.userData)
    //         return newState;
    //       }
    //     }
    //     return state;
    //   }
    //   return state;
    // }
    // case ActionTypes.USERNAME_REMOVED_ACTION: {
    //   if (action.source === Constants.ORG_SETTINGS_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.usersList = newState.usersList || [];
    //     newState.usersList = newState.usersList.slice();
        
    //     for (let i = 0; i < newState.usersList.length; i++) {
    //       if (newState.usersList[i].userId === action.userId) {
    //         newState.usersList.splice(i, 1);
    //         return newState;    
    //       }
    //     }
    //     return state;
    //   }
    //   return state;
    // }
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
    case ActionTypes.LOAD_PROJECT_NAMES:
        if (action.source === Constants.ORG_SETTINGS_PAGE) {
            return {
                ...state,
                projectNames: action.projectNames
            }
        }
    case ActionTypes.UNLOAD_PROJECT_NAMES:
        if (action.source === Constants.ORG_SETTINGS_PAGE) {
            return {
                ...state,
                projectNames: {}
            }
        }
    default:
      return state;
  }
};