import { ITINERARY_PAGE_LOADED, ITINERARY_PAGE_UNLOADED, ITINERARY_COMMMENTS_LOADED, 
  ITINERARY_COMMMENTS_UNLOADED, ADDED_TO_ITINERARY } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case ITINERARY_PAGE_LOADED:
      return {
        ...state,
        itineraryId: action.itineraryId,
        itinerary: action.itinerary,
        reviewList: action.reviewList
      }
    case ITINERARY_COMMMENTS_LOADED:
      return {
        ...state,
        comments: action.comments
      }
    case ITINERARY_COMMMENTS_UNLOADED:
    case ITINERARY_PAGE_UNLOADED:
   	  return {}
    case ADDED_TO_ITINERARY:
    default:
      return state;
  }
};