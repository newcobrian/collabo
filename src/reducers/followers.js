import { GET_FOLLOWERS, GET_FOLLOWINGS } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_FOLLOWERS:
      return {
        ...state,
        followers: action.payload
      }
  }

  return state;
};