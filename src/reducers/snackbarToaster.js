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
    case ActionTypes.THREAD_UPDATED:
    case ActionTypes.THREAD_DELETED:
      {
        return {...state,
          message: action.message,
          link: action.link,
          open:true
        };
      }
    case ActionTypes.INVITED_USERS_TO_PROJECT:
      return {
        ...state,
        message: 'Invites sent',
        open: true
      }
    case ActionTypes.USERS_INVITED_TO_ORG:
      let text = action.invitesSent === 1 ? ' person invited to ' : ' people invited to '
      return {
        ...state,
        message: action.invitesSent + text + action.orgName,
        open: true
      }
    case ActionTypes.USER_ROLE_UPDATED:
      return {
        ...state,
        message: action.message,
        open: true
      }
    case ActionTypes.PROJECT_SETTINGS_UPDATED:
      return {
        ...state,
        message: 'Group updated',
        open: true
      }
    case ActionTypes.PROJECT_DELETED:
      return {
        ...state,
        message: action.projectName + ' has been permanently deleted'
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
