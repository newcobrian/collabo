import { GET_INBOX, INBOX_COUNT_UPDATED, INBOX_UNLOADED } from '../actions'
import { isEqual, isEmpty } from 'lodash'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_INBOX:
      return {
        ...state,
        inbox: action.payload
      }
    case INBOX_COUNT_UPDATED:
      return {
        ...state
    }
    case INBOX_UNLOADED:
    	return {}
    default:
      return state;
  }
};