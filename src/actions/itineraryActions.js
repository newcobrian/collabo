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

        // dispatch itinerary data
        dispatch(itineraryValueAction(itinerarySnapshot.val(), itineraryId, itinerarySnapshot.val().userId, Constants.ITINERARY_PAGE));
      }
      else {
        dispatch({
          type: ActionTypes.ITINERARY_NOT_FOUND
        })
      }
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

export function unloadReorderModal(itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).off();
    // dispatch({
    //   type: ActionTypes.UNLOAD_REORDER_MODAL,
    //   itineraryId
    // })
  }
}

export function watchTips(dispatch, itineraryId, itineraryUserId, source) {
  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).orderByChild('priority').on('child_added', tipSnapshot => {
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
  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).orderByChild('priority').on('child_changed', tipSnapshot => {
    watchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
    watchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
    watchComments(dispatch, tipSnapshot.key, source);
    watchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
    watchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    dispatch(tipChangedAction(tipSnapshot.key, tipSnapshot.val(), source));
  })

  Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).orderByChild('priority').on('child_removed', tipSnapshot => {
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
    if (tipSnapshot.exists() && tipSnapshot.val().userId !== itineraryUserId) {
      unwatchUser(dispatch, tipSnapshot.val().userId, source)
      unwatchSubject(dispatch, tipSnapshot.key, tipSnapshot.val().subjectId, source);
      unwatchReview(dispatch, tipSnapshot.key, tipSnapshot.val().reviewId, source);
      unwatchComments(dispatch, tipSnapshot.key, source);
      unwatchImagesByUser(dispatch, itineraryUserId, tipSnapshot.val().subjectId, source);
      unwatchDefaultImages(dispatch, tipSnapshot.val().subjectId, source);
    }
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

      if (field === 'title') {
        for (let i = 0; i < itinerary.tips.length; i++) {
          let userId = itinerary.tips[i].userId ? itinerary.tips[i].userId : itinerary.userId;
          updates[`/${Constants.TIPS_BY_SUBJECT_PATH}/${itinerary.tips[i].subjectId}/${userId}/${itinerary.tips[i].key}/title`] = value;
        }
      }

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
        Firebase.database().ref(Constants.GEOS_PATH + '/' + newGeo.placeId).once('value', geoSnapshot => {
          Firebase.database().ref(Constants.COUNTRIES_PATH + '/' + newGeo.country + '/places/' + newGeo.placeId).once('value', countrySnapshot => {
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

            // add geo to the geo table if it doesnt exists
            if (!geoSnapshot.exists() || !geoSnapshot.val().fulLCountry) {
              let geoObject = {
                location: newGeo.location,
                label: newGeo.label
              }
              if (newGeo.country) geoObject.country = newGeo.country;
              if (newGeo.fullCountry) geoObject.fullCountry = newGeo.fullCountry;
              updates[`/${Constants.GEOS_PATH}/${newGeo.placeId}`] = geoObject;

              Helpers.updateAlgloiaGeosIndex(newGeo);
            }

            // if place ID isn't in countries table, add it
            if (!countrySnapshot.exists()) {
              updates[`/${Constants.COUNTRIES_PATH}/${newGeo.country}/places/${newGeo.placeId}`] = true;
            }

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
          })
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
    if (result.location) subject.location = result.location;
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
      if (reviewsSnap.exists() && reviewsSnap.val().reviewId) {
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

      // update tips by subject
      updates[`/${Constants.TIPS_BY_SUBJECT_PATH}/${subjectId}/${auth}/${tipId}/`] = Object.assign({}, {itineraryId: itinerary.id}, {title: itinerary.title});

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

      Helpers.incrementGuideScore(itinerary.id, Constants.ADD_TIP_GUIDE_SCORE)

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
      // update tips by subject
      Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + tip.subjectId + '/' + auth + '/' + tip.key).remove();

      // decerement popularity score
      Helpers.decrementGuideScore(itinerary.id, Constants.ADD_TIP_GUIDE_SCORE)

      // update tip counts
      Helpers.decrementItineraryCount(Constants.REVIEWS_COUNT, itineraryId, itinerary.geo, itinerary.userId);

      Helpers.decrementGuideScore(itineraryId, Constants.ADD_TIP_GUIDE_SCORE)

      dispatch({
        type: ActionTypes.TIP_DELETED
      })
    })
  }
}

export function onReorderTips(itinerary, oldIndex, newIndex) {
  return dispatch => {
    let updates = {};
    let moveTipId = itinerary.tips[oldIndex].key;

    // if moving to the last spot, set priority to 1 above priority of last item
    if (newIndex === itinerary.tips.length-1) {
      let newPriority = itinerary.tips[newIndex].priority;
      // set new priority to same priority of last item
      updates[`/${Constants.TIPS_BY_ITINERARY_PATH}/${itinerary.id}/${moveTipId}/priority`] = newPriority;
      // set priority of last item to halfway between last item and the item before
      updates[`/${Constants.TIPS_BY_ITINERARY_PATH}/${itinerary.id}/${itinerary.tips[newIndex].key}/priority`] = (newPriority + itinerary.tips[newIndex-1].priority)/2;
      
      // // set maxPriority on all itineraries
      // updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/maxPriority`] = newPriority;
      // updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/maxPriority`] = newPriority;
      // updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/maxPriority`] = newPriority;
      // updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/maxPriority`] = newPriority;
    }
    else if (newIndex === 0) {
      // if moving to 1st spot, just set priority to half of 1st items priority
      let newPriority = itinerary.tips[0].priority / 2;
      updates[`/${Constants.TIPS_BY_ITINERARY_PATH}/${itinerary.id}/${moveTipId}/priority`] = newPriority;
    }
    else {
      // otherwise, set priority to halfway between item before and item after's priorities
      let newPriority = (itinerary.tips[newIndex].priority + itinerary.tips[newIndex-1].priority) / 2;
      updates[`/${Constants.TIPS_BY_ITINERARY_PATH}/${itinerary.id}/${moveTipId}/priority`] = newPriority;
    }
    Firebase.database().ref().update(updates);
  } 
}

export function onSelectActiveTip(subject) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SELECT_ACTIVE_TIP,
      activeTipTitle: subject.title,
      activeTipPosition: subject.location
    })
  }
}

export function loadRelatedItineraries(auth, itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', currentItinSnap => {
      if (currentItinSnap.exists() && currentItinSnap.val().geo && currentItinSnap.val().geo.placeId) {
        Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth).on('value', likesSnap => {
          Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).once('value', followSnap => {
            let allItineraries = [];
            let friendCount = followSnap.numChildren();
            let fc = 0;
            followSnap.forEach(function(friend) {
              Firebase.database().ref(Constants.ITINERARIES_BY_GEO_BY_USER_PATH + '/' + currentItinSnap.val().geo.placeId + '/' + friend.key).once('value', itinSnap => {
                let itinCount = itinSnap.numChildren();
                let ic = 0;
                fc++;
                itinSnap.forEach(function(itin) {
                  ic++;
                  if (itineraryId !== itin.key) {
                    allItineraries = allItineraries.concat(Object.assign({}, {id: itin.key}, itin.val(), {userId: friend.key}))
                  }
                  // if this is the last itinerary, then put together data to dispatch
                  if (fc === friendCount && ic === itinCount) {
                    allItineraries.sort(Helpers.lastModifiedDesc)
                    let numRelated = allItineraries.length;
                    let showItineraries = [];
                    let maxItins = allItineraries.length < 3 ? allItineraries.length : 3;
                    let dispatchCounter = 0;
                    for (let i = 0; i < maxItins; i++) {
                      Firebase.database().ref(Constants.USERS_PATH + '/' + allItineraries[i].userId).once('value', userSnap => {
                        let itinId = allItineraries[i].id;
                        let isLiked = (likesSnap.exists() && likesSnap.val()[itinId]) ? true : false
                        showItineraries = showItineraries.concat(Object.assign({}, allItineraries[i], {isLiked: isLiked}, {createdBy: userSnap.val()}))
                        dispatchCounter++;
                        if (dispatchCounter === maxItins) {
                          dispatch({
                            type: ActionTypes.LOAD_RELATED_ITINERARIES,
                            relatedItineraries: showItineraries,
                            numRelated: numRelated
                          })
                        }
                      })
                    }
                  }
                })
              })
            })
          })
        })
      }
    })
  }
}

export function unloadRelatedItineraries(auth) {
  return dispatch => {
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth).off()
    dispatch({
      type: ActionTypes.UNLOAD_RELATED_ITINERARIES
    })
  }
}

// export function onCloseInfoWindow() {
//   return dispatch => {
//     dispatch({
//       type: ActionTypes.CLOSE_INFO_WINDOW,
//       showingInfoWindow: false
//     })
//   }
// }

// export function setInitialMapCenter(itinerary) {
//   return dispatch => {
//     // console.log('itin = ' + JSON.stringify(itinerary))
//     let mapCenter = itinerary.geo.location;
// // console.log('itin in action = ' + JSON.stringify(itinerary))
//     if (itinerary && itinerary.tips) {
//       for (let i = 0; i < itinerary.tips.length; i++) {
//         console.log(JSON.stringify(itinerary.tips[i].subject))
//         if (itinerary.tips[i].subject && itinerary.tips[i].subject.location) {
//           console.log('in if')
//           mapCenter = itinerary.tips[i].subject.location;
//           console.log('map center action = ' + JSON.stringify(mapCenter))
//           break;
//         }
//       }
//     }
//     dispatch({
//       type: ActionTypes.SET_DEFAULT_MAP_VALUE,
//       payload: mapCenter
//     })
//   }
// }

// export function unmountMap() {
//   return dispatch => {
//     dispatch({
//       type: ActionTypes.UNMOUNT_MAP
//     })
//   }
// }

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
