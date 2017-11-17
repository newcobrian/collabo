import { GET_INBOX, INBOX_COUNT_UPDATED, INBOX_UNLOADED } from '../actions'
import { isEqual, isEmpty } from 'lodash'
import * as ActionTypes from '../actions/types'

const lastModifiedDesc = (a, b) => {
  return b.lastModified - a.lastModified;
}

export default (state = {}, action) => {
  switch (action.type) {
    // case GET_INBOX:
    //   return {
    //     ...state,
    //     inbox: action.payload,
    //     dateIndex: action.dateIndex
    //   }
    case ActionTypes.GET_INBOX_ITEM: {
      const newState = Object.assign({}, state);
      newState.inbox = newState.inbox || [];
      newState.inbox = newState.inbox.slice();
      newState.inbox.push(action.payload);
      newState.inbox.sort(lastModifiedDesc);

      if (!newState.dateIndex || action.payload.lastModified < newState.dateIndex) {
        newState.dateIndex = action.payload.lastModified
      }
      return newState;
    }
    case INBOX_COUNT_UPDATED:
      return {
        ...state
    }
    case ActionTypes.END_OF_INBOX_FEED:
      return {
        ...state,
        endOfInbox: true
      }
    case INBOX_UNLOADED:
    	return {}
    default:
      return state;
  }
};