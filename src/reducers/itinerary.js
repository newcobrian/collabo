import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { findIndexByValue } from '../helpers';
import { filter, isEqual, find, omit, countBy } from 'lodash';

const initialState = { usersData: {}, reviewsData: {}, subjectsData: {}, itinerary: {}, commentsData: {}, 
  userImagesData: {}, defaultImagesData: {}, likesData: {}, tips: [], formErrors: { title: false, geo: false },
  visibleTags: {}, showAllFilters: true, showShareGuide: false };

const getImage = (userImages, defaultImages) => {
  let defaultImage = defaultImages ? defaultImages : [];
  let images = { images: (userImages ? userImages : defaultImage) };
  return images;
}

export default (state = initialState, action) => {
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
   	  return initialState;
    case ActionTypes.USER_VALUE_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        // update usersData
        newState.usersData = newState.usersData || {};
        newState.usersData = Object.assign({}, newState.usersData);

        if (!isEqual(action.userInfo, newState.usersData[action.userId])) {
          newState.usersData[action.userId] = Object.assign({}, action.userInfo);
          // return newState;
        }

        // update itinerary with user data if the user ID matches
        newState.itinerary = newState.itinerary || {};
        newState.itinerary = Object.assign({}, newState.itinerary);
        if (newState.itinerary.userId === action.userId) {
          newState.itinerary.createdBy = Object.assign({}, action.userInfo, { userId: action.userId });  
        }

        // update any tip creators
        newState.tips = newState.tips || [];
        newState.tips = newState.tips.slice();
        for (let i = 0; i < newState.tips.length; i++) {
          if (newState.tips[i].userId === action.userId) {
            newState.tips[i].createdBy = Object.assign({}, action.userInfo);
          }
        }
        
        return newState;
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


        // !!!!!!!!! didnt finish
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

          newState.itinerary = newState.itinerary || {};
          newState.itinerary = Object.assign({}, newState.itinerary);

          // like itinerary if ID matches
          if (newState.itineraryId === action.objectId) {
            newState.itinerary.isLiked = true;
          }

          newState.tips = newState.tips || [];
          newState.tips = newState.tips.slice();

          // like any tips if ID matches
          for (let i = 0; i < newState.tips.length; i++) {
            if (newState.tips[i].key === action.objectId) {
              newState.tips[i].isLiked = true;
            }
          }
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

          newState.itinerary = newState.itinerary || {};
          newState.itinerary = Object.assign({}, newState.itinerary);

          // like itinerary if ID matches
          if (newState.itineraryId === action.objectId) {
            newState.itinerary.isLiked = false;
          }

          newState.tips = newState.tips || [];
          newState.tips = newState.tips.slice();
          // like any tips if ID matches
          for (let i = 0; i < newState.tips.length; i++) {
            if (newState.tips[i].key === action.objectId) {
              newState.tips[i].isLiked = false;
            }
          }
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
        newState.tips = newState.tips || [];
        newState.tips = newState.tips.slice();
        // find the tip and remove it
        for (let i = 0; i < newState.tips.length; i++) {
          if (newState.tips[i].key === action.tipId) {
            newState.tips.splice(i, 1);
            return newState;    
          }
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
        let createdBy = newState.itinerary.createdBy ? Object.assign({}, newState.itinerary.createdBy) : Object.assign({}, newState.usersData[action.itinerary.userId]);
        // let comments = newState.itinerary.comments ? [].concat(newState.itinerary.comments) : (newState.usersData[action.itinerary.userId] ? [].concat(newState.usersData[action.itinerary.userId]) : []);
        if (!isEqual(action.itinerary, omit(newState.itinerary, ['isLiked', 'createdBy', 'id']))) {
          newState.itinerary = Object.assign({}, action.itinerary, { id: action.itineraryId }, {isLiked: isLiked}, {createdBy: createdBy});
          // newState.itinerary = Object.assign({}, action.itinerary, {isLiked: isLiked}, {createdBy: createdBy});
          newState.itineraryId = action.itineraryId;
          newState.itineraryNotFound = false
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
    case ActionTypes.SUBJECT_VALUE_ACTION: {
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

            newState.tips = newState.tips || [];
            newState.tips = newState.tips.slice();
            // like any tips if ID matches
            for (let i = 0; i < newState.tips.length; i++) {
              if (newState.tips[i].subjectId === action.id) {
                newState.tips[i].subject = Object.assign({}, action.payload);
              }
            }
            return newState;
          }
        // }
      }
      return state;
    }
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

            newState.tips = newState.tips || [];
            newState.tips = newState.tips.slice();
            // like any tips if ID matches
            for (let i = 0; i < newState.tips.length; i++) {
              if (newState.tips[i].reviewId === action.id) {
                newState.tips[i].review = Object.assign({}, action.payload);
              }
            }

            return newState;
          }
        // }
      }
      return state;
    }
    case ActionTypes.TIP_ADDED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.tips = newState.tips || [];
        newState.tips = newState.tips.slice();
        if (!find(newState.tips, ['key', action.tipId])) {
          let subject = { subject: Object.assign({}, newState.subjectsData[action.tip.subjectId]) };
          let review = { review: Object.assign({}, newState.reviewsData[action.tip.reviewId]) };
          let createdBy = { createdBy: Object.assign({}, newState.usersData[action.tip.userId]) };
          let comments = { comments: newState.commentsData[action.tipId] ? [].concat(newState.commentsData[action.tipId]) : [] };
          let isLiked = { isLiked: newState.likesData[action.tipId] ? true : false };
          let images = getImage(newState.userImagesData[action.tip.subjectId], newState.defaultImagesData[action.tip.subjectId]);
          // newState.tips[action.priority] = Object.assign({}, {key: action.priority}, {priority: action.priority}, action.tip, subject, review, createdBy, comments, isLiked, images);
          newState.tips = newState.tips.concat(Object.assign({}, {key: action.tipId}, {priority: action.priority}, action.tip, subject, review, createdBy, comments, isLiked, images));
          // newState.tips.sort(Helpers.byPriority);

          // newState.tagsFilter = newState.tagsFilter || {};
          // newState.tagsFilter = Object.assign({}, newState.tagsFilter);
          // newState.tagsFilter = countBy(Object.keys(action.tip.tags || {}));
          // console.log('tags Filter = ' + JSON.stringify(newState.tagsFilter))

          return newState;
        }
      }
      return state;
    }
    case ActionTypes.TIP_CHANGED_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.tips = newState.tips || [];
        newState.tips = newState.tips.slice();
        let subject = { subject: Object.assign({}, newState.subjectsData[action.tip.subjectId]) };
        let review = { review: Object.assign({}, newState.reviewsData[action.tip.reviewId]) };
        let createdBy = { createdBy: Object.assign({}, newState.usersData[action.tip.userId]) };
        let comments = { comments: newState.commentsData[action.tipId] ? [].concat(newState.commentsData[action.tipId]) : [] };
        let isLiked = { isLiked: newState.likesData[action.tipId] ? true : false };
        let images = getImage(newState.userImagesData[action.tip.subjectId], newState.defaultImagesData[action.tip.subjectId]);
        for (let i = 0; i < newState.tips.length; i++) {
          if (newState.tips[i].key === action.tipId) {
            newState.tips[i] = Object.assign({}, {key: action.tipId}, {priority: action.priority}, action.tip, subject, review, createdBy, comments, isLiked, images);
            newState.tips.sort(Helpers.byPriority);
            return newState;
          }
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

          // update itinerary comments if ID matches
          if (newState.itineraryId === action.objectId) {
            newState.itinerary = newState.itinerary || {};
            newState.itinerary = Object.assign({}, newState.itinerary);
            newState.itinerary.comments = [].concat(newState.commentsData[action.objectId]);
          }

          // update any tip comments that match
          newState.tips = newState.tips || [];
          newState.tips = newState.tips.slice();
          for (let i = 0; i < newState.tips.length; i++) {
            if (newState.tips[i].key === action.objectId) {
              newState.tips[i].comments = [].concat(newState.commentsData[action.objectId]);
            }
          }

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

        // update itinerary comments if ID matches
        if (newState.itineraryId === action.objectId) {
          newState.itinerary = newState.itinerary || {};
          newState.itinerary = Object.assign({}, newState.itinerary);
          newState.itinerary.comments = [].concat(newState.commentsData[action.objectId]);
        }

        // update any tip comments that match
        newState.tips = newState.tips || [];
        newState.tips = newState.tips.slice();
        for (let i = 0; i < newState.tips.length; i++) {
          if (newState.tips[i].key === action.objectId) {
            newState.tips[i].comments = [].concat(newState.commentsData[action.objectId]);
          }
        }

        return newState;
      }
      return state;
    }
    case ActionTypes.IMAGES_BY_USER_VALUE_ACTION: {
      if (action.source === Constants.ITINERARY_PAGE) {
        const newState = Object.assign({}, state);
        newState.userImagesData = newState.userImagesData || {};
        newState.userImagesData = Object.assign({}, newState.userImagesData);
        if (!isEqual(newState.userImagesData[action.subjectId], action.images)) {
          newState.userImagesData[action.subjectId] = [].concat(action.images);

          // update any tips with user images
          newState.tips = newState.tips || [];
          newState.tips = newState.tips.slice();
          for (let i = 0; i < newState.tips.length; i++) {
            if (newState.tips[i].subjectId === action.subjectId) {
              newState.tips[i].images = [].concat(action.images);
            }
          }
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
          newState.defaultImagesData[action.subjectId] = [].concat(action.images);

          // update any tips with user images
          newState.tips = newState.tips || [];
          newState.tips = newState.tips.slice();
          for (let i = 0; i < newState.tips.length; i++) {
            // if subject ID matches and theres no custom image, update with default image
            if (newState.tips[i].subjectId === action.subjectId && !newState.userImagesData[action.subjectId]) {
              newState.tips[i].images = [].concat(action.images);
            }
          }
          return newState;
        }
      }
      return state;
    }
    case ActionTypes.UPDATE_ITINERARY_FORM:
      return {
        ...state,
        [action.key]: action.value
      }
    case ActionTypes.UPDATE_ITINERARY_FORM_ERRORS: {
      const newState = Object.assign({}, state);
      newState.formErrors = newState.formErrors || { title: false, geo: false};
      newState.formErrors = Object.assign({}, newState.formErrors);
      newState.formErrors[action.field] = action.value;
      return newState;
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
    case ActionTypes.TIP_IMAGE_UPLOAD_RUNNING:
    case ActionTypes.TIP_IMAGE_UPLOAD_PAUSED:
      return {
        ...state,
        subjectId: action.subjectId,
        tipImageProgress: action.progress
      }
    case ActionTypes.UPLOAD_COMPLETED:
    case ActionTypes.TIP_DELETED:
    case ActionTypes.TIP_IMAGE_UPLOAD_COMPLETED:
      return state;
    case ActionTypes.ITINERARY_NOT_FOUND:
      return {
        ...state,
        itineraryNotFound: true
      }
    case ActionTypes.LOAD_RELATED_ITINERARIES:
      return {
        ...state,
        relatedItineraries: action.relatedItineraries,
        numRelated: action.numRelated
      }
    case ActionTypes.UNLOAD_RELATED_ITINERARIES:
      return {
        ...state,
        relatedItineraries: [],
        numRelated: 0
      }
    case ActionTypes.SELECT_ACTIVE_TIP:
      return {
        ...state,
        showingActiveInfoWindow: true,
        activeTipPosition: action.activeTipPosition,
        activeTipTitle: action.activeTipTitle,
        activeTipSubjectId: action.activeTipSubjectId,
        selectedMarker: action.selectedMarker
      }
    case ActionTypes.TOGGLE_MAP_VIEW:
      return {
        ...state,
        mapViewToggle: !state.mapViewToggle
      }
    // case ActionTypes.TOGGLE_ITINERARY_FILTER: {
    //   const newState = Object.assign({}, state);
    //   newState.appliedFilters = newState.appliedFilters || {};
    //   newState.appliedFilters = Object.assign({}, newState.appliedFilters);
    //   newState.appliedFilters[action.tag] = !newState.appliedFilters[action.tag]
    //   // if (!newState.appledFilters[action.tag]) {
    //   //   newState.showAllTags = false;
    //   // }

    //   return newState;
    //   }
    case ActionTypes.SET_ITINERARY_FILTERS:
      return {
        ...state,
        visibleTags: action.visibleTags,
        showAllFilters: action.showAllFilters
      }
    case ActionTypes.GET_ITINERARY_FOLLOW:
      return {
        ...state,
        isFollowingItinerary: action.isFollowingItinerary,
        numGuideFollows: action.numGuideFollows
      }
    case ActionTypes.UNMOUNT_ITINERARY_FOLLOW:
      return {
        ...state,
        isFollowingItinerary: null
      }
    case ActionTypes.SHOW_SHARE_GUIDE_TOOLTIP:
      return {
        ...state,
        showShareGuide: true
      }
    case ActionTypes.CLOSE_SHARE_GUIDE_TOOLTIP:
      return {
        ...state,
        closeShareGuide: false
      }
    default:
      return state;
  }
};