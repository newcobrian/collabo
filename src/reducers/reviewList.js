import { GET_USER_FEED, REVIEW_LIKED, REVIEW_UNLIKED, REVIEW_SAVED, REVIEW_UNSAVED } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case GET_USER_FEED:
      return {
        ...state
        // articles: action.payload[1].articles,
        // articlesCount: action.payload[1].articlesCount,
        // tab: action.tab,
        // currentPage: 0
      };
    case 'HOME_PAGE_UNLOADED':
      return {};
    case 'SET_PAGE':
      return {
        ...state,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        currentPage: action.page
      };
    case REVIEW_LIKED:
    case REVIEW_UNLIKED:
    case REVIEW_SAVED:
    case REVIEW_UNSAVED:
      return {
        ...state
      }
    case 'APPLY_TAG_FILTER':
      return {
        ...state,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        tab: null,
        tag: action.tag,
        currentPage: 0
      };
    case 'PROFILE_PAGE_LOADED':
    case 'PROFILE_FAVORITES_PAGE_LOADED':
      return {
        ...state,
        articles: action.payload[1].articles,
        articlesCount: action.payload[1].articlesCount,
        currentPage: 0
      };
    case 'PROFILE_PAGE_UNLOADED':
    case 'PROFILE_FAVORITES_PAGE_UNLOADED':
      return {};
  }

  return state;
};