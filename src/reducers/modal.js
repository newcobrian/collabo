import { SHOW_MODAL, HIDE_MODAL, NEW_ITINERARY_MODAL, FRIEND_SELECTOR_SUBMIT, REVIEW_SUBMITTED, 
  FORWARD_MODAL, SAVE_MODAL, ADDED_TO_ITINERARY, SUBJECT_DUPLICATE, SHOW_NEW_ITINERARY_MODAL, 
  UPDATE_FIELD_CREATE, CREATE_SUBMIT_ERROR, SHOW_DELETE_ITINERARY_MODAL, DELETE_ITINERARY_MODAL,
  ITINERARY_DELETED, GOOGLE_MAP_LOADED } from '../actions'
import * as ActionTypes from '../actions/types'
import * as Constants from '../constants'

const initialState = {
  modalType: null,
  modalProps: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
  	case SHOW_MODAL:
  		return {
        ...state,
  			modalType: action.modalType,
  			review: action.review,
        images: action.images,
        itinerariesList: action.itinerariesList
  		}
    case SHOW_DELETE_ITINERARY_MODAL:
      return {
        ...state,
        modalType: DELETE_ITINERARY_MODAL,
        itinerary: action.itinerary,
        source: action.source
      }
    case ActionTypes.SHOW_DELETE_MODAL:
      return {
        ...state,
        modalType: action.modalType,
        threadId: action.threadId,
        orgName: action.orgName,
        thread: action.thread,
        source: action.source
      }
    case SHOW_NEW_ITINERARY_MODAL:
      return {
        ...state,
        modalType: NEW_ITINERARY_MODAL,
        auth: action.auth,
        review: action.review
      }
    case ActionTypes.SHOW_REORDER_ITINERARY_MODAL: 
      return {
        ...state,
        modalType: Constants.REORDER_ITINERARY_MODAL,
        itinerary: action.itinerary
      }
    case ActionTypes.SHOW_FILTER_MODAL: 
      return {
        ...state,
        modalType: Constants.FILTER_MODAL,
        itinerary: action.itinerary
      }
    case ActionTypes.SHOW_SHARE_MODAL:
      return {
        ...state,
        modalType: Constants.SHARE_MODAL,
        itinerary: action.itinerary
      }
    case ActionTypes.SHOW_CHANGE_EMAIL_MODAL:
      return {
        ...state,
        modalType: Constants.CHANGE_EMAIL_MODAL
      }
    case ActionTypes.SHOW_CREATE_RECS_MODAL:
      return {
        ...state,
        modalType: Constants.CREATE_RECS_MODAL
      }
    case CREATE_SUBMIT_ERROR:
      if (action.source === Constants.CREATE_RECS_MODAL || action.source === Constants.NEW_ITINERARY_MODAL) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.CREATE_RECS_MODAL || action.source === Constants.NEW_ITINERARY_MODAL) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ActionTypes.GOOGLE_MAP_LOADED:
      if (action.source === Constants.CREATE_RECS_MODAL || action.source === Constants.NEW_ITINERARY_MODAL) {
        return {
          ...state,
          googleObject: action.googleObject,
          mapObject: action.mapObject
        }
      }
      else return {...state}
    case ActionTypes.EMAIL_UPDATE_ERROR:
      return {
        ...state,
        errors: [action.error]
      }
    case ActionTypes.RECOMMENDATION_ITINERARY_CREATED:
      return {
        ...state,
        modalType: Constants.SEND_RECS_MODAL,
        itinerary: action.itinerary,
        itineraryId: action.itineraryId
      }
    case ActionTypes.ASK_FOR_ITINERARY_RECS:
      return {
        ...state,
        modalType: Constants.SEND_RECS_MODAL,
        itinerary: action.itinerary,
        itineraryId: action.itineraryId
      }
    case ActionTypes.LOAD_REORDER_MODAL: {
      const newState = Object.assign({}, state);
      newState.itinerary = newState.itinerary || {};
      newState.itinerary = Object.assign({}, newState.itinerary);
      if (newState.itinerary !== action.itinerary) {
        newState.itinerary = Object.assign({}, action.itinerary);
        return newState;
      }
      return state;
      // return {
      //   ...state,
      //   modalType: Constants.REORDER_ITINERARY_MODAL,
      //   itinerary: action.itinerary,
      //   tips: action.tips
      // }
    }
    case UPDATE_FIELD_CREATE:
      if(action.source === NEW_ITINERARY_MODAL) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case HIDE_MODAL:
    case SUBJECT_DUPLICATE:
    case ADDED_TO_ITINERARY:
    case FRIEND_SELECTOR_SUBMIT:
    case ITINERARY_DELETED:
    case ActionTypes.THREAD_DELETED:
      return initialState;
    case REVIEW_SUBMITTED:
      return {
        ...state,
        modalType: FORWARD_MODAL,
        review: action.review
      };
    case CREATE_SUBMIT_ERROR:
      if (action.source === NEW_ITINERARY_MODAL) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
    case GOOGLE_MAP_LOADED:
      if (action.source === NEW_ITINERARY_MODAL) {
        return {
          ...state,
          googleObject: action.googleObject,
          mapObject: action.mapObject
        }
      }
      else return {...state}
  	default:
  		return state
  	}
}