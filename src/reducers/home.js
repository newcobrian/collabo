import { GET_USER_FEED, USER_FEED_UNLOADED } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
      return {
        ...state,
        userFeed: action.payload
        // tags: action.payload[0].tags
      };
    case USER_FEED_UNLOADED:
      return {};
  }

  return state;
};