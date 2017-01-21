import { GET_INBOX, INBOX_COUNT_UPDATED, INBOX_UNLOADED } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_INBOX:
      return {
        ...state,
        inbox: action.payload
      };
      break;
    case INBOX_COUNT_UPDATED:
      return {
        ...state
    }
    case INBOX_UNLOADED:
    	return {}
  }

  return state;
};