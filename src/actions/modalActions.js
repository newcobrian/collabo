import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'

export function showDeleteModal(itinerary, source) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_DELETE_ITINERARY_MODAL,
      modalType: Constants.DELETE_ITINERARY_MODAL,
      itinerary: itinerary,
      source: source
    })
  }
}

export function showReorderModal(itinerary) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_REORDER_ITINERARY_MODAL,
      itinerary
    })
  }
}

export function showShareModal(itinerary) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_SHARE_MODAL,
      itinerary
    })
  }
}

export function showChangeEmailModal() {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_CHANGE_EMAIL_MODAL
    })
  }
}

export function loadReorderModal(itinerary) {
  return dispatch => {
    Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itinerary.id).on('value', snap => {
      if (itinerary.tips) {
        snap.forEach(function(tip) {
          for (let i = 0; i < itinerary.tips.length; i++) {
            if (itinerary.tips[i].key === tip.key) {
              itinerary.tips[i].priority = tip.val().priority;
              dispatch({
                type: ActionTypes.LOAD_REORDER_MODAL,
                itinerary: itinerary
              })
              break;
            }
          }
        })
      }
    })
  }
}

export function showNewItineraryModal(auth, review) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_NEW_ITINERARY_MODAL,
      auth: auth,
      review: review
    })
  }
}

export function showModal(type, review, images) {
  return dispatch => {
    const currentUser = Firebase.auth().currentUser;
    if (!currentUser) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else {
      const uid = currentUser.uid;
      switch (type) {
        case Constants.SAVE_MODAL:
          Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + uid).orderByChild('lastModified').once('value', snapshot => {
            let itineraryList = [];
            snapshot.forEach(function(itinerary) {
              let item = {
                title: itinerary.val().title,
                userId: uid,
                itineraryId: itinerary.key,
                geo: itinerary.val().geo
              }
              itineraryList = [item].concat(itineraryList);
            })
            dispatch({
              type: ActionTypes.SHOW_MODAL,
              modalType: Constants.SAVE_MODAL,
              images: images,
              itinerariesList: itineraryList,
              review: review
            })
          })
          break;
      // case REVIEW_MODAL:
      //   if (review) {
      //     const subjectId = review.subjectId;
      //     const subject = Object.assign({}, review.subject);

      //     Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + uid).once('value', snapshot => {
      //       if (snapshot.exists()) {
      //         Firebase.database().ref(Constants.REVIEWS_PATH + '/' + snapshot.val().reviewId).once('value', reviewSnapshot => {
      //           dispatch({
      //             type: SHOW_MODAL,
      //             modalType: type,
      //             subject: subject,
      //             review: reviewSnapshot.exists() ? reviewSnapshot.val() : null,
      //             reviewId: reviewSnapshot.exists() ? reviewSnapshot.key : null,
      //             subjectId: subjectId,
      //             rating: reviewSnapshot.exists() ? reviewSnapshot.val().rating : null,
      //             caption: reviewSnapshot.exists() ? reviewSnapshot.val().caption : null,
      //             image: Helpers.getImagePath(subject.images)
      //           })
      //         })
      //       }
      //       else {
      //         dispatch({
      //           type: SHOW_MODAL,
      //           modalType: type,
      //           subject: subject,
      //           subjectId: subjectId,
      //           image: Helpers.getImagePath(subject.images)
      //         })
      //       }
      //     })
      //   }
      //   break;
      default:
        dispatch({
          type: ActionTypes.SHOW_MODAL,
          modalType: type,
          review: review
        })
      }
    }
  }
}

export function showCreateRecs() {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_CREATE_RECS_MODAL
    })
  }
}

export function hideModal(type) {
  return dispatch => {
    dispatch({
      type: ActionTypes.HIDE_MODAL
    })
  }
}

export function onCreateRecsSubmit(auth, geo, title) {
	return dispatch => {
		let itinerary = {
			geo: Object.assign({}, geo),
			title: title
		}

		// // create itinerary
		Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId).once('value', geoSnapshot => {
      Firebase.database().ref(Constants.COUNTRIES_PATH + '/' + itinerary.geo.country + '/places/' + itinerary.geo.placeId).once('value', countrySnapshot => {
        let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
        let itineraryObject = {
          lastModified: serverTimestamp,
          createdOn: serverTimestamp
        }
        let updates = {};
        Object.assign(itineraryObject, itinerary)

        let itineraryId = Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth).push(itineraryObject).key;

        updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${auth}/${itineraryId}`] = itineraryObject;
        updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}`] = Object.assign({}, itineraryObject, {userId: auth}, {popularityScore: 0});
        updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}`] = Object.assign({}, itineraryObject, {userId: auth}, {popularityScore: 0});

        // add geo to the geo table if it doesnt exists
        if (!geoSnapshot.exists() || !geoSnapshot.val().fullCountry) {
          let geoObject = {
            location: itinerary.geo.location,
            label: itinerary.geo.label,
            itineraryCount: 1
          }
          if (itinerary.geo.country) geoObject.country = itinerary.geo.country;
          if (itinerary.geo.fullCountry) geoObject.fullCountry = itinerary.geo.fullCountry;
          if (itinerary.geo.shortName) geoObject.shortName = itinerary.geo.shortName;
          updates[`/${Constants.GEOS_PATH}/${itinerary.geo.placeId}`] = geoObject;
        }
        // otherwise just increment itineraryCount for geo
        else {
          // increment itinerary count on geo
          Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId + '/itineraryCount').transaction(function (current_count) {
            return (current_count || 0) + 1;
          });
        }

        if (!countrySnapshot.exists()) {
          updates[`/${Constants.COUNTRIES_PATH}/${itinerary.geo.country}/places/${itinerary.geo.placeId}`] = true;
        }

        // make the update and update all of user's followers with the new guide
        Firebase.database().ref().update(updates);
        Helpers.fanOutToFollowersFeed(auth, itineraryId, serverTimestamp)

        // update Algolia index
        Helpers.updateAlgloiaGeosIndex(itinerary.geo)

        mixpanel.people.increment("total itineraries");
        mixpanel.people.set({ "last itinerary created": (new Date()).toISOString() });
        mixpanel.identify(auth);

        dispatch({
          type: ActionTypes.RECOMMENDATION_ITINERARY_CREATED,
          itineraryId: itineraryId,
          itinerary: itineraryObject,
          meta: {
            mixpanel: {
              event: 'itinerary created',
              source: 'create recs modal',
              itineraryId: itineraryId,
              geo: itinerary.geo.placeId
            }
          }
        })
      })
    })
	}
}