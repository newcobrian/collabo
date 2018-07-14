import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find } from 'lodash';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_THREAD_FEED:
      return {
        ...state,
        feed: action.payload
      }
    case ActionTypes.UNLOAD_PROJECT_THREADS:
      return {}
    case ActionTypes.LOAD_PROJECT:
      return {
        ...state,
        project: action.project
      }
    case ActionTypes.PROJECT_NOT_FOUND_ERROR:
      return {
        ...state,
        projectNotFoundError: true
      }
    case ActionTypes.THREAD_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.threads = newState.threads || [];
      newState.threads = newState.threads.slice();
      if (!find(newState.threads, ['threadId', action.threadId])) {
        // let createdBy = { createdBy: Object.assign({}, newState.usersData[action.tip.userId]) };
        // let comments = { comments: newState.commentsData[action.tipId] ? [].concat(newState.commentsData[action.tipId]) : [] };
        // let isLiked = { isLiked: newState.likesData[action.tipId] ? true : false };
        newState.threads = newState.threads.concat(Object.assign({}, {threadId: action.threadId}, action.thread));

        return newState;
      }
      return state;
    }
    case ActionTypes.THREAD_CHANGED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.dataType] = newState[action.dataType] || [];
        newState[action.dataType] = newState[action.dataType].slice();
        // let createdBy = { createdBy: Object.assign({}, newState.usersData[action.tip.userId]) };
        // let comments = { comments: newState.commentsData[action.tipId] ? [].concat(newState.commentsData[action.tipId]) : [] };
        // let isLiked = { isLiked: newState.likesData[action.tipId] ? true : false };
        
        for (let i = 0; i < newState[action.dataType].length; i++) {
          if (newState[action.dataType][i].key === action.tipId) {
            newState[action.dataType][i] = Object.assign({}, {key: action.tipId}, {priority: action.priority}, action.tip);
            newState[action.dataType].sort(Helpers.byPriority);
            return newState;
          }
        }
      }
      return state;
    }
    default:
      return state;
  }
};