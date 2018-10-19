import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
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
      if (action.source === Constants.CREATE_ORG_PAGE) {
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
    case ActionTypes.LOAD_NEW_ORG_USER_INFO:
      if (action.source === Constants.CREATE_ORG_PAGE) {
        return {
          ...state,
          username: action.username ? action.username : null,
          fullName: action.fullName ? action.fullName : null,
          image: action.image ? action.image : null
        }
      }
      else return state;
    case ActionTypes.ORG_CREATED:
      return {}
  	case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.CREATE_ORG_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    default:
      return state;
  }
};