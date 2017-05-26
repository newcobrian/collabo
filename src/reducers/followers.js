import { GET_FOLLOWERS,  UNLOAD_FOLLOWERS, GET_USER, IS_FOLLOWING } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_FOLLOWERS:
      return {
        ...state,
        followers: action.payload
      }
    case GET_USER:
      return {
        ...state,
        profile: action.payload
      };
    case IS_FOLLOWING:
      return {
        ...state,
        isFollowing: action.payload
      }
    case UNLOAD_FOLLOWERS:
      return {}
    default:
      return state;
  }
};