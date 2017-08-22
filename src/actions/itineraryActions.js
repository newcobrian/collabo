import Firebase from 'firebase'
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import { watchLikesByUser, unwatchLikesByUser, watchUser, unwatchUser } from './index'
import { isEqual, pick } from 'lodash'

export function watchItinerary(auth, itineraryId) {
	return (dispatch, getState) => {
		// get the likes data for the viewer
		watchLikesByUser(dispatch, auth, Constants.ITINERARY_PAGE);

		// watch the itinerary
		Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
      if (itinerarySnapshot.exists()) {
  			// watch the itinerary creator
  			watchUser(dispatch, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);

  			// get all tips in the itinerary
  			watchTips(dispatch, itineraryId, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);

        // watch itinerary comments
        watchComments(dispatch, itineraryId, Constants.ITINERARY_PAGE);
      }

      // dispatch itinerary data
      dispatch(itineraryValueAction(itinerarySnapshot.val(), itineraryId, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE));
		})
	}
}

export function unwatchItinerary(auth, itineraryId) {
  return dispatch => {
    unwatchLikesByUser(dispatch, auth);
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinerarySnapshot => {
      if (itinerarySnapshot.exists()) {
        unwatchUser(dispatch, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);
        unwatchTips(dispatch, itineraryId, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE);
        unwatchComments(dispatch, itineraryId, Constants.ITINERARY_PAGE);
      }
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
  if (subject) delete subject.lastModified;
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
  if (review) delete review.lastModified;
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

function tipAddedAction(tipId, tip, source) {
  delete tip.lastModified;
  return {
    type: ActionTypes.TIP_ADDED_ACTION,
    tipId,
    tip,
    source
  }
}

function tipChangedAction(tipId, tip, source) {
  delete tip.lastModified;
  return {
    type: ActionTypes.TIP_CHANGED_ACTION,
    tipId,
    tip,
    source
  }
}

function tipRemovedAction(tipId, source) {
  return {
    type: ActionTypes.TIP_REMOVED_ACTION,
    dataName: Constants.TIPS_DATA,
    tipId,
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
  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).orderByPriority().on('child_added', tipSnapshot => {
    if (tipSnapshot.val().userId && tipSnapshot.val().userId !== itineraryUserId) {
      watchUser(dispatch, tipSnapshot.val().userId, source)
    }
    watchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    watchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    watchComments(dispatch, tipSnapshot.key, source);
    watchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    watchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    dispatch(tipAddedAction(tipSnapshot.key, tipSnapshot.val(), source));
  })

  // on child changed, how do we unwatch old refs?
  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).orderByPriority().on('child_changed', tipSnapshot => {
    watchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    watchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    watchComments(dispatch, tipSnapshot.key, source);
    watchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    watchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    dispatch(tipChangedAction(tipSnapshot.key, tipSnapshot.val(), source));
  })

  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).orderByPriority().on('child_removed', tipSnapshot => {
    unwatchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    unwatchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    unwatchComments(dispatch, tipSnapshot.key, source);
    unwatchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    unwatchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    dispatch(tipRemovedAction(tipSnapshot.key, source));
  })
}

export function unwatchTips(dispatch, itineraryId, itineraryUserId, source) {
  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).once('value', tipSnapshot => {
    if (tipSnapshot.val().userId && tipSnapshot.val().userId !== itineraryUserId) {
      unwatchUser(dispatch, tipSnapshot.val().userId, source)
    }
    unwatchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    unwatchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    unwatchComments(dispatch, tipSnapshot.key, source);
    unwatchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    unwatchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
  })
  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).off();
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

export function updateItineraryForm(key, value) {
  return dispatch => {
    dispatch({
      type: ActionTypes.UPDATE_ITINERARY_FORM,
      key,
      value
    })
  }
}

export function updateItineraryField(auth, itinerary, field, value) {
  return dispatch => {
    if (itinerary && itinerary.id && itinerary.userId && itinerary.geo && itinerary.geo.placeId) {
      let updates = {};
      
      // update all itinerary tables
      updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/${field}`] = value;
      updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/${field}`] = value;
      updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/${field}`] = value;
      updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/${field}`] = value;

      // update lastModified timestamps
      let timestamp = Firebase.database.ServerValue.TIMESTAMP;
      updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/lastModified`] = timestamp;
      updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/lastModified`] = timestamp;
      updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/lastModified`] = timestamp;
      updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/lastModified`] = timestamp;

      Firebase.database().ref().update(updates);

      dispatch({
        type: ActionTypes.ITINERARY_UPDATED,
        itineraryId: itinerary.id,
        message: itinerary.title + ' saved',
        meta: {
          mixpanel: {
            event: 'Itinerary updated',
            props: {
              itineraryId: itinerary.id,
            }
          }
        }
      })
    }
  }
}

export function updateItineraryGeo(auth, itinerary, newGeo) {
  return dispatch => {
    if (itinerary && itinerary.id && itinerary.userId && newGeo && newGeo.placeId) {
      if (!isEqual(itinerary.geo, newGeo)) {
        let updates = {};
        let timestamp = Firebase.database.ServerValue.TIMESTAMP;

        // create an itinerary object to save at the new geo path
        let itineraryObject = Object.assign({}, {lastModified: timestamp}, {geo: newGeo}, 
          pick(itinerary, ['id', 'createdOn', 'description', 'images', 'reviewsCount', 'title']));

        // update all itinerary tables
        updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/geo`] = newGeo;
        updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/geo`] = newGeo;

        // update new itinerary-by-geo locations with the full itinerary objects
        updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${newGeo.placeId}/${itinerary.userId}/${itinerary.id}`] = itineraryObject;
        updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${newGeo.placeId}/${itinerary.id}`] = Object.assign({}, itineraryObject, {userId: itinerary.userId});

        // remove itineraries from old geo locations
        updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}`] = null;
        updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}`] = null;

        // update lastModified timestamps
        updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/lastModified`] = timestamp;
        updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/lastModified`] = timestamp;

        Firebase.database().ref().update(updates);

        dispatch({
          type: ActionTypes.ITINERARY_UPDATED,
          itineraryId: itinerary.id,
          message: 'Your guide has been updated',
          meta: {
            mixpanel: {
              event: 'Itinerary updated',
              props: {
                itineraryId: itinerary.id,
              }
            }
          }
        })
      }
    }
  }
}

export function updateReviewField(auth, itinerary, field, value, tip) {
  return dispatch => {
    if (auth && itinerary && itinerary.id && tip && tip.reviewId && tip.subjectId) {
      let updates = {};
      let timestamp = Firebase.database.ServerValue.TIMESTAMP;
      let userId = tip.userId ? tip.userId : auth;

      // update reviews, reviews-by-subject and reviews-by-user
      updates[`/${Constants.REVIEWS_PATH}/${tip.reviewId}/${field}`] = value;
      updates[`/${Constants.REVIEWS_BY_USER_PATH}/${auth}/${tip.reviewId}/${field}`] = value;
      updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${tip.subjectId}/${userId}/${field}`] = value;

      // update lastModified on all reviews
      updates[`/${Constants.REVIEWS_PATH}/${tip.reviewId}/lastModified`] = timestamp;
      updates[`/${Constants.REVIEWS_BY_USER_PATH}/${auth}/${tip.reviewId}/lastModified`] = timestamp;
      updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${tip.subjectId}/${userId}/lastModified`] = timestamp;

      // update lastModified on all itineraries
      updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/lastModified`] = timestamp;
      updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/lastModified`] = timestamp;
      updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/lastModified`] = timestamp;
      updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/lastModified`] = timestamp;

      Firebase.database().ref().update(updates);

      dispatch({
        type: ActionTypes.ITINERARY_UPDATED,
        itineraryId: itinerary.id,
        message: 'Updated your review for ' + tip.subject.title,
        meta: {
          mixpanel: {
            event: 'Itinerary updated',
            props: {
              itineraryId: itinerary.id,
            }
          }
        }
      })
    }
  }
}

export function updateItineraryFormErrors(field, value) {
  return dispatch => {
    dispatch({
      type: ActionTypes.UPDATE_ITINERARY_FORM_ERRORS,
      field,
      value
    })
  }
}

export function onAddTip(auth, result, itinerary) {
  return dispatch => {
    let lastModified = Firebase.database.ServerValue.TIMESTAMP;
    // let subject = Helpers.makeSubject(Object.assign({}, result), lastModified);
    let subjectId = '';
    let updates = {};

    let subject = {
      title: result.title,
      lastModified: lastModified
    }
    if (result.address) subject.address = result.address;
    if (result.internationalPhoneNumber) subject.internationalPhoneNumber = result.formattedPhoneNumber;
    if (result.hours) subject.hours = result.hours;
    if (result.permanentlyClosed) subject.permanentlyClosed = result.permanentlyClosed;
    if (result.website) subject.website = result.website;

    // create the subject
    // if no subject id returned from Google, this is a custom subject so save it
    if (!result.id) {
      subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push(subject).key;
    }
    else {
      // this is a google result, so use their place ID as the subject ID.
      // overwrite whatever the old subject info was
      subjectId = result.id;
      updates[`/${Constants.SUBJECTS_PATH}/${subjectId}`] = subject;

      // upload a default image if we dont have one yet
      if (result.defaultImage && result.defaultImage[0]) {
        Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).once('value', imageCheckSnap => {
          if (!imageCheckSnap.exists()) {
            let imageObject = {
              lastModified: Firebase.database.ServerValue.TIMESTAMP
            };
            imageObject.url = result.defaultImage[0];
            Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).push(imageObject);
          }
        })
      }
    }

    // see if user has reviewed this subject
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + auth).once('value', reviewsSnap => {
      let reviewId = '';
      if (reviewsSnap.exists()) {
        reviewId = reviewsSnap.val().reviewId;
      }
      else {
        // make the review
        let review = Object.assign({}, {subjectId: subjectId}, {lastModified: lastModified})

        reviewId = Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + auth).push(review).key;

        let reviewBySubject = Object.assign({}, {lastModified: lastModified}, {reviewId: reviewId});

        // update REVIEWS_BY_USER, REVIEWS_BY_SUBJECT, and REVIEWS tables
        updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${auth}/`] = reviewBySubject;
        updates[`/${Constants.REVIEWS_PATH}/${reviewId}/`] = Object.assign({}, review, { userId: auth })
      }

      let reviewsCount = itinerary.reviewsCount ? itinerary.reviewsCount : 0;
      let priority = itinerary.maxPriority ? itinerary.maxPriority + 1 : reviewsCount + 1;
      let tipObject = Object.assign({}, { subjectId: subjectId }, { reviewId: reviewId }, { userId: auth }, {priority: priority});
      
      let tipId = Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itinerary.id).push(tipObject).key;

      // update review counts on the itinerary
      Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + itinerary.userId + '/' + itinerary.id + '/reviewsCount').transaction(function (current_count) {
        return (current_count || 0) + 1;
      });
      Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itinerary.id + '/reviewsCount').transaction(function (current_count) {
        return (current_count || 0) + 1;
      });
      Firebase.database().ref(Constants.ITINERARIES_BY_GEO_BY_USER_PATH + '/' + itinerary.geo.placeId + '/' + itinerary.userId + '/' + itinerary.id + '/reviewsCount').transaction(function (current_count) {
        return (current_count || 0) + 1;
      });
      Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + itinerary.geo.placeId + '/' + itinerary.id + '/reviewsCount').transaction(function (current_count) {
        return (current_count || 0) + 1;
      });

      // update lastModified on all itineraries
      updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/lastModified`] = lastModified;
      updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/lastModified`] = lastModified;
      updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/lastModified`] = lastModified;
      updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/lastModified`] = lastModified;

      // update maxPriority on all itineraries
      updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/maxPriority`] = priority;
      updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/maxPriority`] = priority;
      updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/maxPriority`] = priority;
      updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/maxPriority`] = priority;

      Firebase.database().ref().update(updates);

      // dispatch({
      //   type: ActionTypes.ITINERARY_UPDATED
      // })
    })
  }
}

export function onDeleteTip(auth, tip, itineraryId, itinerary) {
  return dispatch => {
    // for every tip after deleted tip, subtract 1 from priority
    Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + tip.key).remove()
    .then(response => {
      // update tip counts
      Helpers.decrementItineraryCount(Constants.REVIEWS_COUNT, itineraryId, itinerary.geo, itinerary.userId);
      dispatch({
        type: ActionTypes.TIP_DELETED
      })
    })
  }
}

export function onReorderTips(auth) {
  return dispatch => {
    // move tip to correct priority, set priority of all tips after it
  }
}

// export function getItinerary(auth, itineraryId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
//       if (itinerarySnapshot.exists()) {
//         Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).on('value', reviewsListSnapshot => {
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
