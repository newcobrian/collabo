import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = { projectList: [], orgList: [] }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LIST_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState[action.listType] = newState[action.listType] || [];
      newState[action.listType] = newState[action.listType].slice();
      if (!find(newState[action.listType], ['id', action.id])) {
        newState[action.listType] = newState[action.listType].concat(Object.assign({}, {id: action.id}, {name: action.name}));

        return newState;
      }
      return state;
    }
    case ActionTypes.LIST_CHANGED_ACTION: {
      const newState = Object.assign({}, state);
      newState[action.listType] = newState[action.listType] || [];
      newState[action.listType] = newState[action.listType].slice();
      
      for (let i = 0; i < newState[action.listType].length; i++) {
        if (newState[action.listType][i].id === action.id) {
          newState[action.listType][i] = Object.assign({}, {id: action.id}, {name: action.name});
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.LIST_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState[action.listType] = newState[action.listType] || [];
      newState[action.listType] = newState[action.listType].slice();
      // find the tip and remove it
      for (let i = 0; i < newState[action.listType].length; i++) {
        if (newState[action.listType][i].id === action.id) {
          newState[action.listType].splice(i, 1);
          return newState;    
        }
      }
      return state;
    }
    case ActionTypes.LOAD_ORG: {
      return {
        ...state,
        org: action.organization
      }
    }
    case ActionTypes.UNLOAD_ORG:
      return {
        ...state,
        org: {}
      }
    case ActionTypes.UNLOAD_PROJECT_LIST:
      return {
        ...state,
        projectList: []
      }
    case ActionTypes.UNLOAD_ORG_LIST:
      return {
        ...state,
        orgList: []
      }
    default:
      return state;
  }
};