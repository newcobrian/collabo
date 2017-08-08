import { LOADED_ALL_USERS,  UNLOADED_ALL_USERS } from '../actions';
import * as Constants from '../constants';
import * as ActionTypes from '../actions/types';
import { isEqual } from 'lodash'

const initialState = { usersData: {}, isFollowingData: {} }
export default (state = initialState, action) => {
  switch (action.type) {
    case LOADED_ALL_USERS: {
      return {
        ...state,
        users: action.payload
      }
      // const newState = Object.assign({}, state);
      // newState.users = newState.users || [];
      // newState.users = newState.users.slice();
      // if (!isEqual(newState.users, action.payload)) {
      //   newState.users = [].concat(action.payload);
      //   return newState;
      // }
      // return state;
    }
    case ActionTypes.USER_VALUE_ACTION: {
      if (action.source === Constants.EXPLORE_PAGE) {
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
    case ActionTypes.IS_FOLLOWING_ADDED: {
      const newState = Object.assign({}, state);
      newState.isFollowingData = newState.isFollowingData || {};
      newState.isFollowingData = Object.assign({}, newState.isFollowingData);

      if (!newState.isFollowingData[action.userId]) {
        newState.isFollowingData[action.userId] = true;
        return newState;
      }

      return state;
    }
    case ActionTypes.IS_FOLLOWING_REMOVED: {
      const newState = Object.assign({}, state);
      newState.isFollowingData = newState.isFollowingData || {};
      newState.isFollowingData = Object.assign({}, newState.isFollowingData);

      if (newState.isFollowingData[action.userId]) {
        newState.isFollowingData[action.userId] = false;
        return newState;
      }

      return state;
    }
    case UNLOADED_ALL_USERS:
      return initialState;
    default:
      return state;
  }
};