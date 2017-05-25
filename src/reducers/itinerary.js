import { ITINERARY_PAGE_LOADED, ITINERARY_PAGE_UNLOADED } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case ITINERARY_PAGE_LOADED:
      return {
        ...state,
        itineraryId: action.itineraryId,
        itinerary: action.itinerary,
        reviewList: action.reviewList
      }
    case ITINERARY_PAGE_UNLOADED:
   	  return {}
    default:
      return state;
  }
};