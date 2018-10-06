import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
// import { EditorState, convertFromRaw } from 'draft-js';

// const initialContentState = {"entityMap":{},"blocks":[{"key":"637gr","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}
// const initialEditorState = EditorState.createEmpty()

const initialQuillState = { text: '' }

// export default (state = { body: initialEditorState, usersList: [] }, action) => {
export default (state = { body: initialQuillState, usersList: [] }, action) => {
  switch (action.type) {
  	case ActionTypes.CREATE_PAGE_LOADED:
      return {
        ...state,
        userImage: action.userImage
      }
  	case ActionTypes.CREATE_PAGE_UNLOADED:
  		return {};
    case ActionTypes.SHOW_MODAL:
      return {
        ...state,
        subject: action.subject,
        review: action.review,
        reviewId: action.reviewId,
        subjectId: action.subjectId,
        rating: action.rating,
        caption: action.caption,
        image: action.image,
        inProgress: null,
        path: Constants.REVIEW_MODAL
      }
    case ActionTypes.CREATE_SUBJECT_CLEARED:
      return {
        ...state,
        subject: null,
        review: null,
        reviewId: null,
        subjectId: null,
        rating: null,
        caption: null,
        image: null,
        inProgress: null
      }
    case ActionTypes.CREATE_SUBMIT_ERROR:
      // console.log('reducer - ' + action.source)
      if (action.source === Constants.ADD_THREAD_PAGE) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
    case ActionTypes.SET_IN_PROGRESS:
      return {
        ...state,
        inProgress: true
      }
    case ActionTypes.NOT_AN_ORG_USER:
      return {
        ...state,
        invalidOrgUser: true
      }
  	case ActionTypes.PROJECT_CREATED:
      return {
        ...state,
        inProgress: null,
        project: action.project,
        projectId: action.projectId
      }
    case ActionTypes.THREAD_CREATED:
      return {}
  	case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.ADD_THREAD_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ActionTypes.USERNAME_LOADED: {
      if (action.source === Constants.ADD_THREAD_PAGE) {
        const newState = Object.assign({}, state);
        newState.usersList = newState.usersList || [];
        newState.usersList = newState.usersList.slice();
        newState.usersList = newState.usersList.concat(Object.assign({}, {text: action.username}, {value: action.username}, {url: '/user/' + action.username}));
        return newState;
      }
      return state;
    }
    case ActionTypes.LIST_ADDED_ACTION: {
      if (action.source === Constants.ADD_THREAD_PAGE && action.listType === Constants.PROJECT_LIST_TYPE) {
        const newState = Object.assign({}, state);
        newState.projectObject = newState.projectObject || {};
        newState.projectObject = Object.assign({}, newState.projectObject);
        if (!newState.projectObject[action.id]) {
          newState.projectObject[action.id] = action.name
          return newState;
        }
        return state;
      }
      return state;
    }
    case ActionTypes.LIST_CHANGED_ACTION: {
      if (action.source === Constants.ADD_THREAD_PAGE && action.listType === Constants.PROJECT_LIST_TYPE) {
        const newState = Object.assign({}, state);
        newState.projectObject = newState.projectObject || {};
        newState.projectObject = Object.assign({}, newState.projectObject);
        if (!newState.projectObject[action.id]) {
          newState.projectObject[action.id] = action.name
          return newState;
        }
        return state;
      }
      return state;
    }
    case ActionTypes.LIST_REMOVED_ACTION: {
      if (action.source === Constants.ADD_THREAD_PAGE && action.listType === Constants.PROJECT_LIST_TYPE) {
        const newState = Object.assign({}, state);
        newState.projectObject = newState.likesData || {};
        newState.projectObject = Object.assign({}, newState.projectObject);
        if (newState.projectObject[action.id]) {
          newState.projectObject[action.id] = undefined;
          return newState
        }
        return state;
      }
      return state;
    }
    case ActionTypes.LOAD_ADD_THREAD_PROJECT:
      return {
        ...state,
        projectId: action.projectId,
        projectName: action.projectName
      }
    case ActionTypes.CHANGE_ADD_THREAD_PROJECT:
      return {
        ...state,
        projectId: action.projectId,
        projectName: action.projectName
      }
    case ActionTypes.LOAD_ORG: {
      if (action.source === Constants.ADD_THREAD_PAGE) {
        return {
          ...state,
          orgId: action.orgId,
          invalidOrgUser: false
        }
      }
    }
    default:
      return state;
  }
};