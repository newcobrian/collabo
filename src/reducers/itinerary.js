import * as ActionTypes from '../actions';
import * as Helpers from '../helpers';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.ITINERARY_PAGE_LOADED:
      return {
        ...state,
        itineraryId: action.itineraryId,
        itinerary: action.itinerary,
        newItin: action.itinerary,
        reviewList: action.reviewList
      }
    case ActionTypes.ITINERARY_COMMMENTS_LOADED:
      return {
        ...state,
        comments: action.comments
      }
    case ActionTypes.GOOGLE_MAP_LOADED:
      if (action.source === Constants.ITINERARY_PAGE ) {
        return {
          ...state,
          googleObject: action.googleObject,
          mapObject: action.mapObject
        }
      }
      else return {...state}
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.ITINERARY_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ActionTypes.ITINERARY_COMMMENTS_UNLOADED:
    case ActionTypes.ITINERARY_PAGE_UNLOADED:
   	  return {}
    case ActionTypes.USER_ADDED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.usersData = newState.usersData || {};
        newState.usersData = Object.assign({}, newState.usersData);
        if (!newState.usersData[action.userId]) {
          newState.usersData[action.userId] = Object.assign({}, action.userInfo);
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.USER_REMOVED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.usersData = newState.usersData || {};
        newState.usersData = Object.assign({}, newState.usersData);
        if (newState.usersData[action.userId]) {
          newState.usersData[action.userId] = undefined;
        }
        return newState;
      }
      return state;
    }
    case ActionTypes.LIKES_BY_USER_ADDED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.likesData = newState.likesData || {};
        newState.likesData = Object.assign({}, newState.likesData);
        if (!newState.likesData[action.objectId]) {
          newState.likesData[action.objectId] = true;
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.LIKES_BY_USER_REMOVED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.likesData = newState.likesData || {};
        newState.likesData = Object.assign({}, newState.likesData);
        if (newState.likesData[action.objectId]) {
          newState.likesData[action.objectId] = undefined;
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.ITINERARY_VALUE_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.itinerary = newState.itinerary || {};
        newState.itinerary = Object.assign({}, newState.itinerary);

        let iid = newState.itinerary.id;
        let isLiked = newState.likesData[iid];
        let createdBy = Object.assign({}, newState.itinerary.createdBy);
        newState.itinerary = Object.assign({}, {id: iid}, action.itinerary, {isLiked: isLiked}, {createdBy: createdBy});
        return newState;
      }
      return state;
    }
    case ActionTypes.ADDED_TO_ITINERARY:
    case ActionTypes.COVER_PHOTO_UPDATED:
    default:
      return state;
  }
};