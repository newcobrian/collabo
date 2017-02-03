import { CREATE_PAGE_LOADED, CREATE_SUBJECT_LOADED, UPDATE_FIELD_CREATE, REVIEW_SUBMITTED, 
  CREATE_PAGE_UNLOADED, CREATE_SUBJECT_CLEARED } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
  	case CREATE_PAGE_LOADED:
  	case CREATE_PAGE_UNLOADED:
  		return {};
  	case CREATE_SUBJECT_LOADED:
  		return {
  			...state,
  			subject: action.payload,
        review: action.review,
  			subjectId: action.subjectId
  		}
    case CREATE_SUBJECT_CLEARED:
      return {
        ...state,
        subject: null,
        review: null,
        subjectId: null
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