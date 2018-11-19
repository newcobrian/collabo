import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = { tab: 'members' }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UNLOAD_ORG_USERS: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          usersList: []
        }
      }
    }
    case ActionTypes.SHOW_PROJECT_SETTINGS_MODAL: {
        return {
            ...state,
            projectId: action.projectId,
            project: action.project,
            projectMembers: action.projectMembers,
            orgURL: action.orgURL,
            projectName: action.project && action.project.name ? action.project.name : ''
        }
    }
    case ActionTypes.CHANGE_PROJECT_SETTINGS_TAB: {
      return {
        ...state,
        tab: action.tab
      }
    }
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.PROJECT_SETTINGS_MODAL) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
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
    case ActionTypes.CREATE_SUBMIT_ERROR: {
        if (action.source === Constants.PROJECT_SETTINGS_MODAL) {
            return {
                ...state,
                errors: [action.error]
            }
        }
        else return state;
    }
    case ActionTypes.HIDE_MODAL:
        return initialState
    default:
      return state;
  }
};