import { LOADED_ALL_USERS,  UNLOADED_ALL_USERS } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case LOADED_ALL_USERS:
      return {
        ...state,
        users: action.payload
      }
    case UNLOADED_ALL_USERS:
      return {}
    default:
      return state;
  }
};