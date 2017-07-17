import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'

export function askForAuth() {
  return dispatch => {
    dispatch({
      type: ActionTypes.ASK_FOR_AUTH
    })
  }
}

export function onLoad(currentUser) {
  return dispatch => {
    if (currentUser) {
      Firebase.database().ref(Constants.USERS_PATH + '/' + currentUser.uid).on('value', snapshot => {
        dispatch({
          type: 'APP_LOAD', 
          currentUser: currentUser,
          authenticated: currentUser.uid,
          userInfo: snapshot.val()
        })
      })
    }
    else {
      dispatch({
        type: 'APP_LOAD'
      })
    }
  }
}

export function unloadAuth() {
  return dispatch => {
    dispatch({
      type: ActionTypes.UNLOAD_AUTH
    })
  }
}

export function onRedirect() {
  return dispatch => {
    dispatch({
      type: 'REDIRECT'
    })
  }
}

export function signUpUser(username, email, password) {
  return dispatch => {
    if (username.length === 1) {
      dispatch({
        type: ActionTypes.AUTH_ERROR,
        error: {message: 'Username must be longer than 1 character'}
      })
    }
    else if (Constants.INVALID_USERNAMES.indexOf(username) > -1) {
      dispatch({
        type: ActionTypes.AUTH_ERROR,
        error: {message: 'Username is already taken'}
      })
    }
    else {
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).once('value', snapshot => {
        if (snapshot.exists()) {
          dispatch({
            type: ActionTypes.AUTH_ERROR,
            error: {message: 'Username is already taken'}
          });
        } 
        else {
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
              userId: userId
            })

            dispatch({
              type: ActionTypes.AUTH_USER,
              payload: userId,
              meta: {
                mixpanel: {
                  event: 'Sign up'
                }
              }
            })
          })
          .catch(error => {
            console.log(error);
            dispatch(authError(error));
          });
        }
      })
    }
  }
}

export function signInUser(email, password) {
  return function(dispatch) {
    if (!password || password === '') {
      dispatch({
        type: ActionTypes.AUTH_ERROR,
        error: {message: 'Please enter a password'}
      })
    }
    else {
      Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({
          type: ActionTypes.AUTH_USER,
          payload: response.uid,
          meta: {
            mixpanel: {
              event: 'Sign in'
            }
          }
        });
      })
      .catch(error => {
        dispatch(authError(error));
      });
    }
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

export function updateUsername(oldName, newName, userid) {
  Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + newName + '/').update({
    userId: userid
  })

  Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + oldName).remove();
}

export function makeUser(newUser, currentUser) {
  if (newUser && currentUser) {
    let userObject = {};
    userObject.email = (newUser.email && newUser.email !== currentUser.email ? newUser.email : currentUser.email);
    userObject.username = (newUser.username && newUser.username !== currentUser.username ? newUser.username : currentUser.username);
    if (newUser.bio && newUser.bio !== currentUser.io) userObject.bio = newUser.bio;
    if (newUser.image) {
      userObject.image = newUser.image;
    }
    else if (currentUser.image) {
      userObject.image = currentUser.image;
    }
    return userObject;
  }
  return null;
}

export function updateFirebaseEmail(newEmail, currentEmail) {
  if (newEmail !== currentEmail) {
    let user = Firebase.auth().currentUser;

    user.updateEmail(newEmail).then(function() {
      console.log('successful email update')
    }, function(error) {
      console.log(JSON.stringify(error))
    });
  }
}

export function updateFirebasePassword(password) {
  if (password) {
    let user = Firebase.auth().currentUser;
    user.updatePassword(password).then(function() {
      console.log('successful password update')
    }, function(error) {
      console.log(JSON.stringify(error))
    });
  }
}

export function saveSettings(auth, user, currentUser, imageFile) {
  const uid = Firebase.auth().currentUser.uid;
  return dispatch => {
    if (user && currentUser) {
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + user.username).once('value', snapshot => {
        if (user.username && user.username !== currentUser.username && snapshot.exists()) {
          dispatch({
            type: ActionTypes.SETTINGS_SAVED_ERROR,
            error: 'username is already taken'
          })
        }
        else {
          // update Firebase Auth details if necessary
          updateFirebaseEmail(user.email, currentUser.email);
          // updateFirebasePassword(user.password);

          if (user.username !== currentUser.username) {
            // need to also update usernames_to_userids
            updateUsername(currentUser.username, user.username, auth);
          }

          // if user uploaded an image, save it
          if (imageFile) {
            const storageRef = Firebase.storage().ref();
            const metadata = {
              contentType: 'image/jpeg'
            }
            let fileName = Helpers.generateImageFileName();
            const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
            uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              }, function(error) {
                console.log(error.message)
            }, function() {
              const downloadURL = uploadTask.snapshot.downloadURL;

              // create the new user object to save
              let userObject = makeUser(user, currentUser);
              if (userObject) {
                if (downloadURL) {
                  userObject.image = downloadURL;

                  // save the user
                  Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').set(userObject);

                  dispatch({
                    type: ActionTypes.SETTINGS_SAVED,
                    message: 'Your profile has been saved.',
                    meta: {
                      mixpanel: {
                        event: 'Settings saved'
                      }
                    }
                  });
                }
                else {
                  // no image, but still save the user 
                  Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').set(userObject);
                }
              }
            })
          }
          else {
            let userObject = makeUser(user, currentUser);
            // no new imageFile
            Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').set(userObject);

            dispatch({
              type: ActionTypes.SETTINGS_SAVED,
              message: 'Your profile has been saved.',
              meta: {
                mixpanel: {
                  event: 'Settings saved'
                }
              }
            })
          }
        }
      })
    }
  }
}

export function unloadSettings(auth) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_PATH + '/' + auth + '/').off();
    dispatch({
      type: ActionTypes.SETTINGS_UNLOADED
    });
  }
}

export function sendForgotPassword(email) {
  return dispatch => {
    Firebase.auth().sendPasswordResetEmail(email).then(function() {
      dispatch({
        type: ActionTypes.FORGOT_PASSWORD_SENT,
        message: 'A password reset link has been sent to your email address'
      })
    }, function(error) {
      dispatch({
        type: ActionTypes.AUTH_ERROR,
        error: error
      })
    })
  }
}

export function authError(error) {
  return {
    type: ActionTypes.AUTH_ERROR,
    error: error
  }
}

export function logout() {
  return {
    type: ActionTypes.SIGN_OUT_USER
  }
}

export function userDoesntExist() {
  return dispatch => {
    dispatch({
      type: ActionTypes.USER_DOESNT_EXIST
    })
  }
}