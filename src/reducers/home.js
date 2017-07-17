import { GET_USER_FEED, USER_FEED_UNLOADED, GET_GLOBAL_FEED, GLOBAL_FEED_UNLOADED, APPLY_TAG,
GET_LIKES_OR_SAVES_BY_USER, ITINERARY_DELETED, FOLLOWER_ADDED_ACTION,
USER_ADDED_ACTION, USER_REMOVED_ACTION, LIKES_BY_USER_ADDED_ACTION, LIKES_BY_USER_REMOVED_ACTION,
FOLLOWER_REMOVED_ACTION, ITINERARY_ADDED_ACTION, ITINERARY_REMOVED_ACTION,
ITINERARY_CHANGED_ACTION, ITINERARIES_BY_USER_REMOVED_ACTION } from '../actions';
import { createItineraryObject, findItineraryIndex } from '../helpers';
import { filter } from 'lodash';

const lastModifiedDesc = (a, b) => {
  return b.lastModified - a.lastModified;
}

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
    case GET_GLOBAL_FEED:
      return {
        ...state,
        itineraries: action.payload
      };
    case GET_LIKES_OR_SAVES_BY_USER:
      return {
        ...state,
        feed: action.payload
      }
    case ITINERARY_DELETED:
      return {...state}
    case APPLY_TAG:
      return {
        ...state,
        tag: action.payload
      }
    case USER_FEED_UNLOADED:
    case GLOBAL_FEED_UNLOADED:
      return {};
    // case FOLLOWER_ADDED_ACTION: {
    //   // get new follower itinerary array, concat to current state array, then sort and return
    //   const newState = Object.assign({}, state);
    //   newState.itineraries = newState.itineraries || [];
    //   newState.itineraries = newState.itineraries.slice();

    //   // get user and likes data
    //   let newItineraries = Object.assign({}, action.addItineraries);
    //   for (let i = 0; i < newItineraries.length; i++) {
    //     newItineraries[i].likes = 
    //     newItineraries[i].createdBy = 
    //   }


    //   newState.itineraries = newItineraries.concat(newState.itineraries);
    //   newState.itineraries.sort(lastModifiedDesc);

    //   return newState;
    // }
    // case FOLLOWER_REMOVED_ACTION: {
    //   const newState = Object.assign({}, state);
    //   newState.itineraries = newState.itineraries || [];
    //   newState.itineraries = newState.itineraries.slice();
    //   newState.itineraries = filter(newState.itineraries, function(itin) {
    //     return action.removeIds.indexOf(itin.id) === -1;
    //   })
    //   newState.itineraries.sort(lastModifiedDesc);
    //   return newState;
    // }
    case USER_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.usersData = newState.usersData || {};
      newState.usersData = Object.assign({}, newState.usersData);
      if (!newState.usersData[action.userId]) {
        newState.usersData[action.userId] = Object.assign({}, action.userInfo);

        // now update any itineraries with the user
        // newState.itineraries = newState.itineraries || [];
        // newState.itineraries = newState.itineraries.slice();
        // for (let i = 0; i < newState.itineraries.length; i++) {
        //   if (newState.itineraries[i].createdBy && newState.itineraries[i].createdBy.userId === action.userId) {
        //     newState.itineraries[i].createdBy = Object.assign({}, action.userInfo, {userId: action.userId});
        //   }
        // }
        return newState;
      }
    }
    case USER_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.usersData = newState.usersData || {};
      newState.usersData = Object.assign({}, newState.usersData);
      if (newState.usersData[action.userId]) {
        newState.usersData[action.userId] = undefined;
      }
      return newState;
    }
    case LIKES_BY_USER_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.likesData = newState.likesData || {};
      newState.likesData = Object.assign({}, newState.likesData);
      if (!newState.likesData[action.objectId]) {
        newState.likesData[action.objectId] = true;

        // now update that itinerary
        // newState.itineraries = newState.itineraries || [];
        // newState.itineraries = newState.itineraries.slice();
        // let index = findItineraryIndex(newState.itineraries, action.objectId);
        // if (index > -1) {
        //   console.log('iid = ' + action.objectId)
        //   newState.itineraries[index].likes = true;
        // }
        return newState;
      }
      else return state;
    }
    case LIKES_BY_USER_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.likesData = newState.likesData || {};
      newState.likesData = Object.assign({}, newState.likesData);
      if (newState.likesData[action.objectId]) {
        newState.likesData[action.objectId] = undefined;

        // update itinerary
        // newState.itineraries = newState.itineraries || [];
        // newState.itineraries = newState.itineraries.slice();
        // let index = findItineraryIndex(newState.itineraries, action.objectId);
        // if (index > -1) {
        //   console.log('iid = ' + action.objectId)
        //   newState.itineraries[index].likes = false;
        // }
        return newState;
      }
      else return state;
    }
    case ITINERARY_ADDED_ACTION: {
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries || [];
      newState.itineraries = newState.itineraries.slice();
      newState.usersData = newState.usersData || {};
      newState.likesData = newState.likesData || {};
      let itineraryObject = 
      createItineraryObject(action.itineraryId, action.itinerary, action.userId, Object.assign({}, 
        newState.usersData[action.userId]), Object.assign({}, newState.likesData));
      newState.itineraries.push(itineraryObject);
      newState.itineraries.sort(lastModifiedDesc);
      return newState;
    }
    case ITINERARY_CHANGED_ACTION: {
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries || [];
      newState.itineraries = newState.itineraries.slice();

      // if itinerary is in the feed, update it with new itinerary data
      let index = findItineraryIndex(newState.itineraries, action.itineraryId);
      if (index > -1) {
        let iid = newState.itineraries[index].id;
        let isLiked = newState.likesData[iid];
        let createdBy = Object.assign({}, newState.itineraries[index].createdBy);
        newState.itineraries[index] = Object.assign({}, {id: iid}, action.itinerary, {isLiked: isLiked}, {createdBy: createdBy});
        return newState;
      }
      else return state;
    }
    case ITINERARY_REMOVED_ACTION: {
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries || [];
      newState.itineraries = newState.itineraries.slice();
      newState.itineraries = filter(newState.itineraries, ['id', !action.itineraryId]);
      return newState;
    }
    case ITINERARIES_BY_USER_REMOVED_ACTION: {
      // remove all itineraries that were created by action.userId
      const newState = Object.assign({}, state);
      newState.itineraries = newState.itineraries || [];
      newState.itineraries = newState.itineraries.slice();
      newState.itineraries = filter(newState.itineraries, function(o) {
          return !(action.userId === o.createdBy.userId) });
      return newState;
    }
    default:
      return state;
  }
};