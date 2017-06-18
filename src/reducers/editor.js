import { REVIEW_SUBMITTED, UPDATE_FIELD, EDITOR_PAGE_LOADED, EDITOR_PAGE_UNLOADED, 
  EDITOR_SUBMIT_ERROR, SET_IN_PROGRESS, SET_WATCH_ID, GET_USER_LOCATION } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case EDITOR_PAGE_LOADED:
      return {
        ...state,
        itineraryId: action.itineraryId,
        searchLocation: action.searchLocation,
        data: action.data
      }
    case EDITOR_PAGE_UNLOADED:
      return {};
    case EDITOR_SUBMIT_ERROR:
      return {
        ...state,
        errors: [action.error]
      }
    case REVIEW_SUBMITTED:
      return {
        ...state,
        inProgress: null,
        // errors: action.error ? action.payload.errors : null
      };
    case SET_IN_PROGRESS:
      return {
        ...state,
        inProgress: true
      }
    case SET_WATCH_ID:
      return {
        ...state,
        watchId: action.payload
      }
    case GET_USER_LOCATION:
      return {
        ...state,
        latitude: action.latitude,
        longitude: action.longitude
      }
    case 'ASYNC_START':
      if (action.subtype === 'ARTICLE_SUBMITTED') {
        return { ...state, inProgress: true };
      }
      break;
    case 'ADD_TAG':
      return {
        ...state,
        tagList: state.tagList.concat([state.tagInput]),
        tagInput: ''
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        tagList: state.tagList.filter(tag => tag !== action.tag)
      };
    case UPDATE_FIELD:
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
};

export const load = data => ({type: EDITOR_PAGE_LOADED, data})