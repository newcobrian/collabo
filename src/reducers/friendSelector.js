import { GET_FRIENDS, REVIEW_SUBMITTED, UPDATE_FRIENDS_CHECKBOX } from '../actions'

export default (state = { selectedFriends: new Set() }, action) => {
  switch (action.type) {
  	case GET_FRIENDS:
  		return {
  			...state,
  			friends: action.payload
  		}
  	case UPDATE_FRIENDS_CHECKBOX:
  		return {
  			...state,
  			selectedCheckboxes: action.payload
  		}
    case REVIEW_SUBMITTED:
      return {
        ...state,
        review: action.payload
      }
    default:
      return state;
  }
};