import { SHOW_MODAL, HIDE_MODAL, NEW_ITINERARY_MODAL, FRIEND_SELECTOR_SUBMIT, REVIEW_SUBMITTED, 
  FORWARD_MODAL, SAVE_MODAL, ADDED_TO_ITINERARY, SUBJECT_DUPLICATE, SHOW_NEW_ITINERARY_MODAL, 
  UPDATE_FIELD_CREATE, CREATE_SUBMIT_ERROR } from '../actions'

const initialState = {
  modalType: null,
  modalProps: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
  	case SHOW_MODAL:
  		return {
        ...state,
  			modalType: action.modalType,
  			review: action.review,
        images: action.images,
        itinerariesList: action.itinerariesList
  		}
    case SHOW_NEW_ITINERARY_MODAL:
      return {
        ...state,
        modalType: NEW_ITINERARY_MODAL,
        auth: action.auth,
        review: action.review
      }
    case UPDATE_FIELD_CREATE:
      if(action.source === NEW_ITINERARY_MODAL) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case HIDE_MODAL:
    case SUBJECT_DUPLICATE:
    case ADDED_TO_ITINERARY:
    case FRIEND_SELECTOR_SUBMIT:
      return initialState;
    case REVIEW_SUBMITTED:
      return {
        ...state,
        modalType: FORWARD_MODAL,
        review: action.review
      };
    case CREATE_SUBMIT_ERROR:
      if (action.source === NEW_ITINERARY_MODAL) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
  	default:
  		return state
  	}
}