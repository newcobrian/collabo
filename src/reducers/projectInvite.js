import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';

// export default (state = { selectedFriends: new Set() }, action) => {
  export default (state = { selectedUsers: [], selectAll: false }, action) => {
  switch (action.type) {
  	case ActionTypes.GET_FRIENDS:
  		return {
  			...state,
  			friends: action.payload
  		}
  	case ActionTypes.UPDATE_SELECTOR:
      if (action.source === Constants.PROJECT_INVITE_MODAL) {
        return {
          ...state,
          selectedUsers: action.payload
        }
      }
      return state;
    case ActionTypes.FRIEND_SELECTOR_SUBMIT:
      return {
        ...state,
        selectedUsers: action.selectedUsers
      }
    case ActionTypes.REVIEW_SUBMITTED:
      return {
        ...state,
        review: action.payload
      }
    case ActionTypes.SHOW_MODAL:
      return {
        ...state,
        review: action.review,
        path: Constants.FORWARD_MODAL
      }
    case ActionTypes.UNMOUNT_FRIEND_SELECTOR:
      return {
        ...state,
        selectedUsers: action.payload
      }
    // case ActionTypes.ORG_USERS_LOADED: {
    //   if (action.source === Constants.PROJECT_INVITE_PAGE) {
    //     return {
    //       ...state,
    //       usersList: action.usersList
    //     }
    //   }
    //   return state;
    // }
    // case ActionTypes.UNLOAD_ORG_USERS: {
    //   if (action.source === Constants.PROJECT_INVITE_PAGE) {
    //     return {
    //       ...state,
    //       usersList: []
    //     }
    //   }
    // }
    case ActionTypes.LOAD_PROJECT: {
      if (action.source === Constants.PROJECT_INVITE_PAGE) {
        return {
          ...state,
          project: action.project,
          projectNotFoundError: false
        }
      }
      return state;
    }
    case ActionTypes.PROJECT_MEMBER_ADDED: {
      if (action.source === Constants.PROJECT_INVITE_PAGE) {
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
      if (action.source === Constants.PROJECT_INVITE_PAGE) {
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
      if (action.source === Constants.PROJECT_INVITE_PAGE) {
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
      if (action.source === Constants.PROJECT_INVITE_PAGE) {
        return {
          ...state,
          projectMembers: []
        }
      }
      return state;
    case ActionTypes.LOAD_PROJECT_MEMBER_CHECK:
      return {
        ...state,
        projectMemberCheck: action.payload
      }
    case ActionTypes.UNLOAD_PROJECT_MEMBER_CHECK:
      return {
        ...state,
        projectMemberCheck: {}
      }
    default:
      return state;
  }
};