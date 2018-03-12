import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';

export default (state = {}, action) => {
  switch (action.type) {
    case ActionTypes.GOOGLE_MAP_LOADED:
      if (action.source === Constants.UNIVERSAL_SEARCH_BAR ) {
        return {
          ...state,
          googleObject: action.googleObject,
          mapObject: action.mapObject
        }
      }
      else return {...state}
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.UNIVERSAL_SEARCH_BAR) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    // case ActionTypes.UNIVERSAL_GEO_SEARCH:
    //   return {}
    default:
      return state;
  }
};