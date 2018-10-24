import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { filter, omit } from 'lodash';

// import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';

const initialState = { threadCounts: {}, }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_THREAD: {
      // console.log(action.thread.body)
      // const contentState = convertFromRaw( JSON.parse( action.thread.body ) );
      // console.log(contentState)
      // const formattedEditorBody = EditorState.createWithContent(contentState)
      // console.log(formattedEditorBody)

      return {
        ...state,
        thread: action.thread,
        // createdBy: action.createdBy,
        project: action.project,
        bodyText: action.thread.body
        // bodyText: Helpers.convertStoredToEditorState(action.thread.body)
      }
    }
    case ActionTypes.THREAD_NOT_FOUND_ERROR:
      return {
        ...state,
        threadNotFoundError: true
      }
    case ActionTypes.THREAD_UPDATED:
      return {
        ...state,
        isEditMode: false
      }
    case ActionTypes.COMMENT_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.comments = newState.comments || [];
      newState.comments = newState.comments.slice();
      if (!find(newState.comments, ['id', action.commentId])) {
        let commentObject = Object.assign({}, {id: action.commentId}, action.comment)
        // let commentObject = Object.assign({}, {id: action.commentId}, omit(action.comment, ['nestedComments']))

        // if (action.comment.nestedComments) {
        //   let nestedArray = []
        //   Object.keys(action.comment.nestedComments || {}).map(function(nestedId) {
        //     nestedArray = nestedArray.concat(Object.assign({}, {id: nestedId}, action.comment.nestedComments[nestedId]))
        //   })
        //   commentObject.nestedComments = [].concat(nestedArray)
        // }
        newState.comments = newState.comments.concat(commentObject)

        // newState.commentsData[action.objectId].sort(Helpers.lastModifiedAsc);

        return newState;
      }
      else return state;
    }
    case ActionTypes.COMMENT_CHANGED_ACTION: {
      const newState = Object.assign({}, state);
      newState.comments = newState.comments || [];
      newState.comments = newState.comments.slice();
      for (let i = 0; i < newState.comments.length; i++) {
        if (newState.comments[i].id === action.commentId) {
          let commentObject = Object.assign({}, {id: action.commentId}, action.comment)
          // let commentObject = Object.assign({}, {id: action.commentId}, omit(action.comment, ['nestedComments']))

          // if (action.comment.nestedComments) {
          //   let nestedArray = []
          //   Object.keys(action.comment.nestedComments || {}).map(function(nestedId) {
          //     nestedArray = nestedArray.concat(Object.assign({}, {id: nestedId}, action.comment.nestedComments[nestedId]))
          //   })
          //   commentObject.nestedComments = [].concat(nestedArray)
          // }
          newState.comments[i] = commentObject
          return newState;    
        }
      }
      return state;
    }
    case ActionTypes.COMMENT_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.comments = newState.comments || [];
      newState.comments = newState.comments.slice();
      newState.comments = filter(newState.comments, function(o) {
        return !(action.commentId === o.id) });

      return newState;
    }
    case ActionTypes.CHANGE_EDITOR_STATE:
      return {
        ...state,
        editorState: action.editorState
      }
    case ActionTypes.UNLOAD_THREAD:
      return {}
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
        org: {}
      }
    }
    case ActionTypes.SET_EDIT_MODE: {
      if (action.editMode === false) {
        const newState = Object.assign({}, state);
        newState.thread = newState.thread || {};
        newState.thread = Object.assign({}, newState.thread);
        // newState.bodyText = newState.thread && newState.thread.body ? Helpers.convertStoredToEditorState(newState.thread.body) : EditorState.createEmpty()
        newState.bodyText = newState.thread && newState.thread.body ? newState.thread.body : ''
        newState.isEditMode = action.editMode
        return newState;
      }
      else {
        return {
          ...state,
          isEditMode: action.editMode,
          // bodyText: state.thread && state.thread.body ? state.thread.body : ''
        }
      }
    }
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.THREAD_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    // case ActionTypes.USERNAME_LOADED: {
    //   if (action.source === Constants.THREAD_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.usersList = newState.usersList || [];
    //     newState.usersList = newState.usersList.slice();
    //     newState.usersList = newState.usersList.concat(Object.assign({}, {text: action.username}, 
    //       {value: action.username}, {url: '/' + action.orgName + '/user/' + action.username}, {email: action.email}, {id: action.username}, {display: action.username}));
    //     return newState;
    //   }
    //   return state;
    // }
    // case ActionTypes.UNLOAD_ORG_USERS: {
    //   if (action.source === Constants.THREAD_PAGE) {
    //     return {
    //       ...state,
    //       usersList: []
    //     }
    //   }
    //   return state
    // }
    case ActionTypes.THREAD_LIKES_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.likes = newState.likes || {};
      newState.likes = Object.assign({}, newState.likes);
      if (!newState.likes[action.userId]) {
        newState.likes[action.userId] = Object.assign({}, action.userData)
        return newState;
      }
      return state;
    }
    case ActionTypes.THREAD_LIKES_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.likes = newState.likes || {};
      newState.likes = Object.assign({}, newState.likes);
      if (newState.likes[action.userId]) {
        delete newState.likes[action.userId]
        return newState;
      }
      return state;
    }
    case ActionTypes.UNLOAD_THREAD_LIKES:
      return {
        ...state,
        likes: {}
      }
    case ActionTypes.MEMBER_ADDED: {
      if (action.source === Constants.THREAD_PAGE) {
        const newState = Object.assign({}, state);
        // first add to members list array
        newState[action.membersList] = newState[action.membersList] || [];
        newState[action.membersList] = newState[action.membersList].slice();
        newState[action.membersList] = newState[action.membersList].concat(Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username}));
        newState[action.membersList].sort(Helpers.byUsername);

         // if this is an org user, update the org user object
        if (action.membersList === Constants.ORG_MEMBERS_LIST) {
          newState.orgUserData = Object.assign({}, state.orgUserData || {});
          newState.orgUserData[action.userId] = Object.assign({}, action.userData)
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.MEMBER_CHANGED: {
      if (action.source === Constants.THREAD_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.membersList] = newState[action.membersList] || [];
        newState[action.membersList] = newState[action.membersList].slice();
        for (let i = 0; i < newState[action.membersList].length; i++) {
          if (newState[action.membersList][i].id === action.id) {
            newState[action.membersList][i] = Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username})
            newState[action.membersList].sort(Helpers.byUsername);
            break;
          }
        }

         // if this is an org user, update the org user object
        if (action.membersList === Constants.ORG_MEMBERS_LIST) {
          newState.orgUserData = Object.assign({}, state.orgUserData || {});
          newState.orgUserData[action.userId] = Object.assign({}, action.userData)
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.MEMBER_REMOVED: {
      if (action.source === Constants.THREAD_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.membersList] = newState[action.membersList] || [];
        newState[action.membersList] = newState[action.membersList].slice();
        
        for (let i = 0; i < newState[action.membersList].length; i++) {
          if (newState[action.membersList][i].id === action.id) {
            newState[action.membersList].splice(i, 1);
            return newState;    
          }
        }
        return state;
      }
      return state;
    }
    case ActionTypes.UNLOAD_MEMBERS:
      if (action.source === Constants.THREAD_PAGE) {
        return {
          ...state,
          [action.membersList]: []
        }
      }
      return state
    default:
      return state;
  }
};