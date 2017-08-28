import { GET_FOLLOWERS,  UNLOAD_FOLLOWERS, GET_USER, IS_FOLLOWING } from '../actions';
import * as ActionTypes from '../actions/types';

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
    case ActionTypes.GET_PROFILE_COUNTS:
      return {
        ...state,
        numFollowers: action.numFollowers,
        numFollowing: action.numFollowing,
        numGuides: action.numGuides,
        numLikes: action.numLikes
      }
    case UNLOAD_FOLLOWERS:
      return {}
    default:
      return state;
  }
};