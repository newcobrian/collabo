import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { findIndexByValue } from '../helpers';
import { filter, isEqual, find } from 'lodash';

export default (state = { usersData: {}, reviewsData: {}, tipsData: {}, subjectsData: {}, itinerary: {}, commentsData: {}, 
  userImagesData: {}, defaultImagesData: {}, likesData: {} }, action) => {
  switch (action.type) {
    // case ActionTypes.ITINERARY_PAGE_LOADED:
    //   return {
    //     ...state,
    //     itineraryId: action.itineraryId,
    //     itinerary: action.itinerary,
    //     newItin: action.itinerary,
    //     reviewList: action.reviewList
    //   }
    // case ActionTypes.ITINERARY_COMMMENTS_LOADED:
    //   return {
    //     ...state,
    //     comments: action.comments
    //   }
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
    case ActionTypes.USER_VALUE_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        // update usersData
        newState.usersData = newState.usersData || {};
        newState.usersData = Object.assign({}, newState.usersData);

        if (!isEqual(action.userInfo, newState.usersData[action.userId])) {
          newState.usersData[action.userId] = Object.assign({}, action.userInfo);
          return newState;
        }

        // newState.createdByData[action.userId] = Object.assign({}, action.userInfo);

        // update itinerary with user data if the user ID matches
        // newState.itinerary = newState.itinerary || {};
        // newState.itinerary = Object.assign({}, newState.itinerary);
        // newState.itinerary.createdBy = Object.assign({}, action.userInfo, { userId: action.userId });

      }
      return state;
    }
    case ActionTypes.USER_REMOVED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.createdByData = newState.createdByData || {};
        newState.createdByData = Object.assign({}, newState.createdByData);
        if (newState.createdByData) {
          newState.createdByData = undefined;
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
    
    // case ActionTypes.REVIEW_REMOVED_ACTION:
    // case ActionTypes.SUBJECT_REMOVED_ACTION:
    // case ActionTypes.IMAGES_BY_USER_REMOVED_ACTION:
    // case ActionTypes.DEFAULT_IMAGES_REMOVED_ACTION:
    case ActionTypes.TIP_REMOVED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.dataName] = newState[action.dataName] || {};
        newState[action.dataName] = Object.assign({}, newState[action.dataName]);
        if (newState[action.dataName][action.id]) {
          newState[action.dataName][action.id] = undefined;
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

        let isLiked = newState.likesData[action.itineraryId];
        let createdBy = newState.itinerary.createdBy;
        let itineraryObject = Object.assign({}, action.itinerary, {id: action.itineraryId});
        if (!isEqual(itineraryObject, newState.itinerary)) {
          newState.itinerary = itineraryObject;
        // newState.itinerary = Object.assign({}, action.itinerary, {isLiked: isLiked}, {createdBy: createdBy});
          newState.itineraryId = action.itineraryId;
          return newState;
        }
      }
      return state;
    }
    // case ActionTypes.SUBJECT_VALUE_ACTION: {
    //   if (action.source === Constants.ITINERARY_PAGE) {
    //     // update subjects data
    //     const newState = Object.assign({}, state);
    //     newState.subjectsData = newState.subjectsData || {};
    //     newState.subjectsData = Object.assign({}, newState.subjectsData);
    //     newState.subjectsData[action.subjectId] = Object.assign({}, action.subject);

    //     // newState.reviewsData = newState.reviewsData || {};
    //     // newState.reviewsData = Object.assign({}, newState.tipList);

    //     // newState.tipsData = newState.tipsData || [];
    //     // newState.tipsData = newState.tipsData.slice();
    //     // newState.tipsData[action.priority] = Object.assign({}, {priority: action.priority}, newState.subjectsData[action.priority], newState.reviewsData[action.priority], {images: []});
    //     return newState;
    //   }
    //   return state;
    // }
    case ActionTypes.SUBJECT_VALUE_ACTION:
    case ActionTypes.REVIEW_VALUE_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        // update reviews data
        const newState = Object.assign({}, state);
        newState[action.dataName] = newState[action.dataName] || {};
        newState[action.dataName] = Object.assign({}, newState[action.dataName]);
        // if (!action.payload) {
        //   newState[action.dataName][action.id] = undefined;
        //   return newState;
        // }
        // else {
          if (!isEqual(action.payload, newState[action.dataName][action.id])) {
            newState[action.dataName][action.id] = Object.assign({}, action.payload);
            return newState;
          }
        // }
      }
      return state;
    }
    case ActionTypes.TIP_ADDED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.tipsData = newState.tipsData || {};
        newState.tipsData = Object.assign({}, newState.tipsData);
        if (!isEqual(newState.tipsData[action.priority], action.tip)) {
          newState.tipsData[action.priority] = Object.assign({}, action.tip);
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.TIP_CHANGED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.tipsData = newState.tipsData || {};
        newState.tipsData = Object.assign({}, newState.tipsData);
        if (!isEqual(newState.tipsData[action.priority], action.tip)) {
          newState.tipsData[action.priority] = Object.assign({}, action.tip);
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.COMMENT_ADDED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.commentsData = newState.commentsData || {};
        newState.commentsData = Object.assign({}, newState.commentsData);
        newState.commentsData[action.objectId] = newState.commentsData[action.objectId] || [];
        newState.commentsData[action.objectId] = newState.commentsData[action.objectId].slice();
        if (!find(newState.commentsData[action.objectId], ['id', action.commentId])) {
          newState.commentsData[action.objectId] = newState.commentsData[action.objectId].concat(Object.assign({}, {id: action.commentId}, action.comment));
          // newState.commentsData[action.objectId].sort(Helpers.lastModofiedAsc);
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.COMMENT_REMOVED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.commentsData = newState.commentsData || {};
        newState.commentsData = Object.assign({}, newState.commentsData);
        newState.commentsData[action.objectId] = newState.commentsData[action.objectId] || [];
        newState.commentsData[action.objectId] = newState.commentsData[action.objectId].slice();
        newState.commentsData[action.objectId] = filter(newState.commentsData[action.objectId], function(o) {
          return !(action.commentId === o.id) });
        return newState;
        return state;
      }
      return state;
    }
    case ActionTypes.IMAGES_BY_USER_VALUE_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.userImagesData = newState.userImagesData || {};
        newState.userImagesData = Object.assign({}, newState.userImagesData);
        if (!isEqual(newState.userImagesData[action.subjectId], action.images)) {
          newState.userImagesData[action.subjectId] = action.images;
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.DEFAULT_IMAGES_VALUE_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.defaultImagesData = newState.defaultImagesData || {};
        newState.defaultImagesData = Object.assign({}, newState.defaultImagesData);
        if (!isEqual(newState.defaultImagesData[action.subjectId], action.images)) {
          newState.defaultImagesData[action.subjectId] = action.images;
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.UPLOAD_ERROR:
      return {
        ...state,
        error: action.error
      }
    case ActionTypes.UPLOAD_PAUSED:
    case ActionTypes.UPLOAD_RUNNING:
      return {
        ...state,
        coverPicProgress: action.progress
      }
    case ActionTypes.UPLOAD_COMPLETED:
      return state;
    default:
      return state;
  }
};