import { GET_USER_FEED, USER_FEED_UNLOADED, HOME_PAGE_LOADED, GET_GLOBAL_FEED } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
      return {
        ...state,
        userFeed: action.payload
        // tags: action.payload[0].tags
      };
    case GET_GLOBAL_FEED:
      return {
        ...state,
        globalFeed: action.payload
      }
    case USER_FEED_UNLOADED:
      return {};
  }

  return state;
};