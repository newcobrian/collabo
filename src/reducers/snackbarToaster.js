import { CLOSE_SNACKBAR, SHOW_SNACKBAR, SUBJECT_DUPLICATE, ADDED_TO_ITINERARY, ITINERARY_DELETED,
  SETTINGS_SAVED, FORGOT_PASSWORD_SENT } from '../actions';
import * as ActionTypes from '../actions/types';

const initialState = {
  message:'',
  open:false
};

export default function(state = initialState, action) {

  switch (action.type) {

    case SHOW_SNACKBAR:
    case SUBJECT_DUPLICATE:
    case ADDED_TO_ITINERARY:
    case ITINERARY_DELETED:
    case ActionTypes.ITINERARY_UPDATED:
    case SETTINGS_SAVED:
    case FORGOT_PASSWORD_SENT:
    case ActionTypes.ITINERARY_UPDATED:
      {
        return {...state,
          message:action.message,
          open:true
        };
      }

    case CLOSE_SNACKBAR:
      {
        return {...state,
          message:"",
          open:false
        };
      }
    default: 
      return state;
  }
}
