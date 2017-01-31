import { GET_SUBJECT, GET_REVIEW, SUBJECT_UNLOADED, REVIEW_UNLOADED, GET_COMMENTS, GET_APP_USER_REVIEW, 
  COMMENTS_UNLOADED, ADD_COMMENT, DELETE_COMMENT, RATING_UPDATED, REVIEW_LIKED, REVIEW_UNLIKED, APP_USER_REVIEW_UNLOADED,
  GET_FOLLOWING_REVIEWS, FOLLOWING_REVIEWS_UNLOADED } from '../actions'

export default (state = {}, action) => {
  switch (action.type) {
    case 'ARTICLE_PAGE_LOADED':
      return {
        ...state,
        article: action.payload[0].article,
        comments: action.payload[1].comments
      };
      break;
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
    case GET_APP_USER_REVIEW:
      return {
        ...state,
        appUserReview: action.payload
      }
    case GET_FOLLOWING_REVIEWS:
      return {
        ...state,
        followingReviews: action.payload
      }
    case GET_COMMENTS:
      return {
        ...state,
        comments: action.payload
      };
    case DELETE_COMMENT:
    case RATING_UPDATED:
    case REVIEW_LIKED:
    case REVIEW_UNLIKED:
      return {
        ...state
      }
    case SUBJECT_UNLOADED:
    case REVIEW_UNLOADED:
    case COMMENTS_UNLOADED:
    case APP_USER_REVIEW_UNLOADED:
    case FOLLOWING_REVIEWS_UNLOADED:
      return {};
  }

  return state;
};