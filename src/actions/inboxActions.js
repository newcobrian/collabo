import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'

export function checkEndOfInbox(dispatch, auth, dateIndex) {
  let endAt = dateIndex ? dateIndex : Firebase.database.ServerValue.TIMESTAMP.toString();

  Firebase.database().ref(Constants.INBOX_PATH + '/' + auth)
    .orderByChild('lastModified')
    .limitToLast(Constants.INBOX_FEED_COUNT)
    .endAt(endAt)
    .once('value', snap => {
      if (snap.numChildren() < Constants.INBOX_FEED_COUNT) {
        dispatch({
          type: ActionTypes.END_OF_INBOX_FEED
        })
      }
  })
}

export function getInbox(authenticated, dateIndex) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    let endAt = dateIndex ? dateIndex : Firebase.database.ServerValue.TIMESTAMP.toString();
    let inboxArray = [];

    checkEndOfInbox(dispatch, authenticated, endAt)

    Firebase.database().ref(Constants.INBOX_PATH + '/' + authenticated)
    .orderByChild('lastModified')
    .limitToLast(Constants.INBOX_FEED_COUNT)
    .endAt(endAt)
    .on('child_added', inboxSnapshot => {
      if (!inboxSnapshot.exists()) {
        dispatch({
          type: ActionTypes.GET_INBOX_ITEM,
          payload: []
        })
      }

      Firebase.database().ref(Constants.USERS_PATH + '/' + inboxSnapshot.val().senderId).once('value', senderSnapshot => {
        let inboxObject = inboxSnapshot.val();
        inboxObject.key = inboxSnapshot.key;
        inboxObject.senderUsername = senderSnapshot.val().username;
        inboxObject.senderImage = senderSnapshot.val().image;

        inboxArray = [inboxObject].concat(inboxArray);
        inboxArray.sort(Helpers.lastModifiedDesc);

        dispatch({
          type: ActionTypes.GET_INBOX_ITEM,
          // payload: inboxArray,
          payload: inboxObject
        })
      })
    })
  }
}

export function unloadInbox(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.INBOX_PATH + '/' + userId).once('value', inboxSnapshot => {
      inboxSnapshot.forEach(function(inboxChild) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + inboxChild.val().senderId).off();
      })
    })
    Firebase.database().ref(Constants.INBOX_PATH + '/' + userId).off();

    dispatch({
      type: ActionTypes.INBOX_UNLOADED
    })
  }
}

export function getInboxCount(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + userId).on('value', inboxSnapshot => {
      if (inboxSnapshot.exists()) {
        const messageCount = inboxSnapshot.val().messageCount ? inboxSnapshot.val().messageCount : 0;
        const messagesRead = inboxSnapshot.val().messagesRead ? inboxSnapshot.val().messagesRead : 0;
        dispatch({
          type: ActionTypes.GET_INBOX_COUNT,
          payload: messageCount - messagesRead
        })
      }
      else dispatch({
        type: ActionTypes.GET_INBOX_COUNT,
        payload: 0
      })
    })
  }
}

export function updateInboxCount(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + userId + '/messageCount').once('value', countSnapshot => {
      if (countSnapshot.exists()) {
        const update = { messagesRead: countSnapshot.val() };
        Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + userId).update(update);
        dispatch({
          type: ActionTypes.INBOX_COUNT_UPDATED
        })
      }
    })
  }
}