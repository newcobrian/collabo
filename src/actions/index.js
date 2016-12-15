import Firebase from 'firebase';
import * as Constants from '../constants'

export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const GET_USER = 'GET_USER';
export const LOOKUP_USERID = 'LOOKUP_USERID';

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

export function saveSettings() {

}

export function unloadSettings() {

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
        payload: snapshot.val()
      });
    });
  };
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