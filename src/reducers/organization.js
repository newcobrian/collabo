import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
import { createItineraryObject, findIndexByValue } from '../helpers';
import { filter, find } from 'lodash';

const lastModifiedDesc = (a, b) => {
  return b.lastModified - a.lastModified;
}

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_ORG: {
      return {
        ...state,
        org: action.organization,
        invalidOrgUser: false
      }
    }
    case ActionTypes.UNLOAD_ORG: {
      return {
        ...state,
        organization: {}
      }
    }
    case ActionTypes.NOT_AN_ORG_USER:
      return {
        ...state,
        invalidOrgUser: true
      }
    default:
      return state;
  }
};