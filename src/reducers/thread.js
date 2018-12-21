import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { filter, omit, find } from 'lodash';

// import { EditorState, ContentState, convertToRaw, convertFromRaw } from 'draft-js';

const initialState = { threadCounts: {}, tab: Constants.DISCUSSION_TAB, attachmentCount: 0 }

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
        //   Object.keys(action.comment.nestedComments).map(function(nestedId) {
        //     // nestedArray = nestedArray.concat(Object.assign({}, {id: nestedId}, action.comment.nestedComments[nestedId]))
        //     let nestedObject = Object.assign({}, {id: nestedId}, action.comment.nestedComments[nestedId])
        //     nestedArray = [nestedObject].concat(nestedArray)
        //   })
        //   commentObject.nestedComments = [].concat(nestedArray)
        // }
        newState.comments = newState.comments.concat(commentObject)
        // newState.comments.sort(Helpers.lastModifiedDesc);

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
          //   Object.keys(action.comment.nestedComments).map(function(nestedId) {
          //     // nestedArray = nestedArray.concat(Object.assign({}, {id: nestedId}, action.comment.nestedComments[nestedId]))
          //     let nestedObject = Object.assign({}, {id: nestedId}, action.comment.nestedComments[nestedId])
          //     nestedArray = [nestedObject].concat(nestedArray)
          //   })
          //   commentObject.nestedComments = [].concat(nestedArray)
          // }

          newState.comments[i] = Object.assign({}, commentObject)
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
      if(action.source === Constants.THREAD_PAGE || action.source === Constants.THREAD_MODAL) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ActionTypes.THREAD_LIKES_ADDED_ACTION: {
      if (action.source === Constants.THREAD_PAGE || action.source === Constants.THREAD_MODAL) {
        const newState = Object.assign({}, state);
        newState.likes = newState.likes || {};
        newState.likes = Object.assign({}, newState.likes);
        if (!newState.likes[action.userId]) {
          newState.likes[action.userId] = true
          return newState;
        }
        return state;
      }
      return state;
    }
    case ActionTypes.THREAD_LIKES_REMOVED_ACTION: {
      if (action.source === Constants.THREAD_PAGE || action.source === Constants.THREAD_MODAL) {
        const newState = Object.assign({}, state);
        newState.likes = newState.likes || {};
        newState.likes = Object.assign({}, newState.likes);
        if (newState.likes[action.userId]) {
          delete newState.likes[action.userId]
          return newState;
        }
        return state;
      }
      return state;
    }
    case ActionTypes.UNLOAD_THREAD_LIKES:
      return {
        ...state,
        likes: {}
      }
    case ActionTypes.ORG_MEMBER_ADDED: {
      if (action.source === Constants.THREAD_PAGE) {
        const newState = Object.assign({}, state);

        // add user to orgUserData, which other lists can reference for all data for all users in org
        newState.orgUserData = Object.assign({}, state.orgUserData || {});
        newState.orgUserData[action.userId] = Object.assign({}, action.userData)

        // create array of org members sorted by username for displaying list of org members
        newState.orgMembers = newState.orgMembers || [];
        newState.orgMembers = newState.orgMembers.slice();
        newState.orgMembers = newState.orgMembers.concat(Object.assign({}, { userId: action.userId }, action.userData, { id: action.userId }, {display: action.userData.username}));
        newState.orgMembers.sort(Helpers.byUsername);

        return newState;
      }
      return state;
    }
    case ActionTypes.ORG_MEMBER_CHANGED: {
      if (action.source === Constants.THREAD_PAGE) {
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

        return newState;
      }
      return state;
    }
    case ActionTypes.ORG_MEMBER_REMOVED: {
      if (action.source === Constants.THREAD_PAGE) {
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

        return newState;
      }
      return state;
    }
    case ActionTypes.UNLOAD_ORG_MEMBERS:
      if (action.source === Constants.THREAD_PAGE) {
        return {
          ...state,
          orgMembers: []
        }
      }
      return state
    case ActionTypes.SHOW_THREAD_MODAL:
      return {
        ...state,
        thread: action.thread,
        project: action.project,
        bodyText: action.thread.body,
        org: action.org,
        orgMembers: action.orgMembers,
        orgUserData: action.orgUserData
      }
    case ActionTypes.UNLOAD_THREAD_MODAL:
      return initialState
    case ActionTypes.LOAD_THREAD_ATTACHMENTS_ADDED: {
      if (action.source === Constants.THREAD_PAGE || action.source === Constants.THREAD_MODAL) {
        const newState = Object.assign({}, state);

        // add to attachment list
        newState.attachments = newState.attachments || [];
        newState.attachments = newState.attachments.slice();
        let attachmentObject = Object.assign({}, { attachmentId: action.attachmentId }, action.payload)
        // add the username from orgUserData so we can sort attachments by username
        if (newState.orgUserData && action.payload && action.payload.userId && newState.orgUserData[action.payload.userId]) {
          attachmentObject.username = newState.orgUserData[action.payload.userId].username
        }
        newState.attachments.push(attachmentObject)
        newState.attachmentCount = newState.attachmentCount + 1

        return newState;
      }
      return state;
    }
    case ActionTypes.LOAD_THREAD_ATTACHMENTS_CHANGED: {
      if (action.source === Constants.THREAD_PAGE || action.source === Constants.THREAD_MODAL) {
        const newState = Object.assign({}, state);

        // modify existing attachment in list if it exists
        newState.attachments = newState.attachments || [];
        newState.attachments = newState.attachments.slice();
        for (let i = 0; i < newState.attachments.length; i++) {
          if (newState.attachments[i].attachmentId === action.attachmentId) {
            newState.attachments[i] = Object.assign({}, { attachmentId: action.attachmentId }, action.payload)
            break;
          }
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.LOAD_THREAD_ATTACHMENTS_REMOVED: {
      if (action.source === Constants.THREAD_PAGE || action.source === Constants.THREAD_MODAL) {
        const newState = Object.assign({}, state);

        // remove from attachments list
        newState.attachments = newState.attachments || [];
        newState.attachments = newState.attachments.slice();
        for (let i = 0; i < newState.attachments.length; i++) {
          if (newState.attachments[i].attachmentId === action.attachmentId) {
            newState.attachments.splice(i, 1);
            newState.attachmentCount = newState.attachmentCount - 1
            break;
          }
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.UNLOAD_THREAD_ATTACHMENTS:
      return {
        ...state,
        attachments: [],
        attachmentCount: 0
      }
    case ActionTypes.CHANGE_TAB: {
      if (action.source === Constants.THREAD_PAGE) {
        return {
          ...state,
          tab: action.tab
        }
      }
      else return state
    }
    case ActionTypes.SORT_FILES: {
      if (action.source === Constants.THREAD_PAGE) {
        const newState = Object.assign({}, state);

        // remove from attachments list
        newState.attachments = newState.attachments || [];
        newState.attachments = newState.attachments.slice();

        if (newState.sortMethod !== action.method) {
          switch (action.method) {
            case 'LAST_MODIFIED_DESC':
              newState.attachments.sort(Helpers.lastModifiedDesc)
              break;
            case 'LAST_MODIFIED_ASC':
              newState.attachments.sort(Helpers.lastModifiedAsc)
              break;
            case 'FILENAME':
              newState.attachments.sort(Helpers.byName)
              break;
            case 'USERNAME':
              newState.attachments.sort(Helpers.byUsername)
              break;
          }
          newState.sortMethod = action.method
        }
        return newState
      }
      return state;
    }
    default:
      return state;
  }
};