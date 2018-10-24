import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import { createItineraryObject, findIndexByValue } from '../helpers';
import { filter, find } from 'lodash';

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LIST_ADDED_ACTION: {
      if (action.source === Constants.HOME_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.listType] = newState[action.listType] || [];
        newState[action.listType] = newState[action.listType].slice();
        if (!find(newState[action.listType], ['id', action.id])) {
          newState[action.listType] = newState[action.listType].concat(Object.assign({}, {id: action.id}, action.data));

          return newState;
        }
        return state;
      }
      return state;
    }
    case ActionTypes.LIST_CHANGED_ACTION: {
      if (action.source === Constants.HOME_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.listType] = newState[action.listType] || [];
        newState[action.listType] = newState[action.listType].slice();
        
        for (let i = 0; i < newState[action.listType].length; i++) {
          if (newState[action.listType][i].id === action.id) {
            newState[action.listType][i] = Object.assign({}, {id: action.id}, action.data);
            break;
          }
        }
        return newState;
      }
      return state;
    }
    case ActionTypes.LIST_REMOVED_ACTION: {
      if (action.source === Constants.HOME_PAGE) {
        const newState = Object.assign({}, state);
        newState[action.listType] = newState[action.listType] || [];
        newState[action.listType] = newState[action.listType].slice();
        // find the tip and remove it
        for (let i = 0; i < newState[action.listType].length; i++) {
          if (newState[action.listType][i].id === action.id) {
            newState[action.listType].splice(i, 1);
            break;    
          }
        }
        return newState;
      }
      return state;
    }
    default:
      return state;
  }
};