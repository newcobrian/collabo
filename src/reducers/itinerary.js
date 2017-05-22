import { ITINERARY_PAGE_LOADED } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case ITINERARY_PAGE_LOADED:
      return {
        ...state,
        itinerary: action.itinerary
      }
    default:
      return state;
  }
};