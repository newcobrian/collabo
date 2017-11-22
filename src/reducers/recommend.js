import * as ActionTypes from '../actions/types';
import * as Constants from '../constants';
// import * as Helpers from '../helpers';
// import { findIndexByValue } from '../helpers';
// import { filter, isEqual, find, omit, countBy } from 'lodash';

const initialState = {};

// const getImage = (userImages, defaultImages) => {
//   let defaultImage = defaultImages ? defaultImages : [];
//   let images = { images: (userImages ? userImages : defaultImage) };
//   return images;
// }

export default (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.LOAD_RECOMMEND_PAGE:
      return {
        ...state,
        recId: action.recId,
        recObject: action.recObject
      }
    default:
      return state;
  }
};