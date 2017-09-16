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
		Firebase.database().ref(Constants.ITINERARIES_PATH).orderByChild('popularityScore').limitToLast(Constants.HOMEPAGE_POPULAR_COUNT).once('value', snap => {
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