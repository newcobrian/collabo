import { GET_PLACES_FEED, UNLOAD_PLACES_FEED, LOAD_PLACES } from '../actions'
import * as ActionTypes from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_PLACES_FEED:
      return {
        ...state,
        feed: action.payload
      }
    case UNLOAD_PLACES_FEED:
      return {}
    case LOAD_PLACES:
      return {
        ...state,
        geo: action.geo
      }
    case ActionTypes.PLACE_NOT_FOUND_ERROR:
      return {
        ...state,
        placeNotFoundError: true
      }
    default:
      return state;
  }
};