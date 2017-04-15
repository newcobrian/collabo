import { CREATE_PAGE_LOADED, CREATE_SUBJECT_LOADED, UPDATE_FIELD_CREATE, REVIEW_SUBMITTED, 
  CREATE_PAGE_UNLOADED, CREATE_SUBJECT_CLEARED, GET_USER_LOCATION, SET_WATCH_ID, SET_IN_PROGRESS,
  CREATE_SUBMIT_ERROR, SHOW_MODAL, REVIEW_MODAL } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
  	case CREATE_PAGE_LOADED:
      return {
        ...state,
        userImage: action.userImage
      }
  	case CREATE_PAGE_UNLOADED:
  		return {};
  	case CREATE_SUBJECT_LOADED:
  		return {
  			...state,
  			subject: action.payload,
        review: action.review,
        reviewId: action.reviewId,
  			subjectId: action.subjectId,
        rating: action.rating,
        caption: action.caption,
        image: action.image,
        inProgress: null
  		}
    case SHOW_MODAL:
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
        path: REVIEW_MODAL
      }
    case CREATE_SUBJECT_CLEARED:
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
    case CREATE_SUBMIT_ERROR:
      return {
        ...state,
        errors: [action.error],
        inProgress: null
      }
    case SET_IN_PROGRESS:
      return {
        ...state,
        inProgress: true
      }
    case GET_USER_LOCATION:
      return {
        ...state,
        latitude: action.latitude,
        longitude: action.longitude
      }
    case SET_WATCH_ID:
      return {
        ...state,
        watchId: action.payload
      }
  	case REVIEW_SUBMITTED:
      return {
        ...state,
        inProgress: null,
      };
  	case UPDATE_FIELD_CREATE:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
};