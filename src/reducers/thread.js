import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { filter } from 'lodash'
import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';

const initialState = { threadCounts: {}, usersList: [] }

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
        createdBy: action.createdBy,
        project: action.project,
        bodyText: Helpers.convertStoredToEditorState(action.thread.body)
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
        newState.comments = newState.comments.concat(Object.assign({}, {id: action.commentId}, action.comment));
        // newState.commentsData[action.objectId].sort(Helpers.lastModofiedAsc);

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
          newState.comments[i] = Object.assign({}, {id: action.commentId}, action.comment)
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
        org: action.organization,
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
        newState.bodyText = newState.thread && newState.thread.body ? Helpers.convertStoredToEditorState(newState.thread.body) : EditorState.createEmpty()
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
    case ActionTypes.USERNAME_LOADED: {
      if (action.source === Constants.THREAD_PAGE) {
        const newState = Object.assign({}, state);
        newState.usersList = newState.usersList || [];
        newState.usersList = newState.usersList.slice();
        newState.usersList = newState.usersList.concat(Object.assign({}, {text: action.username}, 
          {value: action.username}, {url: '/' + action.orgName + '/user/' + action.username}, {email: action.email}, {id: action.username}, {display: action.username}));
        return newState;
      }
      return state;
    }
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
    default:
      return state;
  }
};