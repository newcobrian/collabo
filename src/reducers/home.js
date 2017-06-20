import { GET_USER_FEED, USER_FEED_UNLOADED, GET_GLOBAL_FEED, GLOBAL_FEED_UNLOADED, APPLY_TAG,
GET_LIKES_OR_SAVES_BY_USER, ITINERARY_DELETED } from '../actions';

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
    default:
      return state;
  }
};