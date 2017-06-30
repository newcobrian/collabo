import { GET_PLACES_FEED, UNLOAD_PLACES_FEED, LOAD_PLACES } from '../actions'

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
    default:
      return state;
  }
};