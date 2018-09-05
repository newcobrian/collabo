import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { find, isEqual } from 'lodash';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.USERNAME_LOADED: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        const newState = Object.assign({}, state);
        newState.usersList = newState.usersList || [];
        newState.usersList = newState.usersList.slice();
        newState.usersList = newState.usersList.concat(Object.assign({}, {username: action.username}, 
          {url: '/' + action.orgName + '/user/' + action.username}, {email: action.email}, {image: action.image},
          {firstName: action.firstName}, {lastName: action.lastName}));
        return newState;
      }
      return state;
    }
    case ActionTypes.UNLOAD_ORG_USERS: {
      if (action.source === Constants.ORG_SETTINGS_PAGE) {
        return {
          ...state,
          usersList: []
        }
      }
    }
    default:
      return state;
  }
};