import { GET_USER_FEED, USER_FEED_UNLOADED, HOME_PAGE_LOADED } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
      return {
        ...state,
        userFeed: action.payload
        // tags: action.payload[0].tags
      };
    case HOME_PAGE_LOADED:
      return {
        ...state,
        tab: action.payload
      }
    case USER_FEED_UNLOADED:
      return {};
  }

  return state;
};