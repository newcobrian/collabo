import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = { usersData: {}, threadCounts: {}, feedEndValue: null, isFeedLoading: false, projectNames: {} }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.GET_THREAD_FEED:
      return {
        ...state,
        feed: action.payload
      }
    case ActionTypes.UNWATCH_THREAD_FEED:
      return {
        ...state,
        threads: null,
        projectNotFoundError: false,
        emptyThreadFeed: false,
        feedEndValue: new Date().getTime(),
        isFeedLoading: false
      }
    case ActionTypes.LOAD_PROJECT: {
      if (action.source === Constants.PROJECT_PAGE) {
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
    case ActionTypes.THREAD_ADDED_ACTION: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.threads = newState.threads || [];
        newState.threads = newState.threads.slice();
        newState.usersData = newState.usersData || {};
        if (!find(newState.threads, ['threadId', action.threadId])) {
          let createdBy = { createdBy: Object.assign({}, action.user) };
          // let comments = { comments: newState.commentsData[action.tipId] ? [].concat(newState.commentsData[action.tipId]) : [] };
          // let isLiked = { isLiked: newState.likesData[action.tipId] ? true : false };
          newState.threads = newState.threads.concat(Object.assign({}, {threadId: action.threadId}, action.thread, createdBy));
          newState.threads.sort(Helpers.lastModifiedDesc);

          newState.emptyThreadFeed = false;

          return newState;
        }
        return state;
      }
      return state;
    }
    case ActionTypes.THREAD_CHANGED_ACTION: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.threads = newState.threads || [];
        newState.threads = newState.threads.slice();
        let createdBy = { createdBy: Object.assign({}, action.user) };
        
        for (let i = 0; i < newState.threads.length; i++) {
          if (newState.threads[i].threadId === action.threadId) {
            newState.threads[i] = Object.assign({}, {threadId: action.threadId}, action.thread, createdBy);
            // newState.threads.sort(Helpers.lastModifiedDesc);
            newState.emptyThreadFeed = false;
            return newState;
          }
        }
        return state;
      }
      return state;
    }
    case ActionTypes.THREAD_REMOVED_ACTION: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.threads = newState.threads || [];
        newState.threads = newState.threads.slice();
        // find the tip and remove it
        for (let i = 0; i < newState.threads.length; i++) {
          if (newState.threads[i].threadId === action.threadId) {
            newState.threads.splice(i, 1);
            return newState;    
          }
        }
      }
      return state;
    }
    case ActionTypes.USER_VALUE_ACTION: {
      if (action.source === Constants.PROJECTS_PAGE) {
        const newState = Object.assign({}, state);
        // update usersData
        newState.usersData = newState.usersData || {};
        newState.usersData = Object.assign({}, newState.usersData);

        if (!isEqual(action.userInfo, newState.usersData[action.userId])) {
          newState.usersData[action.userId] = Object.assign({}, action.userInfo);
          // return newState;
        }

        // update any threads
        newState.threads = newState.threads || [];
        newState.threads = newState.threads.slice();
        for (let i = 0; i < newState.threads.length; i++) {
          if (newState.threads[i].userId === action.userId) {
            newState.threads[i].createdBy = Object.assign({}, action.userInfo);
          }
        }
        
        return newState;
      }
      return state;
    }
    case ActionTypes.LOAD_ORG: {
      return {
        ...state,
        orgId: action.orgId,
        invalidOrgUser: false
      }
    }
    case ActionTypes.UNLOAD_ORG: {
      return {
        ...state,
        org: {},
        feedEndValue: new Date().getTime()
      }
    }
    case ActionTypes.NOT_AN_ORG_USER:
      return {
        ...state,
        invalidOrgUser: true
      }
    case ActionTypes.UNWATCH_ORG_FEED:
      return {
        ...state,
        threads: null,
        projectNotFoundError: false,
        emptyThreadFeed: false
      }
    case ActionTypes.EMPTY_THREAD:
      return {
        ...state,
        emptyThreadFeed: true
      }
    case ActionTypes.UPDATE_END_VALUE:
      if (action.source == Constants.PROJECT_PAGE) {
        if (action.endValue < state.feedEndValue) {
          return {
            ...state,
            feedEndValue: action.endValue
          }
        }
        else return state;
      }
    case ActionTypes.SET_IS_FEED_LOADING:
      if (action.source == Constants.PROJECT_PAGE) {
        return {
          ...state,
          isFeedLoading: action.isFeedLoading
        }
      }
    case ActionTypes.LIST_ADDED_ACTION:
    case ActionTypes.LIST_CHANGED_ACTION:
      if (action.source === Constants.PROJECT_PAGE && action.listType === Constants.PROJECT_LIST_TYPE) {
        const newState = Object.assign({}, state);
        newState.projectNames = newState.projectNames || {};
        newState.projectNames = Object.assign({}, newState.projectNames);
        newState.projectNames[action.id] = action.name
        return newState;
      }
    case ActionTypes.UNLOAD_PROJECT_LIST: {
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          projectNames: {}
        }
      }
    }
    case ActionTypes.PROJECT_MEMBER_ADDED: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.projectMembers = newState.projectMembers || [];
        newState.projectMembers = newState.projectMembers.slice();
        newState.projectMembers = newState.projectMembers.concat(Object.assign({}, { userId: action.userId }, action.userData));
        newState.projectMembers.sort(Helpers.byUsername);
        return newState;
      }
      return state;
    }
    case ActionTypes.PROJECT_MEMBER_CHANGED: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.projectMembers = newState.projectMembers || [];
        newState.projectMembers = newState.projectMembers.slice();
        for (let i = 0; i < newState.projectMembers.length; i++) {
          if (newState.projectMembers[i].userId === action.userId) {
            newState.projectMembers[i] = Object.assign({}, {userId: action.userId}, action.userData)
            newState.projectMembers.sort(Helpers.byUsername);
            return newState;
          }
        }
        return state;
      }
      return state;
    }
    case ActionTypes.PROJECT_MEMBER_REMOVED: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.projectMembers = newState.projectMembers || [];
        newState.projectMembers = newState.projectMembers.slice();
        
        for (let i = 0; i < newState.projectMembers.length; i++) {
          if (newState.projectMembers[i].userId === action.userId) {
            newState.projectMembers.splice(i, 1);
            return newState;    
          }
        }
        return state;
      }
      return state;
    }
    case ActionTypes.UNLOAD_PROJECT_MEMBERS:
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          projectMembers: []
        }
      }
      return state;
    // case ActionTypes.LIKES_BY_USER_ADDED_ACTION: {
    //   if (action.source === Constants.PROJECT_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.likesByUser = newState.likesByUser || {};
    //     newState.likesByUser = Object.assign({}, newState.likesByUser);
    //     newState.likesByUser[action.id] = true
    //     return newState;
    //   }
    //   return state;
    // }
    default:
      return state;
  }
};