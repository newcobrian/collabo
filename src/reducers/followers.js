import { GET_FOLLOWERS, GET_FOLLOWINGS, UNLOAD_FOLLOWERS } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_FOLLOWERS:
      return {
        ...state,
        followers: action.payload
      }
    case UNLOAD_FOLLOWERS:
      return {}
  }

  return state;
};