import { GET_USER_FEED, USER_FEED_UNLOADED, GET_GLOBAL_FEED, GLOBAL_FEED_UNLOADED } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
      return {
        ...state,
        feed: action.payload
        // tags: action.payload[0].tags
      };
    case GET_GLOBAL_FEED:
      return {
        ...state,
        feed: action.payload
      }
    case USER_FEED_UNLOADED:
    case GLOBAL_FEED_UNLOADED:
      return {};
    default:
      return state;
  }
};