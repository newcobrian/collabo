import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import { watchLikesByUser, unwatchLikesByUser, watchUser, unwatchUser } from './index';

export function watchItinerary(auth, itineraryId) {
	return (dispatch, getState) => {
		// get the likes data for the viewer
		watchLikesByUser(dispatch, auth, Constants.ITINERARY_PAGE);

		// watch the itinerary
		Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
			// watch the itinerary creator
			watchUser(dispatch, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);

			// get all tips in the itinerary
			watchTips(dispatch, itineraryId, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);

      // watch itinerary comments
      watchComments(dispatch, itineraryId, Constants.ITINERARY_PAGE);

      // dispatch itinerary data
      dispatch(itineraryValueAction(itinerarySnapshot.val(), itineraryId, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE));
		})
	}
}

export function unwatchItinerary(auth, itineraryId) {
  return dispatch => {
    unwatchLikesByUser(dispatch, auth);
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinerarySnapshot => {
      unwatchUser(dispatch, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);
      unwatchTips(dispatch, itineraryId, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);
      unwatchComments(dispatch, itineraryId, Constants.ITINERARY_PAGE);
    })
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).off();
    dispatch({
      type: ActionTypes.ITINERARY_PAGE_UNLOADED
    })
  }
}

function itineraryValueAction(itinerary, itineraryId, userId, source) {
  return {
    type: ActionTypes.ITINERARY_VALUE_ACTION,
    itinerary,
    itineraryId,
    userId,
    source
  }
}

function subjectValueAction(subjectId, subject, source) {
  subject.lastModified = undefined;
  return {
    type: ActionTypes.SUBJECT_VALUE_ACTION,
    dataName: Constants.SUBJECTS_DATA,
    id: subjectId,
    payload: subject,
    source
  }
}

function subjectRemovedAction(subjectId, source) {
  return {
    type: ActionTypes.SUBJECT_REMOVED_ACTION,
    dataName: Constants.SUBJECTS_DATA,
    id: subjectId,
    source
  }
}

function reviewValueAction(reviewId, review, source) {
  review.lastModified = undefined;
  return {
    type: ActionTypes.REVIEW_VALUE_ACTION,
    dataName: Constants.REVIEWS_DATA,
    id: reviewId,
    payload: review,
    source
  }
}

function reviewRemovedAction(reviewId, source) {
  return {
    type: ActionTypes.REVIEW_REMOVED_ACTION,
    dataName: Constants.REVIEWS_DATA,
    id: reviewId,
    source
  }
}

function tipAddedAction(priority, tip, source) {
  tip.lastModified = undefined;
  return {
    type: ActionTypes.TIP_ADDED_ACTION,
    priority,
    tip,
    source
  }
}

function tipChangedAction(priority, tip, source) {
  tip.lastModified = undefined;
  return {
    type: ActionTypes.TIP_CHANGED_ACTION,
    priority,
    tip,
    source
  }
}

function tipRemovedAction(priority, source) {
  return {
    type: ActionTypes.TIP_REMOVED_ACTION,
    dataName: Constants.TIPS_DATA,
    id: priority,
    source
  }
}

function commentAddedAction(objectId, commentId, comment, source) {
  return {
    type: ActionTypes.COMMENT_ADDED_ACTION,
    objectId,
    commentId,
    comment,
    source
  }
}

function commentRemovedAction(objectId, commentId, source) {
  return {
    type: ActionTypes.COMMENT_REMOVED_ACTION,
    objectId,
    commentId,
    source
  }
}

function imagesByUserValueAction(subjectId, images, source) {
  return {
    type: ActionTypes.IMAGES_BY_USER_VALUE_ACTION,
    subjectId,
    images: Helpers.getImagePath(images),
    source
  }
}

function imagesByUserRemovedAction(subjectId, source) {
  return {
    type: ActionTypes.IMAGES_BY_USER_REMOVED_ACTION,
    dataName: Constants.USER_IMAGES_DATA,
    id: subjectId,
    source
  }
}

function defaultImagesValueAction(subjectId, images, source) {
  return {
    type: ActionTypes.DEFAULT_IMAGES_VALUE_ACTION,
    subjectId,
    images: Helpers.getImagePath(images),
    source
  }
}

function defaultImagesRemovedAction(subjectId, source) {
  return {
    type: ActionTypes.DEFAULT_IMAGES_REMOVED_ACTION,
    dataName: Constants.DEFAULT_IMAGES_DATA,
    id: subjectId,
    source
  }
}

export function watchTips(dispatch, itineraryId, itineraryUserId, source) {
  Firebase.database().ref(Constants.REVIEWS_BY_ITINERARY_PATH + '/' + itineraryId).on('child_added', tipSnapshot => {
    watchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    watchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    watchComments(dispatch, tipSnapshot.val().reviewId, source);
    watchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    watchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    dispatch(tipAddedAction(tipSnapshot.key, tipSnapshot.val(), source));
  })

  // on child changed, how do we unwatch old refs?
  Firebase.database().ref(Constants.REVIEWS_BY_ITINERARY_PATH + '/' + itineraryId).on('child_changed', tipSnapshot => {
    watchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    watchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    watchComments(dispatch, tipSnapshot.val().reviewId, source);
    watchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    watchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    dispatch(tipChangedAction(tipSnapshot.key, tipSnapshot.val(), source));
  })

  Firebase.database().ref(Constants.REVIEWS_BY_ITINERARY_PATH + '/' + itineraryId).on('child_removed', tipSnapshot => {
    unwatchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    unwatchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    unwatchComments(dispatch, tipSnapshot.val().reviewId, source);
    unwatchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    unwatchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    dispatch(tipRemovedAction(tipSnapshot.key, source));
  })
}

export function unwatchTips(dispatch, itineraryId, itineraryUserId, source) {
  Firebase.database().ref(Constants.REVIEWS_BY_ITINERARY_PATH + '/' + itineraryId).once('value', tipSnapshot => {
    unwatchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    unwatchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    unwatchComments(dispatch, tipSnapshot.val().reviewId, source);
    unwatchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    unwatchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
  })
  Firebase.database().ref(Constants.REVIEWS_BY_ITINERARY_PATH + '/' + itineraryId).off();
}

export function watchSubject(dispatch, priority, subjectId, source) {
  Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnap => {
    dispatch(subjectValueAction(subjectId, subjectSnap.val(), source));
  })
}

export function unwatchSubject(dispatch, priority, subjectId, source) {
  Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
    dispatch(subjectRemovedAction(subjectId, source));
}

export function watchReview(dispatch, priority, reviewId, source) {
  Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).on('value', reviewSnap => {
    dispatch(reviewValueAction(reviewId, reviewSnap.val(), source));
  })
}

export function unwatchReview(dispatch, priority, reviewId, source) {
  Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).off();
  dispatch(reviewRemovedAction(reviewId, source));
}


export function watchComments(dispatch, objectId, source) {
  Firebase.database().ref(Constants.COMMENTS_PATH + '/' + objectId).on('child_added', commentSnap => {
    dispatch(commentAddedAction(objectId, commentSnap.key, commentSnap.val(), source));
  })

  // Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).on('child_changed', commentSnap => {
  //   dispatch(commentChangedAction(reviewId, commentSnap.val()));
  // })

  Firebase.database().ref(Constants.COMMENTS_PATH + '/' + objectId).on('child_removed', commentSnap => {
    dispatch(commentRemovedAction(objectId, commentSnap.key, source));
  })
}

export function unwatchComments(dispatch, objectId, source) {
  Firebase.database().ref(Constants.COMMENTS_PATH + '/' + objectId).off();
}

export function watchImagesByUser(dispatch, userId, subjectId, source) {
  Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userId + '/' + subjectId).on('value', imagesSnap => {
    if (imagesSnap.exists()) {
      dispatch(imagesByUserValueAction(subjectId, imagesSnap.val(), source));
    }
  })
}

export function unwatchImagesByUser(dispatch, userId, subjectId, source) {
  Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userId + '/' + subjectId).off();
  dispatch(imagesByUserRemovedAction(subjectId, source));
}

export function watchDefaultImages(dispatch, subjectId, source) {
  Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', defaultImagesSnap => {
    dispatch(defaultImagesValueAction(subjectId, defaultImagesSnap.val(), source));
  })
}

export function unwatchDefaultImages(dispatch, subjectId, source) {
  Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).off();
  dispatch(defaultImagesRemovedAction(subjectId, source));
}

// export function getItinerary(auth, itineraryId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
//       if (itinerarySnapshot.exists()) {
//         Firebase.database().ref(Constants.REVIEWS_BY_ITINERARY_PATH + '/' + itineraryId).on('value', reviewsListSnapshot => {
//           Firebase.database().ref(Constants.USERS_PATH + '/' + itinerarySnapshot.val().userId).on('value', userSnapshot => {
//             Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itineraryId).on('value', itinLikeSnapshot => {
//               let userInfo = { createdBy:
//                 { username: userSnapshot.val().username, image: userSnapshot.val().image, userId: userSnapshot.key }
//               };
//               let itinLikes = {
//                 isLiked: itinLikeSnapshot.exists()
//               }

//               let itineraryObject = Object.assign({}, {id: itineraryId}, itinerarySnapshot.val(), userInfo, itinLikes);
//               let reviewArray = [];
//               if (!reviewsListSnapshot.exists()) {
//                 dispatch({
//                   type: ActionTypes.ITINERARY_PAGE_LOADED,
//                   itineraryId: itineraryId,
//                   itinerary: itineraryObject,
//                   reviewList: []
//                 })
//               }
//               else {
//                 let reviewsList = Object.assign({}, reviewsListSnapshot.val());
//                 let reviewsLength = reviewsListSnapshot.numChildren();
//                 for (let i = 0; i < reviewsLength; i++) {
//                   let reviewItem = reviewsList[i];
//                   if (reviewItem) {
//                     Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewItem.subjectId).on('value', subjectSnapshot => {
//                       Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewItem.reviewId).on('value', reviewSnapshot => {
//                         Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + reviewItem.reviewId).on('value', likesSnapshot => {
//                           Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewItem.reviewId).on('value', commentSnapshot => {
//                             Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + itinerarySnapshot.val().userId + '/' + reviewItem.subjectId).on('value', imagesSnapshot => {
//                               Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviewItem.subjectId).on('value', defaultImagesSnapshot => {
//                                 let reviewObject = {};
//                                 let likes = {
//                                   isLiked: likesSnapshot.exists()
//                                 }
//                                 let comments = [];
//                                 commentSnapshot.forEach(function(commentChild) {
//                                   const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
//                                   comments = comments.concat(comment);
//                                 })
//                                 comments.sort(Helpers.lastModifiedAsc);

//                                 let images = imagesSnapshot.exists() ? Helpers.getImagePath(imagesSnapshot.val()) : Helpers.getImagePath(defaultImagesSnapshot.val());

//                                 Object.assign(reviewObject, subjectSnapshot.val(), reviewSnapshot.val(), {id: reviewItem.reviewId},
//                                       { priority: i }, reviewItem, userInfo, likes, {comments: comments}, {images: images} );
//                                 reviewArray = [reviewObject].concat(reviewArray);
//                                 reviewArray.sort(Helpers.byPriority);

//                                 dispatch({
//                                   type: ActionTypes.ITINERARY_PAGE_LOADED,
//                                   itineraryId: itineraryId,
//                                   itinerary: itineraryObject,
//                                   reviewList: reviewArray
//                                 })
//                               })
//                             })
//                           })
//                         })
//                       })
//                     })
//                   }
//                 }
//               }
//             })
//           })
//         })
//       }
//       else {
//         dispatch({
//           type: ActionTypes.ITINERARY_PAGE_LOADED,
//           itineraryId: itineraryId,
//           itinerary: []
//         })
//       }
//     })
//   }
// }

// export function onItineraryUnload(auth, itineraryId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinerarySnapshot => {
//       if (itinerarySnapshot.exists()) {
//         Firebase.database().ref(Constants.USERS_PATH + '/' + itinerarySnapshot.val().userId).off();
//         Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itineraryId).off();
//         let itineraryObject = itinerarySnapshot.val();
//         if (itineraryObject && itineraryObject.reviews) {
//           for (let i = 0; i < itineraryObject.reviews.length; i++) {
//             let reviewItem = itineraryObject.reviews[i];
//             Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewItem.subjectId).off();
//             Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewItem.reviewId).off();
//             Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + reviewItem.reviewId).off();
//             Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewItem.reviewId).off();
//             Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + auth + '/' + reviewItem.subjectId).off();
//             Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviewItem.subjectId).off();
//           }
//         }
//       }
//     })
//     Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).off();
//     dispatch({
//       type: ActionTypes.ITINERARY_PAGE_UNLOADED
//     })
//   }
// }

// export function getItineraryComments(itineraryId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.COMMENTS_PATH + '/' + itineraryId).on('value', itinCommentSnapshot => {
//       let comments = [];
//       itinCommentSnapshot.forEach(function(itinCommentChild) {
//         const comment = Object.assign({}, itinCommentChild.val(), { id: itinCommentChild.key } );
//         comments = comments.concat(comment);
//       })
//       comments.sort(Helpers.lastModifiedAsc);
//       dispatch({
//         type: ActionTypes.ITINERARY_COMMMENTS_LOADED,
//         comments: comments
//       })
//     })
//   }
// }

// export function unloadItineraryComments(itineraryId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.COMMENTS_PATH + '/' + itineraryId).off();
//     dispatch({
//       type: ActionTypes.ITINERARY_COMMMENTS_UNLOADED
//     })
//   }
// }
