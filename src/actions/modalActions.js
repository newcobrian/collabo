import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'

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
          Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + uid).once('value', snapshot => {
            let itineraryList = [];
            snapshot.forEach(function(itinerary) {
              let item = {
                title: itinerary.val().title,
                userId: uid,
                itineraryId: itinerary.key,
                geo: itinerary.val().geo
              }
              itineraryList.push(item);
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

export function showCreateRecs(recId) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_CREATE_RECS_MODAL,
      recId: recId
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
		console.log('geo = ' + JSON.stringify(geo))
		console.log('title = ' + title)

		// create itinerary

		// create recommedation entry

		// take user to next modal with recID
	}
}