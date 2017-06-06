import { SHOW_MODAL, HIDE_MODAL, FRIEND_SELECTOR_SUBMIT, REVIEW_SUBMITTED, FORWARD_MODAL, 
  SAVE_MODAL, ADDED_TO_ITINERARY } from '../actions'

const initialState = {
  modalType: null,
  modalProps: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
  	case SHOW_MODAL:
  		return {
        ...state,
  			modalType: action.modalType,
  			review: action.review,
        itinerariesList: action.itinerariesList
  		}
  	case HIDE_MODAL:
    case ADDED_TO_ITINERARY:
  		return initialState;
    case FRIEND_SELECTOR_SUBMIT:
      return initialState;
    case REVIEW_SUBMITTED:
      return {
        ...state,
        modalType: FORWARD_MODAL,
        review: action.review
      };
  	default:
  		return state
  	}
}