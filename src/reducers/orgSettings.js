import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_ORG_USER: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          orgUser: action.orgUser
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
    case ActionTypes.ORG_MEMBER_ADDED: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        const newState = Object.assign({}, state);

        // create array of org members sorted by username for displaying list of org members
        newState.orgMembers = newState.orgMembers || [];
        newState.orgMembers = newState.orgMembers.slice();
        newState.orgMembers = newState.orgMembers.concat(Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username}));
        newState.orgMembers.sort(Helpers.byUsername);

        return newState;
      }
      return state;
    }
    case ActionTypes.ORG_MEMBER_CHANGED: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        const newState = Object.assign({}, state);

        // update info for the user in the orgMembers array
        newState.orgMembers = newState.orgMembers || [];
        newState.orgMembers = newState.orgMembers.slice();
        for (let i = 0; i < newState.orgMembers.length; i++) {
          if (newState.orgMembers[i].userId === action.userId) {
            newState.orgMembers[i] = Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username})
            newState.orgMembers.sort(Helpers.byUsername);
            break;
          }
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.ORG_MEMBER_REMOVED: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        const newState = Object.assign({}, state);

        // remove from orgMembers list
        newState.orgMembers = newState.orgMembers || [];
        newState.orgMembers = newState.orgMembers.slice();
        
        for (let i = 0; i < newState.orgMembers.length; i++) {
          if (newState.orgMembers[i].userId === action.userId) {
            newState.orgMembers.splice(i, 1);
            break;
          }
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.UNLOAD_ORG_MEMBERS:
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          orgMembers: []
        }
      }
      return state
    default:
      return state;
  }
};