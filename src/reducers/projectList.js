import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = { projectList: [] }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.UNLOAD_PROJECT_LIST:
      return {}
    case ActionTypes.PROJECT_LIST_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.projectList = newState.projectList || [];
      newState.projectList = newState.projectList.slice();
      if (!find(newState.projectList, ['projectId', action.projectId])) {
        newState.projectList = newState.projectList.concat(Object.assign({}, {projectId: action.projectId}, action.project));

        return newState;
      }
      return state;
    }
    case ActionTypes.PROJECT_LIST_CHANGED_ACTION: {
      const newState = Object.assign({}, state);
      newState.projectList = newState.projectList || [];
      newState.projectList = newState.projectList.slice();
      
      for (let i = 0; i < newState.projectList.length; i++) {
        if (newState.projectList[i].projectId === action.projectId) {
          newState.projectList[i] = Object.assign({}, {projectId: action.projectId}, action.project);
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.PROJECT_LIST_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.projectList = newState.projectList || [];
      newState.projectList = newState.projectList.slice();
      // find the tip and remove it
      for (let i = 0; i < newState.projectList.length; i++) {
        if (newState.projectList[i].projectId === action.projectId) {
          newState.projectList.splice(i, 1);
          return newState;    
        }
      }
      return state;
      
    }
    default:
      return state;
  }
};