import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual, omit } from 'lodash';

const initialState = { projectList: [], orgList: [] }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LIST_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState[action.listType] = newState[action.listType] || [];
      newState[action.listType] = newState[action.listType].slice();
      if (!find(newState[action.listType], ['id', action.id])) {
        newState[action.listType] = newState[action.listType].concat(Object.assign({}, {id: action.id}, action.data));

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
          newState[action.listType][i] = Object.assign({}, {id: action.id}, action.data);
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
        org: action.org
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
        projectList: [],
        projectId: undefined,
        source: ''
      }
    case ActionTypes.UNLOAD_ORG_LIST:
      return {
        ...state,
        orgList: []
      }
    // case ActionTypes.THREAD_COUNTS_LOADED:
    //   return {
    //     ...state,
    //     unreadThreadCounts: action.unreadThreadCounts
    //   }
    case ActionTypes.THREAD_COUNTS_ADDED: 
    case ActionTypes.THREAD_COUNTS_CHANGED: {
      const newState = Object.assign({}, state);
      newState.unreadThreadCounts = Object.assign({}, newState.unreadThreadCounts || {});
      newState.unreadThreadCounts[action.projectId] = action.count
      return newState;
    }
    case ActionTypes.THREAD_COUNTS_REMOVED: {
      const newState = Object.assign({}, state);
      newState.unreadThreadCounts = Object.assign({}, newState.unreadThreadCounts || {});
      delete newState.unreadThreadCounts[action.projectId]
      return newState;
    }
    case ActionTypes.THREAD_COUNTS_UNLOADED:
      return {
        ...state,
        unreadThreadCounts: {},
        projectNotFoundError: false,
        emptyThreadFeed: false
      }
    case ActionTypes.LOAD_PROJECT_LIST:
      return {
        ...state,
        projectId: action.projectId,
        source: action.source
      }
    case ActionTypes.LOAD_PROJECT:
      return {
        ...state,
        projectId: action.projectId
      }
    case ActionTypes.ON_ALL_PROJECTS_CLICK:
      return {
        ...state,
        projectId: null
      }
    case ActionTypes.LOAD_PROJECT_NAMES:
      return {
        ...state,
        projectNames: action.projectNames
      }
    case ActionTypes.UNLOAD_PROJECT_NAMES:
      return {
        ...state,
        projectNames: {}
      }
    // case ActionTypes.GET_UNREADS_THREAD_ADDED:
    // case ActionTypes.GET_UNREADS_THREAD_CHANGED: {
    //   const newState = Object.assign({}, state);
    //   newState[action.objectName] = Object.assign({}, newState[action.objectName] || {});
    //   newState[action.objectName][action.projectId] = Object.assign({}, newState[action.objectName][action.projectId] || {});
    //   newState[action.objectName][action.projectId][action.threadId] = action.lastUpdated
      
    //   newState.unreadThreadCounts = Object.assign({}, newState.unreadThreadCounts || {});
    //   newState.unreadThreadCounts[action.projectId] = calculateUnreads(newState.threadsLastUpdatedTimes, newState.threadsLastSeenTimes, action.projectId)

    //   return newState;
    // }
    // case ActionTypes.GET_UNREADS_THREAD_REMOVED: {
    //   const newState = Object.assign({}, state);
    //   newState[action.objectName] = Object.assign({}, newState[action.objectName] || {});
    //   newState[action.objectName][action.projectId] = Object.assign({}, newState[action.objectName][action.projectId] || {});
    //   delete newState[action.objectName][action.projectId][action.threadId];

    //   newState.unreadThreadCounts = Object.assign({}, newState.unreadThreadCounts || {});
    //   newState.unreadThreadCounts[action.projectId] = calculateUnreads(newState.threadsLastUpdatedTimes, newState.threadsLastSeenTimes, action.projectId)

    //   return newState;
    // }
    default:
      return state;
  }
};