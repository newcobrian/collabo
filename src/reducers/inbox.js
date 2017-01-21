import { GET_INBOX } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_INBOX:
      return {
        ...state,
        inbox: action.payload
      };
      break;
  }

  return state;
};