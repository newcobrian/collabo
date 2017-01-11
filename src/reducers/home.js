import { GET_USER_FEED } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
      return {
        ...state,
        userFeed: action.payload
        // tags: action.payload[0].tags
      };
    case 'HOME_PAGE_UNLOADED':
      return {};
  }

  return state;
};