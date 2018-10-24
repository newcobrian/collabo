import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = { usersData: {}, threadCounts: {}, feedEndValue: null, isFeedLoading: false, 
  projectNames: {}, invalidOrgUser: false, orgUserData: {}, orgMembers: [], projectMembers: [] }

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
          newState.threads = newState.threads.concat(Object.assign({}, {threadId: action.threadId}, action.thread));
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
        
        for (let i = 0; i < newState.threads.length; i++) {
          if (newState.threads[i].threadId === action.threadId) {
            newState.threads[i] = Object.assign({}, {threadId: action.threadId}, action.thread);
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
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          orgId: action.orgId,
          invalidOrgUser: false
        }
      }
      return state;
    }
    case ActionTypes.UNLOAD_ORG: {
      return {
        ...state,
        org: {},
        feedEndValue: new Date().getTime(),
        invalidOrgUser: false
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
    case ActionTypes.LOAD_PROJECT_NAMES:
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          projectNames: action.projectNames
        }
      }
      return state;
    case ActionTypes.UNLOAD_PROJECT_NAMES:
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          projectNames: {}
        }
      }
      return state;
    case ActionTypes.LIST_ADDED_ACTION:
    case ActionTypes.LIST_CHANGED_ACTION: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.projectCheck = Object.assign({}, state.projectCheck || {});

        newState.projectCheck[action.id] = action.data.isPublic ? 'public' : 'private'

        return newState;
      }
      return state;
    }
    case ActionTypes.LIST_REMOVED_ACTION: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        newState.projectCheck = Object.assign({}, state.projectCheck || {});

        delete newState.projectCheck[action.id]

        return newState;
      }
      return state;
    }
    case ActionTypes.UNLOAD_PROJECT_LIST:
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          projectList: []
        }
      }
      return state;
    // case ActionTypes.ORG_MEMBER_ADDED: {
    //   if (action.source === Constants.PROJECT_PAGE) {
    //     const newState = Object.assign({}, state);
    //     // first create orgMembers array
    //     newState[action.membersList] = newState[action.membersList] || [];
    //     newState[action.membersList] = newState[action.membersList].slice();
    //     newState[action.membersList] = newState[action.membersList].concat(Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username}));
    //     newState[action.membersList].sort(Helpers.byUsername);

    //     // if this is an org user, update the org user object
    //     if (action.membersList === Constants.ORG_MEMBERS_LIST) {
    //       newState.orgUserData = Object.assign({}, state.orgUserData || {});
    //       newState.orgUserData[action.userId] = Object.assign({}, action.userData)
    //     }
    //     return newState;
    //   }
    //   return state;
    // }
    // case ActionTypes.ORG_MEMBER_CHANGED: {
    //   if (action.source === Constants.PROJECT_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState[action.membersList] = newState[action.membersList] || [];
    //     newState[action.membersList] = newState[action.membersList].slice();
    //     for (let i = 0; i < newState[action.membersList].length; i++) {
    //       if (newState[action.membersList][i].id === action.id) {
    //         newState[action.membersList][i] = Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username})
    //         newState[action.membersList].sort(Helpers.byUsername);
    //         break;
    //       }
    //     }

    //     // if this is an org user, update the org user object
    //     if (action.membersList === Constants.ORG_MEMBERS_LIST) {
    //       newState.orgUserData = Object.assign({}, state.orgUserData || {});
    //       newState.orgUserData[action.userId] = Object.assign({}, action.userData)
    //     }
    //     return newState;
    //   }
    //   return state;
    // }
    // case ActionTypes.ORG_MEMBER_REMOVED: {
    //   if (action.source === Constants.PROJECT_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState[action.membersList] = newState[action.membersList] || [];
    //     newState[action.membersList] = newState[action.membersList].slice();
        
    //     for (let i = 0; i < newState[action.membersList].length; i++) {
    //       if (newState[action.membersList][i].id === action.id) {
    //         newState[action.membersList].splice(i, 1);
    //         return newState;    
    //       }
    //     }
    //     return state;
    //   }
    //   return state;
    // }
    case ActionTypes.ORG_MEMBER_ADDED: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);

        // add user to orgUserData, which other lists can reference for all data for all users in org
        newState.orgUserData = Object.assign({}, state.orgUserData || {});
        newState.orgUserData[action.userId] = Object.assign({}, action.userData)

        // create array of org members sorted by username for displaying list of org members
        newState.orgMembers = newState.orgMembers || [];
        newState.orgMembers = newState.orgMembers.slice();
        newState.orgMembers = newState.orgMembers.concat(Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username}));
        newState.orgMembers.sort(Helpers.byUsername);

        // run through projectMembers list and update user data if found
        for (let i = 0; i < newState.projectMembers.length; i++) {
          if (newState.projectMembers[i].userId === action.userId) {
            newState.projectMembers[i] = Object.assign({}, { userId: action.userId }, action.userData)
            newState.projectMembers.sort(Helpers.byUsername);
            break;
          }
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.ORG_MEMBER_CHANGED: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);

        // update user info in global org user data
        newState.orgUserData = Object.assign({}, state.orgUserData || {});
        newState.orgUserData[action.userId] = Object.assign({}, action.userData)

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

        // run through projectMembers list and update user data if found
        for (let i = 0; i < newState.projectMembers.length; i++) {
          if (newState.projectMembers[i].userId === action.userId) {
            newState.projectMembers[i] = Object.assign({}, { userId: action.userId }, action.userData)
            newState.projectMembers.sort(Helpers.byUsername);
            break;
          }
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.ORG_MEMBER_REMOVED: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);

        // remove user info in global org user data
        newState.orgUserData = Object.assign({}, state.orgUserData || {});
        delete newState.orgUserData[action.userId]

        // remove from orgMembers list
        newState.orgMembers = newState.orgMembers || [];
        newState.orgMembers = newState.orgMembers.slice();
        
        for (let i = 0; i < newState.orgMembers.length; i++) {
          if (newState.orgMembers[i].userId === action.userId) {
            newState.orgMembers.splice(i, 1);
            break;
          }
        }
        // do we need to remove from projectMembers?

        return newState;
      }
      return state;
    }
    case ActionTypes.PROJECT_MEMBER_ADDED: {
      if (action.source === Constants.PROJECT_PAGE) {
        const newState = Object.assign({}, state);
        // first create orgMembers array
        newState.projectMembers = newState.projectMembers || [];
        newState.projectMembers = newState.projectMembers.slice();
        let memberData = newState.orgUserData && newState.orgUserData[action.userId] ? newState.orgUserData[action.userId] : { username: '' }
        newState.projectMembers = newState.projectMembers.concat(Object.assign({}, { userId: action.userId }, memberData, { id: action.userId }, {display: memberData}));
        newState.projectMembers.sort(Helpers.byUsername);

        return newState;
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
      return state
     case ActionTypes.UNLOAD_ORG_MEMBERS:
      if (action.source === Constants.PROJECT_PAGE) {
        return {
          ...state,
          orgMembers: [],
          orgUserData: {}
        }
      }
      return state
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