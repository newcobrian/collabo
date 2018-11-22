import * as ActionTypes from '../actions/types'
import * as Constants from '../constants'

const initialState = {
  role: Constants.USER_ROLE,
  selectProjectMode: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.CREATE_SUBMIT_ERROR:
      if (action.source === Constants.ORG_INVITE_MODAL) {
        return {
          ...state,
          errors: [action.error],
          inProgress: null
        }
      }
      else return {...state}
    case ActionTypes.UPDATE_FIELD_CREATE:
      if(action.source === Constants.ORG_INVITE_MODAL) {
        return { ...state, [action.key]: action.value };
      }
      else return {...state}
    case ActionTypes.INVITE_GUEST_PROJECTS:
      return {
        ...state,
        selectProjectMode: true
      }
    case ActionTypes.UPDATE_SELECTOR:
      if (action.source === Constants.ORG_INVITE_MODAL) {
        return {
          ...state,
          selected: action.payload
        }
      }
      else return {...state};
    case ActionTypes.USERS_INVITED_TO_ORG:
    case ActionTypes.HIDE_MODAL:
      return initialState
    default:
      return state
    }
}