import { GET_USER_FEED, USER_FEED_UNLOADED, GET_GLOBAL_FEED, GLOBAL_FEED_UNLOADED, APPLY_TAG,
GET_LIKES_OR_SAVES_BY_USER, ITINERARY_DELETED, FOLLOWER_ADDED_ACTION,
USER_ADDED_ACTION, LIKES_BY_USER_ADDED_ACTION, FOLLOWER_REMOVED_ACTION, 
ITINERARIES_BY_USER_ADDED_ACTION, ITINERARIES_BY_USER_REMOVED_ACTION,
ITINERARIES_BY_USER_CHANGED_ACTION } from '../actions';
import { filter } from 'lodash';

const lastModifiedDesc = (a, b) => {
  return b.lastModified - a.lastModified;
}

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
    case GET_GLOBAL_FEED:
      return {
        ...state,
        itineraries: action.payload
      };
    case GET_LIKES_OR_SAVES_BY_USER:
      return {
        ...state,
        feed: action.payload
      }
    case ITINERARY_DELETED:
      return {...state}
    case APPLY_TAG:
      return {
        ...state,
        tag: action.payload
      }
    case USER_FEED_UNLOADED:
    case GLOBAL_FEED_UNLOADED:
      return {};
    case FOLLOWER_ADDED_ACTION: {
      // get new follower itinerary array, concat to current state array, then sort and return
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries.slice();
      newState.itineraries = action.addItineraries.concat(newState.itineraries);
      newState.itineraries.sort(lastModifiedDesc);
      return newState;
    }
    case FOLLOWER_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries.slice();
      newState.itineraries = filter(newState.itineraries, function(itin) {
        return action.removeIds.indexOf(itin.id) === -1;
      })
      newState.itineraries.sort(lastModifiedDesc);
      return newState;
    }
    case ITINERARIES_BY_USER_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries.slice();
      newState.itineraries.push(action.itinerary);
      newState.itineraries.sort(lastModifiedDesc);
      return newState;
    }
    case ITINERARIES_BY_USER_CHANGED_ACTION: {
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries.slice();
      return newState;
    }
    case ITINERARIES_BY_USER_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries.slice();
      newState.itineraries = filter(newState.itineraries, ['id', !action.itineraryId]);
      return newState;
    }
    default:
      return state;
  }
};