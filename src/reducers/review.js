import { GET_SUBJECT, GET_REVIEW, SUBJECT_UNLOADED, REVIEW_UNLOADED, GET_COMMENTS, GET_APP_USER_REVIEW, 
  COMMENTS_UNLOADED, ADD_COMMENT, DELETE_COMMENT, RATING_UPDATED, REVIEW_LIKED, REVIEW_UNLIKED, APP_USER_REVIEW_UNLOADED,
  GET_FOLLOWING_REVIEWS, FOLLOWING_REVIEWS_UNLOADED, REVIEW_SAVED, REVIEW_UNSAVED, UNLOAD_USER_REVIEW, GET_USER_REVIEW,
  SHOW_CONFIRM_MESSAGE, UPDATE_GOOGLE_DOCS_META, UPDATE_GOOGLE_DOCS_MESSAGE, UPDATE_GOOGLE_DOCS_PERMISSION } from '../actions'
import * as ActionTypes from '../actions/types';

export default (state = {}, action) => {
  switch (action.type) {
    case 'ARTICLE_PAGE_LOADED':
      return {
        ...state,
        article: action.payload[0].article,
        comments: action.payload[1].comments
      };
    case ADD_COMMENT:
      return {
        ...state,
        commentErrors: action.error ? action.error : null
      };
    case 'DELETE_COMMENT':
      const commentId = action.commentId
      return {
        ...state,
        comments: state.comments.filter(comment => comment.id !== commentId)
      };
    case GET_SUBJECT:
      return {
        ...state,
        subject: action.payload
      };
    case GET_REVIEW:
      return {
        ...state,
        review: action.payload
      };
    case GET_USER_REVIEW:
      return {
        ...state,
        appUserReview: action.payload
      }
    case GET_FOLLOWING_REVIEWS:
      return {
        ...state,
        followingReviews: action.payload
      }
    case ActionTypes.GET_ALL_REVIEWS:
      return {
        ...state,
        allReviews: action.payload
      }
    case GET_COMMENTS:
      return {
        ...state,
        comments: action.payload
      }
    case DELETE_COMMENT:
    case RATING_UPDATED:
    case REVIEW_LIKED:
    case REVIEW_UNLIKED:
    case REVIEW_SAVED:
    case REVIEW_UNSAVED:
      return {
        ...state
      }
    case UNLOAD_USER_REVIEW:
    case SUBJECT_UNLOADED:
    case REVIEW_UNLOADED:
    case COMMENTS_UNLOADED:
    case APP_USER_REVIEW_UNLOADED:
    case FOLLOWING_REVIEWS_UNLOADED:
    case ActionTypes.ALL_REVIEWS_UNLOADED:
      return {};

    case SHOW_CONFIRM_MESSAGE:
      return {
        ...state,
        isConfirmMessageVisible: true
      };

    case UPDATE_GOOGLE_DOCS_META:
      let googleDocs = state.googleDocs || {};
      return {
        ...state,
        googleDocs: {
          ...googleDocs,
          [action.payload.id]: {
            ...googleDocs[action.payload.id],
            meta: action.payload.data
          }
        }
      };

    case UPDATE_GOOGLE_DOCS_MESSAGE:
      googleDocs = state.googleDocs || {};
      return {
        ...state,
        googleDocs: {
          ...googleDocs,
          [action.payload.id]: {
            ...googleDocs[action.payload.id],
            message: action.payload.data
          }
        }
      };

    case UPDATE_GOOGLE_DOCS_PERMISSION:
      googleDocs = state.googleDocs || {};
      return {
        ...state,
        googleDocs: {
          ...googleDocs,
          [action.payload.id]: {
            ...googleDocs[action.payload.id],
            meta: {
              ...googleDocs[action.payload.id].meta,
              shared: action.payload.data
            }
          }
        }
      };
    default:
      return state;
  }
};