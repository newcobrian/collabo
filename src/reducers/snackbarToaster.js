import { CLOSE_SNACKBAR, SHOW_SNACKBAR, SUBJECT_DUPLICATE, ADDED_TO_ITINERARY } from '../actions';

const initialState = {
  message:'',
  open:false
};

export default function(state = initialState, action) {

  switch (action.type) {

    case SHOW_SNACKBAR:
    case SUBJECT_DUPLICATE:
    case ADDED_TO_ITINERARY:
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
