import Firebase from 'firebase';
import * as Constants from '../constants'

export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const GET_USER = 'GET_USER';
export const LOOKUP_USERID = 'LOOKUP_USERID';
export const IS_FOLLOWING = 'IS_FOLLOWING';
export const SETTINGS_SAVED = 'SETTINGS_SAVED';
export const SETTINGS_UNLOADED = 'SETTINGS_UNLOADED';

export function signUpUser(username, email, password) {
  return function(dispatch) {
    Firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(response => {
        let userId = response.uid;

        // need to save users profile info
        Firebase.database().ref(Constants.USERS_PATH + '/' + userId + '/').update({
          username: username,
          email: email
        })

        // save userId lookup from username
        Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username + '/').update({
          userid: userId
        })

        dispatch(authUser());
      })
      .catch(error => {
        console.log(error);
        dispatch(authError(error));
      });
  }
}

export function signInUser(email, password) {
  return function(dispatch) {
    Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        dispatch(authUser());
      })
      .catch(error => {
        dispatch(authError(error));
      });
  }
}

export function onChangeEmail(value) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value })
  }
}

export function onChangePassword(value) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value })
  }
}

export function onChangeUsername(value) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'username', value })
  }
}

export function signOutUser() {
  return function(dispatch) {
    Firebase.auth().signOut()
      .then(response => {
        dispatch(logout());
      })
      .catch(error => {
        dispatch(authError(error));
      });
  }
}

// export const saveSettings = user = dispatch => {
//     const uid = Firebase.auth().currentUser.uid;
//     Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user)
//       .then(() => {
//         dispatch(settingsSaved());
//       })
// }

export function saveSettings(user) {
  return dispatch => {
    let uid = Firebase.auth().currentUser.uid;

    // need to also update usernames-to-userids

    dispatch({
      type: SETTINGS_SAVED,
      payload:
        Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user)
    });
  }
}

export function unloadSettings() {
  return dispatch => {
    let uid = Firebase.auth().currentUser.uid;
    dispatch({
      type: SETTINGS_UNLOADED,
      payload: Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').off()
    });
  }
}

// export function verifyAuth() {
//   return function (dispatch) {
//     Firebase.auth().onAuthStateChanged(user => {
//       if (user) {
//         dispatch({type: 'APP_LOAD', user: user, authenticated: true });
//       } else {
//         dispatch(signOutUser());
//       }
//     });
//   }
// }

export function getUser(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_PATH + '/' + userId + '/').on('value', snapshot => {
      dispatch({
        type: GET_USER,
        payload: snapshot.val(),
        userId
      });
    });
  };
}

export function isFollowing(profile) {
  const current = Firebase.auth().currentUser.uid;
  return dispatch => {
    Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + current + '/' + profile).on('value', snapshot => {
      dispatch({
        type: IS_FOLLOWING,
        isFollowing: true
      });
    });
  };
}

export function followUser(follower) {
    const following = Firebase.auth().currentUser.uid;
    const updates = {};
    if (following && follower) {
      updates[`/${Constants.FOLLOWERS_PATH}/${follower}/${following}`] = true;
      updates[`/${Constants.FOLLOWINGS_PATH}/${following}/${follower}`] = true;
      // updates[`/${Constants.FOLLOWERS_PATH}/${follower}/`] = following;
      // updates[`/${Constants.FOLLOWINGS_PATH}/${following}/`] = follower;
    }
    return dispatch => Firebase.database().ref().update(updates);
}

export function unfollowUser(following) {
    const follower = Firebase.auth().currentUser.uid;
    const updates = {};
    if (following && follower) {
      updates[`/${Constants.FOLLOWERS_PATH}/${follower}/${following}`] = null;
      updates[`/${Constants.FOLLOWINGS_PATH}/${following}/${follower}`] = null;
    }
    return dispatch => Firebase.database().ref().update(updates);
}

export function authUser() {
  return {
    type: AUTH_USER
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function logout() {
  return {
    type: SIGN_OUT_USER
  }
}