import { GET_USER, GET_REVIEWS_BY_USER, GET_FOLLOWING_COUNT, GET_FOLLOWER_COUNT, ITINERARIES_BY_USER_UNLOADED,
  GET_ITINERARIES_BY_USER, ITINERARY_DELETED, GET_LIKES_BY_USER, UNLOAD_LIKES_BY_USER, USER_DOESNT_EXIST,
   PROFILE_USER_UNLOADED, PROFILE_FOLLOWING_UNLOADED } from '../actions';
import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import { isEqual } from 'lodash';
import * as Helpers from '../helpers';

const initialState = { usersData: {}, likesData: {}, subjectsData: {}, feedEndValue: null, isFeedLoading: false  }

export default (state = initialState, action) => {
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
    case ActionTypes.REVIEWS_BY_USER_UNLOADED:
      return initialState;
    case 'FOLLOW_USER':
    case 'UNFOLLOW_USER':
      return {
        ...action.payload.profile
      };
    case ActionTypes.GET_USER:
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
    case ActionTypes.GET_LIKES_BY_USER: {
      const newState = Object.assign({}, state);
      
      newState.guideFeed = newState.guideFeed || [];
      newState.guideFeed = newState.guideFeed.slice();

      newState.tipFeed = newState.tipFeed || [];
      newState.tipFeed = newState.tipFeed.slice();

      if (!isEqual(action.guideFeed, newState.guideFeed)) {
        newState.guideFeed = [].concat(action.guideFeed);
        return newState;
      }
      else if (!isEqual(action.tipFeed, newState.tipFeed)) {
        newState.tipFeed = [].concat(action.tipFeed);
        return newState;
      }
      return state;
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
    case ActionTypes.GET_REVIEWS_BY_USER:
      return {
        ...state,
        reviews: action.payload
      }
    case ActionTypes.ON_LIKES_TAB_CLICK:
      return {
        ...state,
        tipTabActive: action.tipTabActive
      }
    case ActionTypes.USER_DOESNT_EXIST:
      return {
        ...state,
        userNotFound: true
      }
    case ActionTypes.USER_VALUE_ACTION: {
      if (action.source === Constants.PROFILE_PAGE) {
        const newState = Object.assign({}, state);
        // update usersData
        newState.usersData = newState.usersData || {};
        newState.usersData = Object.assign({}, newState.usersData);

        if (!isEqual(action.userInfo, newState.usersData[action.userId])) {
          newState.usersData[action.userId] = Object.assign({}, action.userInfo);
        }

        // update the reviews
        newState.reviews = newState.reviews || [];
        newState.reviews = newState.reviews.slice();
        for (let i = 0; i < newState.reviews.length; i++) {
          if (newState.reviews[i].userId === action.userId) {
            newState.reviews[i].createdBy = Object.assign({}, action.userInfo);
          }
        }
        
        return newState;
      }
      return state;
    }
    // case ActionTypes.LIKES_BY_USER_ADDED_ACTION: {
    //   if (action.source === Constants.PROFILE_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.likesData = newState.likesData || {};
    //     newState.likesData = Object.assign({}, newState.likesData);
    //     if (!newState.likesData[action.objectId]) {
    //       newState.likesData[action.objectId] = true;

    //       // update reviews
    //       newState.reviews = newState.reviews || [];
    //       newState.reviews = newState.reviews.slice();

    //       for (let i = 0; i < newState.reviews.length; i++) {
    //         if (newState.reviews[i].id === action.objectId) {
    //           newState.reviews[i].isLiked = true;
    //         }
    //       }
    //       return newState;
    //     }
    //   }
    //   return state;
    // }
    // case ActionTypes.LIKES_BY_USER_REMOVED_ACTION: {
    //   if (action.source === Constants.PROFILE_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.likesData = newState.likesData || {};
    //     newState.likesData = Object.assign({}, newState.likesData);
    //     if (newState.likesData[action.objectId]) {
    //       newState.likesData[action.objectId] = undefined;

    //       // update reviews
    //       newState.reviews = newState.reviews || [];
    //       newState.reviews = newState.reviews.slice();

    //       for (let i = 0; i < newState.reviews.length; i++) {
    //         if (newState.reviews[i].id === action.objectId) {
    //           newState.reviews[i].isLiked = false;
    //         }
    //       }
    //       return newState;
    //     }
    //   }
    //   return state;
    // }
    // case ActionTypes.REVIEW_ADDED_ACTION: {
    //   if (action.source === Constants.PROFILE_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.reviews = newState.reviews || [];
    //     newState.reviews = newState.reviews.slice();

    //     if (!find(newState.reviews, ['id', action.reviewId])) {
    //       let createdBy = { createdBy: Object.assign({}, newState.usersData[action.userId]) };
    //       // let comments = { comments: newState.commentsData[action.tipId] ? [].concat(newState.commentsData[action.tipId]) : [] };
    //       let isLiked = { isLiked: newState.likesData[action.reviewId] ? true : false };
    //       // let images = getImage(newState.userImagesData[action.tip.subjectId], newState.defaultImagesData[action.tip.subjectId]);
    //       let subject = { subject: Object.assign({}, action.subject) }

    //       newState.reviews = newState.reviews.concat(Object.assign({}, {id: action.reviewId}, isLiked, action.review, createdBy, subject));

    //       newState.reviews.sort(Helpers.lastModifiedDesc);
    //       return newState;
    //     }
    //   }
    //   return state;
    // }
    // case ActionTypes.REVIEW_CHANGED_ACTION: {
    //   if (action.source === Constants.PROFILE_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.reviews = newState.reviews || [];
    //     newState.reviews = newState.reviews.slice();

    //     for (let i = 0; i < newState.reviews.length; i++) {
    //       if (newState.reviews[i].id === action.reviewId) {
    //         let createdBy = { createdBy: Object.assign({}, newState.usersData[action.userId]) };
    //         let isLiked = { isLiked: newState.likesData[action.reviewId] ? true : false };
    //         let subject = { subject: Object.assign({}, newState.reviews[i].subject) }
    //         // let images = getImage(newState.userImagesData[action.tip.subjectId], newState.defaultImagesData[action.tip.subjectId]);
    //         // let comments = { comments: newState.commentsData[action.tipId] ? [].concat(newState.commentsData[action.tipId]) : [] };

    //         newState.reviews[i] = Object.assign({}, {id: action.reviewId}, isLiked, action.review, createdBy, subject);

    //         newState.reviews.sort(Helpers.lastModifiedDesc);

    //         return newState;
    //       }
    //     }
    //   }
    //   return state;
    // }
    // case ActionTypes.REVIEW_REMOVED_ACTION: {
    //   if (action.source === Constants.ITINERARY_PAGE) {
    //     const newState = Object.assign({}, state);
    //     newState.reviews = newState.reviews || [];
    //     newState.reviews = newState.reviews.slice();
    //     // find the review and remove it
    //     for (let i = 0; i < newState.reviews.length; i++) {
    //       if (newState.reviews[i].key === action.reviewId) {
    //         newState.reviews.splice(i, 1);
    //         return newState;    
    //       }
    //     }
    //   }
    //   return state;
    // }
    case ActionTypes.ACTIVITY_ADDED_ACTION: {
      if (action.source === Constants.PROFILE_PAGE) {
        const newState = Object.assign({}, state);
        newState.feed = newState.feed || [];
        newState.feed = newState.feed.slice();
        newState.usersData = newState.usersData || {};
        if (!find(newState.feed, ['activityId', action.activityId])) {
          let createdBy = { createdBy: Object.assign({}, action.user) };
          newState.feed = newState.feed.concat(Object.assign({}, {activityId: action.activityId}, action.activity, createdBy));
          newState.feed.sort(Helpers.lastModifiedDesc);

          newState.emptyThreadFeed = false;

          return newState;
        }
        return state;
      }
      return state;
    }
    case ActionTypes.ACTIVITY_CHANGED_ACTION: {
      if (action.source === Constants.PROFILE_PAGE) {
        const newState = Object.assign({}, state);
        newState.feed = newState.feed || [];
        newState.feed = newState.feed.slice();
        let createdBy = { createdBy: Object.assign({}, action.user) };
        
        for (let i = 0; i < newState.feed.length; i++) {
          if (newState.feed[i].activityId === action.activityId) {
            newState.feed[i] = Object.assign({}, {activityId: action.activityId}, action.activity, createdBy);
            newState.feed.sort(Helpers.lastModifiedDesc);
            // return newState;
            newState.emptyThreadFeed = false;
          }
        }
        return newState;
      }
      return state;
    }
    case ActionTypes.ACTIVITY_REMOVED_ACTION: {
      if (action.source === Constants.PROFILE_PAGE) {
        const newState = Object.assign({}, state);
        newState.feed = newState.feed || [];
        newState.feed = newState.feed.slice();
        // find the review and remove it
        for (let i = 0; i < newState.feed.length; i++) {
          if (newState.reviews[i].activityId === action.activityId) {
            newState.reviews.splice(i, 1);
            return newState;    
          }
        }
      }
      return state;
    }
    case ActionTypes.EMPTY_ACTIVITY_FEED:
      if (action.source === Constants.PROFILE_PAGE) {
        return {
          ...state,
          emptyActivityFeed: true
        }
      }
      return state;
    case ActionTypes.UNWATCH_ACTIVITY_FEED:
      return {
        ...state,
        feed: null,
        emptyActivityFeed: false
      }
    case ActionTypes.NOT_AN_ORG_USER:
      return {
        ...state,
        invalidOrgUser: true
      }
    case ActionTypes.UPDATE_END_VALUE:
      if (action.source == Constants.PROFILE_PAGE) {
        if (action.endValue < state.feedEndValue) {
          return {
            ...state,
            feedEndValue: action.endValue
          }
        }
        else return state;
      }
    case ActionTypes.SET_IS_FEED_LOADING:
      if (action.source == Constants.PROFILE_PAGE) {
        return {
          ...state,
          isFeedLoading: action.isFeedLoading
        }
      }
    case ActionTypes.LOAD_ORG: {
      if (action.source === Constants.PROFILE_PAGE) {
        return {
          ...state,
          orgId: action.orgId,
          invalidOrgUser: false
        }
      }
    }
    default:
      return state;
  }
};