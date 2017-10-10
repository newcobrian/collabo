import Firebase from 'firebase'
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'

export function getFeaturedPreview(auth) {
	return dispatch => {
		let index = Math.floor(Math.random() * Constants.FEATURED_GUIDES.length);
		let itineraryId = Constants.FEATURED_GUIDES[index];

		Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', snap => {
			Firebase.database().ref(Constants.USERS_PATH + '/' + snap.val().userId).once('value', userSnap => {
				Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itineraryId).on('value', likesSnapshot => {
					let featuredObject = Object.assign({}, {id: itineraryId}, snap.val(), {createdBy: userSnap.val()}, {isLiked: likesSnapshot.exists()})
					dispatch ({
						type: ActionTypes.GET_FEATURED_PREVIEW,
						featuredPreview: featuredObject
					})
				})
			})
		})
	}
}

export function unloadFeaturePreview(auth, itineraryId) {
	return dispatch => {
		if (auth && itineraryId) {
			Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itineraryId).off();
		}
	}
}

export function getPopularPreview(auth) {
	return dispatch => {
		let popularArray = [];
		Firebase.database().ref(Constants.ITINERARIES_PATH).orderByChild('popularityScore').limitToLast(Constants.POPULARITY_PAGE_COUNT).once('value', snap => {
			snap.forEach(function(itin) {
				Firebase.database().ref(Constants.USERS_PATH + '/' + itin.val().userId).once('value', userSnap => {
					let itineraryObject = Object.assign({}, {id: itin.key}, itin.val(), {createdBy: userSnap.val()})
					popularArray = [itineraryObject].concat(popularArray);
					dispatch ({
						type: ActionTypes.GET_POPULAR_PREVIEW,
						popularPreview: popularArray
					})
				})
			})
		})
	}
}

export function loadSampleGuides(auth) {
  return dispatch => {
    let feedArray = [];
    for (let i = 0; i < Constants.HOMEPAGE_SAMPLE_GUIDES.length; i++) {
      Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + Constants.HOMEPAGE_SAMPLE_GUIDES[i]).on('value', itinSnap => {
        Firebase.database().ref(Constants.USERS_PATH + '/' + itinSnap.val().userId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itinSnap.key).on('value', likesSnapshot => {
            const itineraryObject = {};
            const key = { id: itinSnap.key };
            const createdBy = { createdBy: Object.assign({}, userSnapshot.val(), {userId: itinSnap.val().userId}) };
            let likes = {
              isLiked: likesSnapshot.exists()
            }
            
            Object.assign(itineraryObject, itinSnap.val(), key, createdBy, likes);

            feedArray = [itineraryObject].concat(feedArray);

            dispatch({
              type: ActionTypes.GET_GLOBAL_FEED,
              payload: feedArray
            })
          })
        })
      })
    }
  }
}

export function unloadSampleGuides(auth) {
  return dispatch => {
    for (let i = 0; i < Constants.HOMEPAGE_SAMPLE_GUIDES.length; i++) {
      Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + Constants.HOMEPAGE_SAMPLE_GUIDES[i]).once('value', itinSnap => {
        Firebase.database().ref(Constants.USERS_PATH + '/' + itinSnap.val().userId).off();
        Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itinSnap.key).off();
      })
      Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + Constants.HOMEPAGE_SAMPLE_GUIDES[i]).off();
    }
    dispatch({
      type: ActionTypes.GLOBAL_FEED_UNLOADED
    })
  }
}

export function startFeedWatch(auth) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.HOME_PAGE_NO_AUTH
      })
    }
    watchLikesByUser(dispatch, auth, Constants.USER_FEED);
    watchFollowingFeed(dispatch, auth);
    watchItinerariesByUser(dispatch, auth)
    dispatch({
      type: ActionTypes.FEED_WATCH_LOADED
    })
  }
}

export function unloadFeedWatch(auth) {
  return dispatch => {
	  unwatchLikesByUser(dispatch, auth, Constants.USER_FEED);
	  unwatchItinerariesByUser(dispatch, auth);
	  unwatchFollowingFeed(dispatch, auth);

	  dispatch({
	  	type: ActionTypes.USER_FEED_UNLOADED
	  })
  }
}

export function watchFollowingFeed(dispatch, userId) {
  // when new follower added, watch the user's info and their itineraries
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).on('child_added', snap => {
    watchUser(dispatch, snap.key, Constants.USER_FEED);
    watchItinerariesByUser(dispatch, snap.key);
  })

  // on child_removed - unwatch all the listeners
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).on('child_removed', snap => {
    unwatchUser(dispatch, snap.key, Constants.USER_FEED);
    unwatchItinerariesByUser(dispatch, snap.key);
  })
}

export function unwatchFollowingFeed(dispatch, userId) {
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).once('value', snap => {
    snap.forEach(function(user) {
      Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + user.key).off();
      Firebase.database().ref(Constants.USERS_PATH + '/' + user.key).off();
    })
  })
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).off();

  dispatch({
    type: ActionTypes.USER_FEED_UNLOADED
  })
}

export function watchItinerariesByUser(dispatch, userId) {
  watchUser(dispatch, userId, Constants.USER_FEED);

  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('child_added', addedSnap => {
    dispatch(itineraryAddedAction(addedSnap.key, userId,  addedSnap.val()));
  })
  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('child_changed', changedSnap => {
    dispatch(itineraryChangedAction(changedSnap.key, changedSnap.val()));
  })
  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('child_removed', removedSnap => {
    dispatch(itineraryRemovedAction(removedSnap.key));
  })
}

export function unwatchItinerariesByUser(dispatch, userId) {
  unwatchUser(dispatch, userId, Constants.USER_FEED);

  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).off();
  dispatch(itineraryByUserRemovedAction(userId));
}

function itineraryByUserRemovedAction(userId) {
  return {
    type: ActionTypes.ITINERARIES_BY_USER_REMOVED_ACTION,
    userId
  }
}

function itineraryAddedAction(itineraryId, userId, itinerary) {
  return {
    type: ActionTypes.ITINERARY_ADDED_ACTION,
    itineraryId,
    userId,
    itinerary
  }
}

function itineraryChangedAction(itineraryId, itinerary) {
  return {
    type: ActionTypes.ITINERARY_CHANGED_ACTION,
    itineraryId,
    itinerary
  }
}

function itineraryRemovedAction(itineraryId) {
  return {
    type: ActionTypes.ITINERARY_REMOVED_ACTION,
    itineraryId
  }
}

export function watchUser(dispatch, userId, source) {
  Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', snap => {
    dispatch(userAddedAction(userId, snap.val(), source));
  })
}

export function unwatchUser(dispatch, userId, source) {
  dispatch(userRemovedAction(userId, source));
  Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
}

function userAddedAction(userId, user, source) {
  return {
    type: ActionTypes.USER_VALUE_ACTION,
    userInfo: user,
    userId: userId,
    source: source
  }
}

function userRemovedAction(userId, source) {
  return {
    type: ActionTypes.USER_REMOVED_ACTION,
    userId,
    source
  }
}

export function watchLikesByUser(dispatch, userId, source) {
  Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).on('child_added', snap => {
    dispatch(likesByUserAddedAction(snap.key, source));
  })
  Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).on('child_removed', snap => {
    dispatch(likesByUserRemovedAction(snap.key, source));
  })
}

export function unwatchLikesByUser(dispatch, userId) {
  Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).off();
}

function likesByUserAddedAction(objectId, source) {
  return {
    type: ActionTypes.LIKES_BY_USER_ADDED_ACTION,
    objectId,
    source
  }
}

function likesByUserRemovedAction(objectId, source) {
  return {
    type: ActionTypes.LIKES_BY_USER_REMOVED_ACTION,
    objectId,
    source
  }
}

export function watchPopularFeed(auth, page, score, key) {
  return dispatch => {
    // watchUser(dispatch, auth, Constants.USER_FEED);
    watchLikesByUser(dispatch, auth, Constants.USER_FEED);

 //    if (score && key) {
 //    	dispatch({
	//     	type: ActionTypes.LOADED_POPULAR_FEED,
	//     	popularPage: page
	//     })
 //    	// if we're doing pagination, then need to pass endAt
	//     Firebase.database().ref(Constants.ITINERARIES_PATH)
	//     	.orderByChild('popularityScore')
	//     	.endAt(score, key)
	//     	.limitToLast(Constants.POPULARITY_PAGE_COUNT)
	//     	.on('child_added', addedSnap => {
	//       watchUser(dispatch, addedSnap.val().userId, Constants.USER_FEED);
	//       dispatch(itineraryAddedAction(addedSnap.key, addedSnap.val().userId,  addedSnap.val()));
	//     })
	//     Firebase.database().ref(Constants.ITINERARIES_PATH).on('child_changed', changedSnap => {
	//       dispatch(itineraryChangedAction(changedSnap.key, changedSnap.val()));
	//     })
	//     Firebase.database().ref(Constants.ITINERARIES_PATH).on('child_removed', removedSnap => {
	//       dispatch(itineraryRemovedAction(removedSnap.key));
	//     })

	    
	// }
	// else {
		// otherwise this is the first call, so just get the first page
		Firebase.database().ref(Constants.ITINERARIES_PATH)
	    	.orderByChild('popularityScore')
	    	.limitToLast(Constants.POPULARITY_PAGE_COUNT)
	    	.on('child_added', addedSnap => {
	      watchUser(dispatch, addedSnap.val().userId, Constants.USER_FEED);
	      dispatch(itineraryAddedAction(addedSnap.key, addedSnap.val().userId,  addedSnap.val()));
	    })
	    Firebase.database().ref(Constants.ITINERARIES_PATH).on('child_changed', changedSnap => {
	      dispatch(itineraryChangedAction(changedSnap.key, changedSnap.val()));
	    })
	    Firebase.database().ref(Constants.ITINERARIES_PATH).on('child_removed', removedSnap => {
	      dispatch(itineraryRemovedAction(removedSnap.key));
	    })
	}
  // }
}

export function unwatchPopularFeed(auth) {
  return dispatch => {
    unwatchLikesByUser(dispatch, auth, Constants.USER_FEED);

    Firebase.database().ref(Constants.ITINERARIES_PATH).orderByChild('popularityScore').limitToLast(Constants.POPULARITY_PAGE_COUNT).once('child_added', addedSnap => {
      unwatchUser(dispatch, addedSnap.val().userId, Constants.USER_FEED);
    })
    Firebase.database().ref(Constants.ITINERARIES_PATH).orderByChild('popularityScore').limitToLast(Constants.POPULARITY_PAGE_COUNT).off(); 

    dispatch({
    	type: ActionTypes.UNLOAD_POPULAR_FEED
    })
  }
}