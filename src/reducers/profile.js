import { GET_USER, GET_REVIEWS_BY_USER, GET_FOLLOWING_COUNT, GET_FOLLOWER_COUNT, ITINERARIES_BY_USER_UNLOADED,
  GET_ITINERARIES_BY_USER, ITINERARY_DELETED, GET_LIKES_BY_USER, UNLOAD_LIKES_BY_USER, USER_DOESNT_EXIST,
   PROFILE_USER_UNLOADED, PROFILE_FOLLOWING_UNLOADED } from '../actions';
import * as ActionTypes from '../actions/types';
import { isEqual } from 'lodash';

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
    case UNLOAD_LIKES_BY_USER:
    case ITINERARIES_BY_USER_UNLOADED:
    case PROFILE_USER_UNLOADED:
    case PROFILE_FOLLOWING_UNLOADED:
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
    case USER_DOESNT_EXIST:
      return {
        profile: []
      }
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
    case ActionTypes.GET_PROFILE_COUNTS:
      return {
        ...state,
        numFollowers: action.numFollowers,
        numFollowing: action.numFollowing,
        numGuides: action.numGuides,
        numLikes: action.numLikes
      }
    case GET_REVIEWS_BY_USER:
      return {
        ...state,
        reviews: action.payload
      }
    case GET_LIKES_BY_USER:
      return {
        ...state,
        feed: action.payload
      }
    case ActionTypes.GET_GUIDE_LIKES_BY_USER: {
      const newState = Object.assign({}, state);
      
      newState.guideFeed = newState.guideFeed || [];
      newState.guideFeed = newState.guideFeed.slice();

      if (!isEqual(action.guideFeed, newState.guideFeed)) {
        newState.guideFeed = [].concat(action.guideFeed);
        return newState;
      }
      return state;
    }
    case ActionTypes.GET_TIP_LIKES_BY_USER:
      return {
        ...state,
        tipFeed: action.tipFeed
      }
    case ITINERARY_DELETED:
      return {
        ...state
      }
    case GET_ITINERARIES_BY_USER:
      return {
        ...state,
        itineraries: action.payload
      }
    case ActionTypes.ON_LIKES_TAB_CLICK:
      return {
        ...state,
        tipTabActive: action.tipTabActive
      }
    default:
      return state;
  }
};