import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'

// export function watchItinerary(auth, itineraryId) {
// 	return dispatch => {
// 		// get the likes data for the viewer
// 		watchLikesByUser(dispatch, auth, Constants.ITINERARY_PAGE);

// 		// watch the itinerary
// 		Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
// 			// watch the itinerary creator
// 			watchUser(dispatch, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);

// 			// dispatch itinerary data
// 			dispatch(itineraryValueAction(itinerarySnapshot.val(), Constants.ITINERARY_PAGE));

// 			// get all tips in the itinerary
// 			for (let i = 0; i < itineraryObject.reviews.length; i++) {
// 				let reviewItem = itineraryObject.reviews[i];
// 				watchSubject(reviewItem.subjectId);
// 				watchReview(reviewItem.reviewId);
// 				watchComments(reviewItem.reviewId);
// 				watchImagesByUser(itinerarySnapshot.val().userId, reviewItem.subjectId);
// 				watchImages(reviewItem.subjectId);
// 			}
// 		})
// 	}
// }

// function itineraryValueAction(itinerary, source) {
//   return {
//     type: ActionTypes.ITINERARY_VALUE_ACTION,
//     itinerary,
//     source
//   }
// }

export function getItinerary(auth, itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
      if (itinerarySnapshot.exists()) {
        Firebase.database().ref(Constants.REVIEWS_BY_ITINERARY_PATH + '/' + itineraryId).on('value', reviewsListSnapshot => {
          Firebase.database().ref(Constants.USERS_PATH + '/' + itinerarySnapshot.val().userId).on('value', userSnapshot => {
            Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itineraryId).on('value', itinLikeSnapshot => {
              let userInfo = { createdBy:
                { username: userSnapshot.val().username, image: userSnapshot.val().image, userId: userSnapshot.key }
              };
              let itinLikes = {
                isLiked: itinLikeSnapshot.exists()
              }

              let itineraryObject = Object.assign({}, {id: itineraryId}, itinerarySnapshot.val(), userInfo, itinLikes);
              let reviewArray = [];
              if (!reviewsListSnapshot.exists()) {
                dispatch({
                  type: ActionTypes.ITINERARY_PAGE_LOADED,
                  itineraryId: itineraryId,
                  itinerary: itineraryObject,
                  reviewList: []
                })
              }
              else {
                let reviewsList = Object.assign({}, reviewsListSnapshot.val());
                let reviewsLength = reviewsListSnapshot.numChildren();
                for (let i = 0; i < reviewsLength; i++) {
                  let reviewItem = reviewsList[i];
                  if (reviewItem) {
                    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewItem.subjectId).on('value', subjectSnapshot => {
                      Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewItem.reviewId).on('value', reviewSnapshot => {
                        Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + reviewItem.reviewId).on('value', likesSnapshot => {
                          Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewItem.reviewId).on('value', commentSnapshot => {
                            Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + itinerarySnapshot.val().userId + '/' + reviewItem.subjectId).on('value', imagesSnapshot => {
                              Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviewItem.subjectId).on('value', defaultImagesSnapshot => {
                                let reviewObject = {};
                                let likes = {
                                  isLiked: likesSnapshot.exists()
                                }
                                let comments = [];
                                commentSnapshot.forEach(function(commentChild) {
                                  const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
                                  comments = comments.concat(comment);
                                })
                                comments.sort(Helpers.lastModifiedAsc);

                                let images = imagesSnapshot.exists() ? Helpers.getImagePath(imagesSnapshot.val()) : Helpers.getImagePath(defaultImagesSnapshot.val());

                                Object.assign(reviewObject, subjectSnapshot.val(), reviewSnapshot.val(), {id: reviewItem.reviewId},
                                      { priority: i }, reviewItem, userInfo, likes, {comments: comments}, {images: images} );
                                reviewArray = [reviewObject].concat(reviewArray);
                                reviewArray.sort(Helpers.byPriority);

                                dispatch({
                                  type: ActionTypes.ITINERARY_PAGE_LOADED,
                                  itineraryId: itineraryId,
                                  itinerary: itineraryObject,
                                  reviewList: reviewArray
                                })
                              })
                            })
                          })
                        })
                      })
                    })
                  }
                }
              }
            })
          })
        })
      }
      else {
        dispatch({
          type: ActionTypes.ITINERARY_PAGE_LOADED,
          itineraryId: itineraryId,
          itinerary: []
        })
      }
    })
  }
}

export function onItineraryUnload(auth, itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinerarySnapshot => {
      if (itinerarySnapshot.exists()) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + itinerarySnapshot.val().userId).off();
        Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itineraryId).off();
        let itineraryObject = itinerarySnapshot.val();
        if (itineraryObject && itineraryObject.reviews) {
          for (let i = 0; i < itineraryObject.reviews.length; i++) {
            let reviewItem = itineraryObject.reviews[i];
            Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewItem.subjectId).off();
            Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewItem.reviewId).off();
            Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + reviewItem.reviewId).off();
            Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewItem.reviewId).off();
            Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + auth + '/' + reviewItem.subjectId).off();
            Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviewItem.subjectId).off();
          }
        }
      }
    })
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).off();
    dispatch({
      type: ActionTypes.ITINERARY_PAGE_UNLOADED
    })
  }
}

export function getItineraryComments(itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + itineraryId).on('value', itinCommentSnapshot => {
      let comments = [];
      itinCommentSnapshot.forEach(function(itinCommentChild) {
        const comment = Object.assign({}, itinCommentChild.val(), { id: itinCommentChild.key } );
        comments = comments.concat(comment);
      })
      comments.sort(Helpers.lastModifiedAsc);
      dispatch({
        type: ActionTypes.ITINERARY_COMMMENTS_LOADED,
        comments: comments
      })
    })
  }
}

export function unloadItineraryComments(itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + itineraryId).off();
    dispatch({
      type: ActionTypes.ITINERARY_COMMMENTS_UNLOADED
    })
  }
}
