import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'

export function askForAuth(message) {
  return dispatch => {
    dispatch({
      type: ActionTypes.ASK_FOR_AUTH,
      message
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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function signUpUser(email, password, fullName, verificationId, redirect) {
  return dispatch => {
    // if (!username || username.length < 3) {
    //   dispatch({
    //     type: ActionTypes.AUTH_ERROR,
    //     error: {message: 'Username must be at least 3 characters'}
    //   })
    // }
    if (!password || password.length < 6) {
      dispatch({
        type: ActionTypes.AUTH_ERROR,
        error: { message: 'Password must be at least 6 characters' }
      })
    }
    // else if (Constants.INVALID_USERNAMES.indexOf(username) > -1) {
    //   dispatch({
    //     type: ActionTypes.AUTH_ERROR,
    //     error: {message: 'Username is already taken'}
    //   })
    // }
    // else if (/\s/g.test(username)) {
    //   dispatch({
    //     type: ActionTypes.AUTH_ERROR,
    //     error: {message: 'Username cannot contain spaces'}
    //   })
    // }
    if (!fullName) {
      dispatch({
        type: ActionTypes.AUTH_ERROR,
        error: { message: 'Please enter your full name' }
      })
    }
    else {
      Firebase.database().ref(Constants.EMAIL_VERIFICATION_PATH + '/' + verificationId).once('value', verifySnap => {
        if (!verifySnap.exists()) {
          dispatch({
            type: ActionTypes.AUTH_ERROR,
            error: { message: 'Invalid email verification code' }
          })
        }
        else {
          Firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(response => {
            let userId = response.uid;
            let updates = {};

            let cleanedEmail = Helpers.cleanEmailToFirebase(email)
            Firebase.database().ref(Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail).once('value', inviteSnap => {
              // need to save users profile info
              updates[Constants.USERS_PATH + '/' + userId] = { email: email, fullName: fullName }

              // save userId lookup from username
              // updates[Constants.USERNAMES_TO_USERIDS_PATH + '/' + username] = {userId: userId }
              
              // save email address lookup
              updates[Constants.USERS_BY_EMAIL_PATH + '/' + cleanedEmail] = { userId: userId }

              // remove email verification
              updates[Constants.VERIFICATION_BY_EMAIL_PATH + '/' + cleanedEmail] = null
              updates[Constants.EMAIL_VERIFICATION_PATH + '/' + verificationId] = null

              Firebase.database().ref().update(updates);

              // migrate invites sent to user's email address to their inbox
              let lastModified = Firebase.database.ServerValue.TIMESTAMP
              let inboxCounter = 0
              inviteSnap.forEach(function(orgInvite) {
                // update recipientId on invite
                if (orgInvite.val()) {
                  orgInvite.forEach(function(inviteItem) {
                    Firebase.database().ref(Constants.ORGS_PATH + '/' + orgInvite.key).once('value', orgSnap => {
                      let inviteObject = Object.assign({}, 
                      { link: '/invitation/' + inviteItem.key }, 
                      { message: ' invited you to join the "' + orgSnap.val().name + '" team.'}, 
                      { senderId: inviteItem.val() }, 
                      { type: Constants.INBOX_INVITE_TYPE }, 
                      { lastModified: lastModified} );
                    
                      Firebase.database().ref(Constants.INBOX_PATH + '/' + userId).push(inviteObject)
                      inboxCounter++;
                    })
                  })
                }
              })
              Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + userId).update({messageCount: inboxCounter})

              // set account created date super property
              // mixpanel.register({
              //   'account created': (new Date()).toISOString()
              // });

              // set acount created date people property
              // mixpanel.people.set({ "account created": (new Date()).toISOString() });
              // mixpanel.identify(userId);

              dispatch({
                type: ActionTypes.SIGN_UP_USER,
                payload: userId,
                redirect: redirect,
                meta: {
                  mixpanel: {
                    event: 'Register', 
                    props: {
                      'account created': (new Date()).toISOString()
                    }
                  }
                }
              })
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

export function signInUser(email, password, redirect) {
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

        // set last login date super property
        mixpanel.register({
          'last login': (new Date()).toISOString(),
        });

        // set acount created date people property
        mixpanel.people.set({ "last login": (new Date()).toISOString() });
        mixpanel.people.increment("total logins");
        mixpanel.identify(response.uid);

        dispatch({
          type: ActionTypes.AUTH_USER,
          redirect: redirect,
          payload: response.uid,
          meta: {
            mixpanel: {
              event: 'Log in'
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

export function updateUsername(oldName, newName, userId, orgId) {
  let updates = {}
  // updates[Constants.USERNAMES_TO_USERIDS_PATH + '/' + newName] = { userId: userId };
  // updates[Constants.USERNAMES_TO_USERIDS_PATH + '/' + oldName] = null;
  updates[Constants.USERNAMES_BY_ORG_PATH + '/' + orgId + '/' + newName] = userId;
  updates[Constants.USERNAMES_BY_ORG_PATH + '/' + orgId + '/' + oldName] = null;
  
  Firebase.database().ref().update(updates);

  // Helpers.updateAlgloiaUsersIndex(newName, userId);
}

export function makeUser(newUser, currentUser) {
  if (newUser && currentUser) {
    let userObject = {};
    userObject.email = (newUser.email && newUser.email !== currentUser.email ? newUser.email : currentUser.email);
    userObject.username = (newUser.username && newUser.username !== currentUser.username ? newUser.username : currentUser.username);
    userObject.fullName = newUser.fullName ? newUser.fullName : currentUser.fullName
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
      // then update the email lookup table
      let updates = {}
      updates[Constants.USERS_BY_EMAIL_PATH + '/' + Helpers.cleanEmailToFirebase(newEmail)] = { userId: user.uid };
      updates[Constants.USERS_BY_EMAIL_PATH + '/' + currentEmail] = null;

      Firebase.database().ref().update(updates)

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

export function saveSettings(auth, user, currentUser, imageFile, orgName, orgId) {
  return dispatch => {
    if (user && currentUser) {
      Firebase.database().ref(Constants.USERNAMES_BY_ORG_PATH + '/' + orgId + '/' + user.username).once('value', snapshot => {
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
            updateUsername(currentUser.username, user.username, auth, orgId);
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
                  Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth + '/').set(userObject);

                  dispatch({
                    type: ActionTypes.SETTINGS_SAVED,
                    username: user.username,
                    message: 'Your profile has been saved.',
                    orgName: orgName,
                    meta: {
                      mixpanel: {
                        event: 'Settings saved'
                      }
                    }
                  });
                }
                else {
                  // no image, but still save the user 
                  Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth + '/').set(userObject);

                  dispatch({
                    type: ActionTypes.SETTINGS_SAVED,
                    username: user.username,
                    message: 'Your profile has been saved.',
                    orgName: orgName,
                    meta: {
                      mixpanel: {
                        event: 'Settings saved'
                      }
                    }
                  });
                }
              }
            })
          }
          else {
            let userObject = makeUser(user, currentUser);
            // no new imageFile
            Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth + '/').set(userObject);

            dispatch({
              type: ActionTypes.SETTINGS_SAVED,
              username: user.username,
              message: 'Your profile has been saved.',
              orgName: orgName,
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

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export function changeEmailAddress(email, password, oldEmail) {
  return dispatch => {
    // check for valid email?
    if (!password) {
      dispatch({
        type: ActionTypes.EMAIL_UPDATE_ERROR,
        error: 'Password is required'
      })
    }
    if (!validateEmail(email)) {
      dispatch({
        type: ActionTypes.EMAIL_UPDATE_ERROR,
        error: 'Please enter a valid email address'
      })
    }
    if (email === oldEmail) {
      dispatch({
        type: ActionTypes.EMAIL_UPDATE_ERROR,
        error: 'This is the same email address'
      })
    }
    else {
      // check that email is not already taken
      // re-auth
      let user = Firebase.auth().currentUser;
      Firebase.auth().signInWithEmailAndPassword(user.email, password).then(function() {
        user.updateEmail(email).then(function() {
          // then update the email lookup table
          let updates = {}
          updates[Constants.USERS_PATH + '/' + user.uid + '/email'] = email
          updates[Constants.USERS_BY_EMAIL_PATH + '/' + Helpers.cleanEmailToFirebase(email)] = { userId: user.uid };
          updates[Constants.USERS_BY_EMAIL_PATH + '/' + Helpers.cleanEmailToFirebase(oldEmail)] = null;

          Firebase.database().ref().update(updates)
          
          dispatch({
            type: ActionTypes.SHOW_SNACKBAR,
            message: 'Email update successful'
          })

          dispatch({
            type: ActionTypes.HIDE_MODAL
          })
        }).catch(function(error) {
          // error updating email address
          dispatch({
            type: ActionTypes.EMAIL_UPDATE_ERROR,
            error: error.message
          })
        });
      }).catch(error => {
        // did not auth user correctly
        dispatch({
          type: ActionTypes.EMAIL_UPDATE_ERROR,
          error: error.message
        })
      });
    }

    

    // re-auth

    // if succsess, update

    // if fail, update listErrors
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

export function setAuthRedirect(redirect) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SET_AUTH_REDIRECT,
      redirect
    })
  }
}