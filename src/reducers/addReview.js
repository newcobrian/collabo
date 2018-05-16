import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_SUBMIT_ERROR:
      if (action.source === Constants.ADD_REVIEW_PAGE) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
    case ActionTypes.GOOGLE_MAP_LOADED:
      if (action.source === Constants.ADD_REVIEW_PAGE) {
        return {
          ...state,
          googleObject: action.googleObject,
          mapObject: action.mapObject
        }
      }
      else return {...state}
    case ActionTypes.SET_IN_PROGRESS:
      return {
        ...state,
        inProgress: true
      }
    case ActionTypes.GET_USER_LOCATION:
      return {
        ...state,
        latitude: action.latitude,
        longitude: action.longitude
      }
    case ActionTypes.SET_WATCH_ID:
      return {
        ...state,
        watchId: action.payload
      }
  	case ActionTypes.REVIEW_SUBMITTED:
      return {
        ...state,
        inProgress: null,
      };
  	case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.ADD_REVIEW_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    default:
      return state;
  }
};