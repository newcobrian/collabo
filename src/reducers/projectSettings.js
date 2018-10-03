import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = { tab: 'members' }

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
    case ActionTypes.UNLOAD_ORG_USERS: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          usersList: []
        }
      }
    }
    case ActionTypes.CHANGE_ORG_SETTINGS_TAB: {

      return {
        ...state,
        tab: action.tab,
        usersList: action.usersList
      }
    }
    case ActionTypes.LOAD_PROJECT: {
        if (action.source === Constants.PROJECT_SETTINGS_PAGE) {
            return {
                ...state,
                project: action.project,
                projectNotFoundError: false
            }
        }
        return state;
    }
    case ActionTypes.PROJECT_NOT_FOUND_ERROR: {
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          projectNotFoundError: true,
          feedEndValue: new Date().getTime()
        }
      }
      return state;
    }
    default:
      return state;
  }
};