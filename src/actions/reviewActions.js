import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'

export function getSubject(subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnapshot => {
      Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', imageSnapshot => {
        let subject = Object.assign({}, subjectSnapshot.val(), 
          { images: Helpers.getImagePath(imageSnapshot.val()) } );
        
        dispatch({
          type: ActionTypes.GET_SUBJECT,
          payload: subject
        })
      })
    })
  }
}

export function unloadSubject(subjectId) {
  Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
  Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).off();
  
  return dispatch => {
    dispatch({
      type: ActionTypes.SUBJECT_UNLOADED
    });
  }
}

export function getAppUserReview(authenticated, currentUserInfo, subjectId) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ActionTypes.GET_APP_USER_REVIEW,
        payload: {}
      })
    }
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + authenticated).on('value', reviewSnapshot => {
      if (!reviewSnapshot.exists()) {
        dispatch({
          type: ActionTypes.GET_REVIEW,
          payload: null
        })
      }
      else {
        Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewSnapshot.val().reviewId).on('value', likesSnapshot => {
          Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewSnapshot.val().reviewId).on('value', savesSnapshot => {
            let review = reviewSnapshot.val();
            review.id = reviewSnapshot.key;
            review.reviewer = currentUserInfo;

            review.isLiked = false
            if (likesSnapshot.val()) {
              review.isLiked = Helpers.searchLikes(authenticated, likesSnapshot.val());
            }

            review.isSaved = savesSnapshot.exists();

            dispatch({
              type: ActionTypes.GET_APP_USER_REVIEW,
              payload: review
            });
          })
        })
      }
    })
  }
}

export function unloadAppUserReview(authenticated, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + authenticated).once('value', reviewSnapshot => {
      if (reviewSnapshot.exists()) {
        Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewSnapshot.val().reviewId).off();
        Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewSnapshot.val().reviewId).off();
      }
    })
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + authenticated).off();
    dispatch({
      type: ActionTypes.APP_USER_REVIEW_UNLOADED
    })
  }
}

export function getFollowingReviews(auth, subjectId) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.GET_FOLLOWING_REVIEWS,
        payload: []
      })
    }
    let reviewArray = [];
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnapshot => {
      Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).on('value', followingSnapshot => {
        followingSnapshot.forEach(function(followingChild) {
          Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).on('value', reviewSnapshot => {
            if (reviewSnapshot.exists()) {
              Firebase.database().ref(Constants.USERS_PATH + '/' + followingChild.key).once('value', userSnapshot => {
                Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).on('value', tipsByUserSnap => {
                  Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + followingChild.key + '/' + subjectId).on('value', imagesSnapshot => {
                    Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', defaultImagesSnapshot => {
                      let reviewObject = {};

                      let itineraries = [];
                      if (tipsByUserSnap.exists()) {
                        tipsByUserSnap.forEach(function(tip) {
                          itineraries = itineraries.concat(Object.assign({}, {tipId: tip.key}, tip.val()));
                        })
                      }

                      let images = imagesSnapshot.exists() ? Helpers.getImagePath(imagesSnapshot.val()) : Helpers.getImagePath(defaultImagesSnapshot.val());

                      Object.assign(reviewObject, {subject: subjectSnapshot.val()}, {subjectId: subjectSnapshot.key}, 
                        {review: reviewSnapshot.val()}, {reviewId: reviewSnapshot.val().reviewId},
                        { createdBy: userSnapshot.val() }, {itineraries: itineraries}, {images: images} );
                      reviewArray = [reviewObject].concat(reviewArray);
                      reviewArray.sort(Helpers.lastModifiedDesc);

                      dispatch({
                        type: ActionTypes.GET_FOLLOWING_REVIEWS,
                        payload: reviewArray
                      })
                    })
                  })
                })
              })
            }
          })
        })
      })
    })
  }
}

export function unloadFollowingReviews(auth, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).once('value', followingSnapshot => {
      followingSnapshot.forEach(function(followingChild) {
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).once('value', reviewSnapshot => {
          if (reviewSnapshot.exists()) {
            Firebase.database().ref(Constants.USERS_PATH + '/' + followingChild.key).off();
            Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).off();
          }
        })
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).off();
      })
      Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).off();
    })

    dispatch({
      type: ActionTypes.FOLLOWING_REVIEWS_UNLOADED
    })
  }
}

export function getAllReviews(auth, subjectId) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.GET_ALL_REVIEWS,
        payload: []
      })
    }
    let reviewArray = [];
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnapshot => {
      Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).on('value', followingSnapshot => {
        let isFollowingCheck = {};
        followingSnapshot.forEach(function(followingChild) {
          isFollowingCheck[followingChild.key] = true;
        })
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId).on('value', reviewSnapshot => {
          reviewSnapshot.forEach(function(userReview) {
            if (!isFollowingCheck[userReview.key] && userReview.key !== auth) {
              Firebase.database().ref(Constants.USERS_PATH + '/' + userReview.key).once('value', userSnapshot => {
                Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userReview.key).on('value', tipsByUserSnap => {
                  Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userReview.key + '/' + subjectId).on('value', imagesSnapshot => {
                    Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', defaultImagesSnapshot => {
                      let reviewObject = {};

                      let itineraries = [];
                      if (tipsByUserSnap.exists()) {
                        tipsByUserSnap.forEach(function(tip) {
                          itineraries = itineraries.concat(Object.assign({}, {tipId: tip.key}, tip.val()));
                        })
                      }

                      let images = imagesSnapshot.exists() ? Helpers.getImagePath(imagesSnapshot.val()) : Helpers.getImagePath(defaultImagesSnapshot.val());

                      Object.assign(reviewObject, {subject: subjectSnapshot.val()}, {subjectId: subjectSnapshot.key}, 
                        {review: userReview.val()}, {reviewId: reviewSnapshot.val().reviewId},
                        { createdBy: userSnapshot.val() }, {itineraries: itineraries}, {images: images} );
                      reviewArray = [reviewObject].concat(reviewArray);
                      reviewArray.sort(Helpers.lastModifiedDesc);

                      dispatch({
                        type: ActionTypes.GET_ALL_REVIEWS,
                        payload: reviewArray
                      })
                    })
                  })
                })
              })
            }
          })
        })
      })
    })
  }
}

export function unloadAllReviews(auth, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).once('value', followingSnapshot => {
      let isFollowingCheck = {};
      followingSnapshot.forEach(function(followingChild) {
        isFollowingCheck[followingChild.key] = true;
      })
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId).once('value', reviewSnapshot => {
        reviewSnapshot.forEach(function(userReview) {
          if (!isFollowingCheck[userReview.key] && userReview.key !== auth) {
            Firebase.database().ref(Constants.USERS_PATH + '/' + userReview.key).off()
            Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userReview.key).off()
            Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userReview.key + '/' + subjectId).off()
            Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).off()
          }
        })
      })
    })

    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId).off();
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).off();

    dispatch({
      type: ActionTypes.FOLLOWING_REVIEWS_UNLOADED
    })
  }
}

export function getUserReview(auth, userId, subjectId) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.GET_USER_REVIEW,
        payload: {}
      })
    }
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnapshot => {
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).on('value', reviewSnapshot => {
        if (reviewSnapshot.exists()) {
          Firebase.database().ref(Constants.USERS_PATH + '/' + userId).once('value', userSnapshot => {
            Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).on('value', tipsByUserSnap => {
              Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userId + '/' + subjectId).on('value', imagesSnapshot => {
                Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', defaultImagesSnapshot => {
                  let reviewObject = {};

                  let images = imagesSnapshot.exists() ? Helpers.getImagePath(imagesSnapshot.val()) : Helpers.getImagePath(defaultImagesSnapshot.val());

                  let itineraries = [];
                  if (tipsByUserSnap.exists()) {
                    tipsByUserSnap.forEach(function(tip) {
                      itineraries = itineraries.concat(Object.assign({}, {tipId: tip.key}, tip.val()));
                    })
                  }

                  Object.assign(reviewObject, {subject: subjectSnapshot.val()}, {subjectId: subjectSnapshot.key}, 
                    {review: reviewSnapshot.val()}, {reviewId: reviewSnapshot.val().reviewId},
                    { createdBy: userSnapshot.val() }, {images: images}, {itineraries: itineraries} );
                  
                  dispatch({
                    type: ActionTypes.GET_USER_REVIEW,
                    payload: reviewObject
                  })
                })
              })
            })
          })
        }
      })
    })
  }
}

export function unloadUserReview(auth, userId, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).once('value', subjectSnapshot => {
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).once('value', reviewSnapshot => {
        if (reviewSnapshot.exists()) {
          Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
          Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).off();
          Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userId + '/' + subjectId).off();
          Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).off();
        }
      })
    })
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).off();

    dispatch({
      type: ActionTypes.UNLOAD_USER_REVIEW
    })
  }
}