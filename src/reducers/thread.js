import * as ActionTypes from '../actions/types';
import { filter } from 'lodash'

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_THREAD:
      return {
        ...state,
        thread: action.thread,
        createdBy: action.createdBy
      }
    case ActionTypes.THREAD_NOT_FOUND_ERROR:
      return {
        ...state,
        threadNotFoundError: true
      }
    case ActionTypes.THREAD_UPDATED:
      return {
        ...state
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
    case ActionTypes.UNLOAD_THREAD:
      return {}
    default:
      return state;
  }
};