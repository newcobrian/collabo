import { SHOW_MODAL, HIDE_MODAL, FRIEND_SELECTOR_SUBMIT, REVIEW_SUBMITTED, FORWARD_MODAL } from '../actions'

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
  			review: action.review
  		}
  	case HIDE_MODAL:
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