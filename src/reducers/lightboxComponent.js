import { OPEN_LIGHTBOX, CLOSE_LIGHTBOX, PREV_LIGHTBOX, NEXT_LIGHTBOX } from '../actions';

export default (state = { showLighbox: false, photoIndex: 0 }, action) => {
  switch (action.type) {
    case OPEN_LIGHTBOX:
      return {
        ...state,
        showLightbox: true,
        images: action.images,
      }
    case CLOSE_LIGHTBOX:
      return {
        ...state,
        showLightbox: false,
        images: [],
        photoIndex: 0
      }
    case PREV_LIGHTBOX:
      return {
        ...state,
        photoIndex: action.index
      }
    case NEXT_LIGHTBOX:
      return {
        ...state,
        photoIndex: action.index
      }
    default:
      return state;
  }
};