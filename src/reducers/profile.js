import { GET_USER, GET_REVIEWS_BY_USER, GET_FOLLOWING_COUNT, GET_FOLLOWER_COUNT, GET_LIKES_OR_SAVES_BY_USER, 
  UNLOAD_LIKES_OR_SAVES_BY_USER, GET_ITINERARIES_BY_USER } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case 'PROFILE_PAGE_LOADED':
    case 'PROFILE_FAVORITES_PAGE_LOADED':
      return {
        ...action.payload[0].profile
      };
    case 'PROFILE_PAGE_UNLOADED':
    case 'PROFILE_FAVORITES_PAGE_UNLOADED':
    case 'REVIEWS_BY_USER_UNLOADED':
    case UNLOAD_LIKES_OR_SAVES_BY_USER:
      return {};
    case 'FOLLOW_USER':
    case 'UNFOLLOW_USER':
      return {
        ...action.payload.profile
      };
    case GET_USER:
      return {
        ...state,
        profile: action.payload
      };
    case 'IS_FOLLOWING':
      return {
        ...state,
        isFollowing: action.payload
      }
    case GET_FOLLOWING_COUNT:
      return {
        ...state,
        followingCount: (action.payload > 0 ? action.payload : 0)
      }
    case GET_FOLLOWER_COUNT:
      return {
        ...state,
        followerCount: (action.payload > 0 ? action.payload : 0)
      }
    case GET_REVIEWS_BY_USER:
      return {
        ...state,
        reviews: action.payload
      }
    case GET_LIKES_OR_SAVES_BY_USER:
      return {
        ...state,
        reviews: action.payload
      }
    case GET_ITINERARIES_BY_USER:
      return {
        ...state,
        itineraries: action.payload
      }
    default:
      return state;
  }
};