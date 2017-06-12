import { CLOSE_SNACKBAR, SHOW_SNACKBAR, SUBJECT_DUPLICATE, ADDED_TO_ITINERARY, ITINERARY_DELETED,
  ITINERARY_UPDATED, SETTINGS_SAVED } from '../actions';

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
    case ITINERARY_UPDATED:
    case SETTINGS_SAVED:
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
