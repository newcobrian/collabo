import Firebase from 'firebase'
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import { isEqual, pick } from 'lodash'
import mixpanel from 'mixpanel-browser'

export function checkFollowing(auth, profile) {
  return dispatch => {
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth + '/' + profile).on('value', snapshot => {
      let isFollowing = snapshot.exists() ? true : false;
      dispatch({
        type: ActionTypes.IS_FOLLOWING,
        payload: isFollowing
      });
    });
  };
}

export function getFollowingCount(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).once('value', snapshot => {
      dispatch({
        type: ActionTypes.GET_FOLLOWING_COUNT,
        payload: snapshot.numChildren()
      })
    })
  }
}

export function getFollowerCount(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.HAS_FOLLOWERS_PATH + '/' + userId).once('value', snapshot => {
      dispatch({
        type: ActionTypes.GET_FOLLOWER_COUNT,
        payload: snapshot.numChildren()
      })
    })
  }
}

export function getProfileCounts(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.HAS_FOLLOWERS_PATH + '/' + userId).once('value', followersSnap => {
      Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).once('value', followingSnap => {
        Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).once('value', guidesSnap => {
          Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).once('value', likesSnap => {
          	Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).once('value', reviewsSnap => {
	            dispatch({
	              type: ActionTypes.GET_PROFILE_COUNTS,
	              numFollowers: followersSnap.numChildren(),
	              numFollowing: followingSnap.numChildren(),
	              numGuides: guidesSnap.numChildren(),
	              numLikes: likesSnap.numChildren(),
	              numReviews: reviewsSnap.numChildren()
	            })
	        })
          })
        })
      })
    })
  }
}

export function getReviewsByUser(auth, userId) {
  return dispatch => {
    // watch user
    // watchUser(dispatch, userId, Constants.PROFILE_PAGE);
    // watchLikesByUser(dispatch, auth, Constants.PROFILE_PAGE);

    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).on('child_added', addedSnap => {
    	// watchSubject(dispatch, null, addedSnap.val().subjectId, Constants.PROFILE_PAGE);
    	Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + addedSnap.val().subjectId).once('value', subjectSnap => {
    		dispatch(reviewAddedAction(addedSnap.key, userId, addedSnap.val(), subjectSnap.val(), Constants.PROFILE_PAGE));
    	})
	})
	Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).on('child_changed', changedSnap => {
	    dispatch(reviewChangedAction(changedSnap.key, userId, changedSnap.val(), Constants.PROFILE_PAGE));
	})
	Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).on('child_removed', removedSnap => {
	    dispatch(reviewRemovedAction(removedSnap.key, Constants.PROFILE_PAGE));
	})
  }
}

function reviewAddedAction(reviewId, userId, review, subject, source) {
	return {
	    type: ActionTypes.REVIEW_ADDED_ACTION,
	    reviewId,
	    userId,
	    review,
	    subject,
	    source
	}
}

function reviewChangedAction(reviewId, userId, review, source) {
  return {
    type: ActionTypes.REVIEW_CHANGED_ACTION,
    reviewId,
    userId,
    review,
    source
  }
}

function reviewRemovedAction(reviewId, source) {
  return {
    type: ActionTypes.REVIEW_REMOVED_ACTION,
    reviewId,
    source
  }
}

// export function getReviewsByUser(auth, userId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).on('value', reviewsSnap => {
//       if (!reviewsSnap.exists()) {
//         dispatch({
//           type: ActionTypes.GET_REVIEWS_BY_USER,
//           payload: []
//         })
//       }
//       else {
//         let feedArray = [];
//         // watch user
//         Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', userSnapshot => {
//         	reviewsSnap.forEach(function(rev) {
//         		if (rev.val()) {
// 	          		Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + rev.subjectId).on('value', likesSnapshot => {
// 	          			Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + rev.subjectId).once('value', subjectSnapshot => {
// 	          				const reviewObject = {};
// 	          				const key = { id: rev.id };
// 	          				const createdBy = { createdBy: userSnapshot.val() };
// 	          				let likes = {
// 	          					isLiked: likesSnapshot.exists()
// 	          				}
// 	          				Object.assign(reviewObject, rev.val(), key, createdBy, likes, subjectSnapshot.val());

// 	          				feedArray = [reviewObject].concat(feedArray);
// 				            feedArray.sort(Helpers.lastModifiedDesc);
				              
// 				            dispatch({
// 				              type: ActionTypes.GET_REVIEWS_BY_USER,
// 				              payload: feedArray
// 				            })
// 	          			})
// 	          		})
// 	          	}
//           	})
//         })
//       }
//     })
//   }
// }

export function unloadReviewsByUser(auth, userId) {
	return dispatch => {
		Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).once('value', reviewsSnap => {
			if (reviewsSnap.exists()) {
				reviewsSnap.forEach(function(rev) {
					Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + rev.subjectId).off();
				})
				Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
			}
		})
		Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).off();

		dispatch({
			type: ActionTypes.REVIEWS_BY_USER_UNLOADED
		})
	}
}

export function getItinerariesByUser(auth, userId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('value', itinerariesSnapshot => {
      if (!itinerariesSnapshot.exists()) {
        dispatch({
          type: ActionTypes.GET_ITINERARIES_BY_USER,
          payload: []
        })
      }
      else {
        let feedArray = [];
        Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', userSnapshot => {
          itinerariesSnapshot.forEach(function(itin) {
            Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).on('value', likesSnapshot => {
              const itineraryObject = {};
              const key = { id: itin.key };
              const createdBy = { createdBy: userSnapshot.val() };
              createdBy.createdBy.userId = userId
              let likes = {
                isLiked: likesSnapshot.exists()
              }
              
              Object.assign(itineraryObject, itin.val(), key, createdBy, likes);

              // if (itin.val().subject && itin.val().subject.images) {
              //   reviewObject.subject.image = Helpers.getImagePath(itin.val().subject.images);
              // }

              feedArray = [itineraryObject].concat(feedArray);
              feedArray.sort(Helpers.lastModifiedDesc);
              // console.log('feed array = ' + JSON.stringify(feedArray))
              dispatch({
                type: ActionTypes.GET_ITINERARIES_BY_USER,
                payload: feedArray
              })
            })
          })
        })
      }
    })
  }
}

export function unloadItinerariesByUser(auth, userId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('value', itinerariesSnapshot => {
      if (itinerariesSnapshot.exists()) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
        itinerariesSnapshot.forEach(function(itin) {
          Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).off();
        })
      }
    })
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).off();

    dispatch({
      type: ActionTypes.ITINERARIES_BY_USER_UNLOADED
    });
  }
}