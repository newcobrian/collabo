import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.GOOGLE_MAP_LOADED:
      if (action.source === Constants.FIREBASE_SEARCH_INPUT ) {
        return {
          ...state,
          googleObject: action.googleObject,
          mapObject: action.mapObject
        }
      }
      else return {...state}
    default:
      return state;
  }
};