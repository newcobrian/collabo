import { ITINERARY_PAGE_LOADED, ITINERARY_PAGE_UNLOADED, ITINERARY_COMMMENTS_LOADED, 
  ITINERARY_COMMMENTS_UNLOADED, ADDED_TO_ITINERARY, COVER_PHOTO_UPDATED, ITINERARY_PAGE, 
  UPDATE_FIELD_CREATE, GOOGLE_MAP_LOADED } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case ITINERARY_PAGE_LOADED:
      return {
        ...state,
        itineraryId: action.itineraryId,
        itinerary: action.itinerary,
        newItin: action.itinerary,
        reviewList: action.reviewList
      }
    case ITINERARY_COMMMENTS_LOADED:
      return {
        ...state,
        comments: action.comments
      }
    case GOOGLE_MAP_LOADED:
      if (action.source === ITINERARY_PAGE ) {
        return {
          ...state,
          googleObject: action.googleObject,
          mapObject: action.mapObject
        }
      }
      else return {...state}
    case UPDATE_FIELD_CREATE:
      if(action.source === ITINERARY_PAGE) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ITINERARY_COMMMENTS_UNLOADED:
    case ITINERARY_PAGE_UNLOADED:
   	  return {}
    case ADDED_TO_ITINERARY:
    case COVER_PHOTO_UPDATED:
    default:
      return state;
  }
};