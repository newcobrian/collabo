import { SHOW_MODAL, HIDE_MODAL, FRIEND_SELECTOR_SUBMIT } from '../actions'

const initialState = {
  modalType: null,
  modalProps: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
  	case SHOW_MODAL:
  		return {
  			modalType: action.modalType,
  			review: action.review
  		}
  	case HIDE_MODAL:
  		return initialState;
    case FRIEND_SELECTOR_SUBMIT:
      return initialState;
  	default:
  		return state
  	}
}