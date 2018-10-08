import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'

export function checkEndOfInbox(dispatch, auth, dateIndex, orgId) {
  let endAt = dateIndex ? dateIndex : Firebase.database.ServerValue.TIMESTAMP.toString();

  Firebase.database().ref(Constants.INBOX_PATH + '/' + auth + '/' + orgId)
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

export function getInbox(authenticated, dateIndex, orgId, orgName) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else if (!orgId) {
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName).once('value', orgSnap => {
        watchInbox(dispatch, authenticated, dateIndex, orgSnap.val().orgId)
      })
    }
    else {
      watchInbox(dispatch, authenticated, dateIndex, orgId);
    }
  }
}

export function watchInbox(dispatch, authenticated, dateIndex, orgId) {
  if (!authenticated) {
    dispatch({
      type: ActionTypes.ASK_FOR_AUTH
    })
  }

  let endAt = dateIndex ? dateIndex : Firebase.database.ServerValue.TIMESTAMP.toString();
  let inboxArray = [];

  checkEndOfInbox(dispatch, authenticated, endAt, orgId)

  Firebase.database().ref(Constants.INBOX_BY_USER_BY_ORG_PATH + '/' + authenticated + '/' + orgId).limitToLast(1).once('value', snap => {
    if (!snap.exists()) {
      dispatch({
        type: ActionTypes.INBOX_IS_EMPTY
      })
    }
  })

  Firebase.database().ref(Constants.INBOX_BY_USER_BY_ORG_PATH + '/' + authenticated + '/' + orgId)
  .orderByChild('lastModified')
  .limitToLast(Constants.INBOX_FEED_COUNT)
  .endAt(endAt)
  .on('child_added', inboxSnapshot => {
    if (inboxSnapshot.exists()) {
      Firebase.database().ref(Constants.USERS_PATH + '/' + inboxSnapshot.val().senderId).once('value', senderSnapshot => {
        if (senderSnapshot.exists()) {
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
        }
        else {
          console.log('no senderId = ' + inboxSnapshot.val().senderId)
        }
      })
    }
    else {
      dispatch({
        type: ActionTypes.GET_INBOX_ITEM,
        payload: []
      })
    }
  })
}

export function unloadInbox(userId, orgId) {
  return dispatch => {
    // Firebase.database().ref(Constants.INBOX_BY_USER_BY_ORG_PATH + '/' + userId + '/' + orgId).once('value', inboxSnapshot => {
    //   inboxSnapshot.forEach(function(inboxChild) {
    //     Firebase.database().ref(Constants.USERS_PATH + '/' + inboxChild.val().senderId).off();
    //   })
    // })
    Firebase.database().ref(Constants.INBOX_BY_USER_BY_ORG_PATH + '/' + userId + '/' + orgId).off();

    dispatch({
      type: ActionTypes.INBOX_UNLOADED
    })
  }
}

export function getInboxCount(userId, orgId) {
  return dispatch => {
    Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + userId).on('value', inboxSnapshot => {
      if (inboxSnapshot.exists()) {
        let unreadMessages = {}
        inboxSnapshot.forEach(function(org) {
          let messageCount = org.val().messageCount ? org.val().messageCount : 0;
          let messagesRead = org.val().messagesRead ? org.val().messagesRead : 0;

          unreadMessages[org.key] = messageCount - messagesRead
        })
        // const messageCount = inboxSnapshot.val().messageCount ? inboxSnapshot.val().messageCount : 0;
        // const messagesRead = inboxSnapshot.val().messagesRead ? inboxSnapshot.val().messagesRead : 0;
        dispatch({
          type: ActionTypes.GET_INBOX_COUNT,
          payload: unreadMessages
        })
      }
      else dispatch({
        type: ActionTypes.GET_INBOX_COUNT,
        payload: {}
      })
    })
  }
}

export function updateInboxCount(userId, orgName) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName).once('value', orgSnap => {
      if (orgSnap.exists()) {
        Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + userId + '/' + orgSnap.val().orgId + '/messageCount').once('value', countSnapshot => {
        if (countSnapshot.exists()) {
          const update = { messagesRead: countSnapshot.val() };
          Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + userId + '/' + orgSnap.val().orgId).update(update);
            dispatch({
              type: ActionTypes.INBOX_COUNT_UPDATED
            })
          }
        })
      }
    })
  }
}