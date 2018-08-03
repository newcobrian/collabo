import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import { filter } from 'lodash'
import { EditorState } from 'draft-js';

const initialState = { threadCounts: {} }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_THREAD:
      return {
        ...state,
        thread: action.thread,
        createdBy: action.createdBy,
        project: action.project,
        bodyText: action.thread.body
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
    // case ActionTypes.COMMENT_CHANGED_ACTION:
    //   return state;
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
    case ActionTypes.NOT_AN_ORG_USER:
      return {
        ...state,
        invalidOrgUser: true
      }
    case ActionTypes.SET_EDIT_MODE:
      return {
        ...state,
        isEditMode: action.editMode,
        bodyText: state.thread && state.thread.body ? state.thread.body : ''
      }
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.THREAD_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ActionTypes.THREAD_COUNTS_LOADED:
      return {
        ...state,
        threadCounts: action.threadCounts
      }
    case ActionTypes.THREAD_COUNTS_UNLOADED:
      return {
        ...state,
        threadCounts: {}
      }
    default:
      return state;
  }
};