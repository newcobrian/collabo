import { GET_FRIENDS, REVIEW_SUBMITTED, UPDATE_FRIENDS_CHECKBOX, SHOW_MODAL, 
  UNMOUNT_FRIEND_SELECTOR, FRIEND_SELECTOR_SUBMIT, FORWARD_MODAL } from '../actions'

// export default (state = { selectedFriends: new Set() }, action) => {
  export default (state = { selectedFriends: [] }, action) => {
  switch (action.type) {
  	case GET_FRIENDS:
  		return {
  			...state,
  			friends: action.payload
  		}
  	case UPDATE_FRIENDS_CHECKBOX:
  		return {
  			...state,
        selectedFriends: action.payload
  		}
    case FRIEND_SELECTOR_SUBMIT:
      return {
        ...state,
        selectedFriends: action.selectedFriends
      }
    case REVIEW_SUBMITTED:
      return {
        ...state,
        review: action.payload
      }
    case SHOW_MODAL:
      return {
        ...state,
        review: action.review,
        path: FORWARD_MODAL
      }
    case UNMOUNT_FRIEND_SELECTOR:
      return {
        ...state,
        selectedFriends: action.payload
      }
    default:
      return state;
  }
};