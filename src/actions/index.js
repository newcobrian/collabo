import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import 'whatwg-fetch';

export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';
export const GET_USER = 'GET_USER';
export const LOOKUP_USERID = 'LOOKUP_USERID';
export const IS_FOLLOWING = 'IS_FOLLOWING';
export const SETTINGS_SAVED = 'SETTINGS_SAVED';
export const SETTINGS_UNLOADED = 'SETTINGS_UNLOADED';
export const PROFILE_USER_UNLOADED = 'PROFILE_UNLOADED';
export const PROFILE_FOLLOWING_UNLOADED = 'PROFILE_FOLLOWING_UNLOADED';
export const SETTINGS_SAVED_ERROR = 'SETTINGS_SAVED_ERROR';
export const REGISTER_USERNAME_ERROR = 'REGISTER_USERNAME_ERROR';
export const GET_SUBJECT = 'GET_SUBJECT';
export const REVIEW_SUBMITTED = 'REVIEW_SUBMITTED';
export const UPDATE_FIELD = 'UPDATE_FIELD';
export const EDITOR_PAGE_LOADED = 'EDITOR_PAGE_LOADED';
export const EDITOR_PAGE_UNLOADED = 'EDITOR_PAGE_UNLOADED';
export const SUBJECT_UNLOADED = 'SUBJECT_UNLOADED';
export const GET_REVIEW = 'GET_REVIEW';
export const REVIEW_UNLOADED = 'REVIEW_UNLOADED';
export const ADD_COMMENT = 'ADD_COMMENT';
export const GET_COMMENTS = 'GET_COMMENTS';
export const COMMENTS_UNLOADED = 'COMMENTS_UNLOADED';
export const DELETE_COMMENT = 'COMMENTS_UNLOADED';
export const GET_REVIEWS_BY_USER = 'GET_REVIEWS_BY_USER';
export const GET_LIKES_OR_SAVES_BY_USER = 'GET_LIKES_BY_USER';
export const REVIEWS_BY_USER_UNLOADED = 'REVIEWS_BY_USER_UNLOADED';
export const GET_USER_FEED = 'GET_USER_FEED';
export const USER_FEED_UNLOADED = 'USER_FEED_UNLOADED';
export const GET_GLOBAL_FEED = 'GET_GLOBAL_FEED';
export const GLOBAL_FEED_UNLOADED = 'GLOBAL_FEED_UNLOADED';
export const APP_USER_LOADED = 'APP_USER_LOADED';
export const GET_FOLLOWING_COUNT = 'GET_FOLLOWING_COUNT';
export const GET_FOLLOWER_COUNT = 'GET_FOLLOWER_COUNT';
export const FOLLOWED_USER = 'FOLLOWED_USER';
export const REVIEW_LIKED = 'REVIEW_LIKED';
export const REVIEW_UNLIKED = 'REVIEW_UNLIKED';
export const REVIEW_SAVED = 'REVIEW_SAVED';
export const REVIEW_UNSAVED = 'REVIEW_UNSAVED';
export const GET_FOLLOWERS = 'GET_FOLLOWERS';
export const UNLOAD_FOLLOWERS = 'UNLOAD_FOLLOWERS';
export const UNLOAD_LIKES_OR_SAVES_BY_USER = 'UNLOAD_LIKES_BY_USER';
export const RATING_UPDATED = 'RATING_UPDATED';
export const INBOX_MESSAGE_SENT = 'INBOX_MESSAGE_SENT';
export const GET_INBOX = 'GET_INBOX';
export const GET_INBOX_COUNT = 'GET_INBOX_COUNT';
export const INBOX_COUNT_UPDATED = 'INBOX_COUNT_UPDATED';
export const INBOX_UNLOADED = 'INBOX_UNLOADED';
export const CREATE_PAGE_LOADED = 'CREATE_PAGE_LOADED';
export const CREATE_PAGE_UNLOADED = 'CREATE_PAGE_UNLOADED';
export const CREATE_SUBJECT_LOADED = 'CREATE_SUBJECT_LOADED';
export const UPDATE_FIELD_CREATE = 'UPDATE_FIELD_CREATE';
export const GET_APP_USER_REVIEW = 'GET_APP_USER_REVIEW';
export const APP_USER_REVIEW_UNLOADED = 'APP_USER_REVIEW_UNLOADED';
export const GET_FOLLOWING_REVIEWS = 'GET_FOLLOWING_REVIEWS';
export const FOLLOWING_REVIEWS_UNLOADED = 'FOLLOWING_REVIEWS_UNLOADED';
export const ASK_FOR_AUTH = 'ASK_FOR_AUTH';
export const HOME_PAGE_NO_AUTH = 'HOME_PAGE_NO_AUTH';
export const CREATE_SUBJECT_CLEARED = 'CREATE_SUBJECT_CLEARED';
export const EDITOR_SUBMIT_ERROR = 'EDITOR_SUBMIT_ERROR';
export const CREATE_SUBMIT_ERROR = 'CREATE_SUBMIT_ERROR';
export const GET_USER_LOCATION = 'GET_USER_LOCATION';
export const SET_WATCH_ID = 'SET_WATCH_ID';
export const GET_FRIENDS = 'GET_FRIENDS';
export const UPDATE_FRIENDS_CHECKBOX = 'UPDATE_FRIENDS_CHECKBOX';
export const FRIEND_SELECTOR_SUBMIT = 'FRIEND_SELECTOR_SUBMIT';
export const EMPTY_FRIEND_SELECTOR = 'EMPTY_FRIEND_SELECTOR';
export const REVIEW_DELETED = 'REVIEW_DELETED';
export const SET_IN_PROGRESS = 'SET_IN_PROGRESS';
export const MIXPANEL_EVENT = 'MIXPANEL_EVENT';
export const APPLY_TAG = 'APPLY_TAG';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const UNMOUNT_FREIND_SELECTOR = 'UNMOUNT_FREIND_SELECTOR';
export const FORWARD_MODAL = 'FORWARD_MODAL'
export const REVIEW_MODAL = 'REVIEW_MODAL'
export const ITINERARY_CREATED = 'ITINERARY_CREATED'
export const ITINERARY_PAGE_LOADED = 'ITINERARY_PAGE_LOADED'
export const ITINERARY_PAGE_UNLOADED = 'ITINERARY_PAGE_UNLOADED'

// export function signUpUser(username, email, password) {
//   return dispatch => {
//     Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).once('value', snapshot => {
//       console.log('asdfasdfasdfasdf');
//       if (snapshot.exists()) {
//         console.log('got in sanap exists');
//           dispatch(registerUsernameError());
//       } else {
//         console.log('got in else');
//         Firebase.auth().createUserWithEmailAndPassword(email, password)
//           .then(response => {
//             let userId = response.uid;

//             // need to save users profile info
//             Firebase.database().ref(Constants.USERS_PATH + '/' + userId + '/').update({
//               username: username,
//               email: email
//             })

//             // save userId lookup from username
//             Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username + '/').update({
//               userid: userId
//             })

//             dispatch(authUser());
//           })
//           .catch(error => {
//             console.log(error);
//             dispatch(authError(error));
//           });
//       }
//     });
//   }
// }

// export function onRegisterSubmit(username, email, password) {
//   return dispatch => {
//     console.log('called register submit');
//     // Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).once('value', snapshot => {
//       Firebase.database().ref(Constants.USERS_PATH + '/').once('value', snapshot => {
// console.log('in firebase call' + snapshot.val());
//       if (snapshot.exists()) {
//         console.log('got in sanap exists');
//           dispatch(registerUsernameError());
//       } else {
//         console.log('in else');
//         // return signUpUser(username, email, password);
//       }
//     });
//   }
// }

export function onLoad(currentUser, authenticated) {
  return dispatch => {
    dispatch({ 
      type: 'APP_LOAD', 
      currentUser: currentUser,
      authenticated: authenticated
    })
  }
}

export function getAppUser(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', snapshot => {
      dispatch({
        type: APP_USER_LOADED,
        payload: snapshot.val(),
      })
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
            type: AUTH_USER,
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
}

export function signInUser(email, password) {
  return function(dispatch) {
    Firebase.auth().signInWithEmailAndPassword(email, password)
      .then(response => {
        dispatch({
          type: AUTH_USER,
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

export function saveSettings(user, currentUsername, imageFile) {
  const uid = Firebase.auth().currentUser.uid;
  return dispatch => {
    if (user.username && user.username !== currentUsername) {
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + user.username).once('value', snapshot => {
        if (snapshot.exists()) {
          dispatch({
            type: SETTINGS_SAVED_ERROR,
            error: 'username is already taken'
          })
        }
        else {
          // need to also update usernames_to_userids
          const uid = Firebase.auth().currentUser.uid;
          updateUsername(currentUsername, user.username, uid);

              // if user uploaded an image, save it
          if (imageFile) {
            const storageRef = Firebase.storage().ref();
            const metadata = {
              contentType: 'image/jpeg'
            }
            let fileName = generateImageFileName();
            const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
            uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
            function(snapshot) {
              }, function(error) {
                console.log(error.message)
            }, function() {
              const downloadURL = uploadTask.snapshot.downloadURL;
              if (downloadURL) {
                user.image = downloadURL;

                dispatch({
                  type: SETTINGS_SAVED,
                  payload:
                    Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user),
                  meta: {
                    mixpanel: {
                      event: 'Settings saved'
                    }
                  }
                });
              }
            })
          }

          // no new imageFile
          dispatch({
            type: SETTINGS_SAVED,
            payload:
              Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user),
            meta: {
              mixpanel: {
                event: 'Settings saved'
              }
            }
          });  
        }
      });
    } else {
      if (imageFile) {
        const storageRef = Firebase.storage().ref();
        const metadata = {
          contentType: 'image/jpeg'
        }
        let fileName = generateImageFileName();
        const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
        uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          }, function(error) {
            console.log(error.message)
        }, function() {
          const downloadURL = uploadTask.snapshot.downloadURL;
          if (downloadURL) {
            user.image = downloadURL;

            dispatch({
              type: SETTINGS_SAVED,
              payload:
                Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user),
              meta: {
                mixpanel: {
                  event: 'Settings saved'
                }
              }
            });
          }
        })
      }
      else {
        dispatch({
          type: SETTINGS_SAVED,
          payload:
            Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user),
          meta: {
            mixpanel: {
              event: 'Settings saved'
            }
          }
        });
      }
    }
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

export function unloadProfileUser(uid) {
  return dispatch => {
    dispatch({
      type: PROFILE_USER_UNLOADED,
      payload: Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').off()
    });
  }
}

export function unloadProfileFollowing(uid) {
  return dispatch => {
    let current = Firebase.auth().currentUser.uid;
    dispatch({
      type: PROFILE_FOLLOWING_UNLOADED,
      payload: Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + current + '/' + uid).off()
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

export function getProfileUser(userId) {
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

export function checkFollowing(profile) {
  const current = Firebase.auth().currentUser.uid;
  return dispatch => {
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + current + '/' + profile).on('value', snapshot => {
      let isFollowing = false;
      if (snapshot.exists()) {
        isFollowing = true;
      }
      dispatch({
        type: IS_FOLLOWING,
        payload: isFollowing
      });
    });
  };
}

export function getFollowingCount(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).once('value', snapshot => {
      dispatch({
        type: GET_FOLLOWING_COUNT,
        payload: snapshot.numChildren()
      })
    })
  }
}

export function getFollowerCount(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.HAS_FOLLOWERS_PATH + '/' + userId).once('value', snapshot => {
      dispatch({
        type: GET_FOLLOWER_COUNT,
        payload: snapshot.numChildren()
      })
    })
  }
}

export function followUser(authenticated, follower) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    const following = Firebase.auth().currentUser.uid;
    const updates = {};
    if (following && follower) {
      updates[`/${Constants.HAS_FOLLOWERS_PATH}/${follower}/${following}`] = true;
      updates[`/${Constants.IS_FOLLOWING_PATH}/${following}/${follower}`] = true;
      // updates[`/${Constants.HAS_FOLLOWERS_PATH}/${follower}/`] = following;
      // updates[`/${Constants.IS_FOLLOWING_PATH}/${following}/`] = follower;
    }
    Helpers.sendInboxMessage(following, follower, Constants.FOLLOW_MESSAGE, null);
    Firebase.database().ref().update(updates);

    dispatch({
      type: FOLLOWED_USER,
      meta: {
        mixpanel: {
          event: 'Followed user',
          props: {
            userId: follower
          }
        }
      }
    })
  }
}

export function unfollowUser(authenticated, following) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }    
    const follower = Firebase.auth().currentUser.uid;
    const updates = {};
    if (following && follower) {
      updates[`/${Constants.HAS_FOLLOWERS_PATH}/${following}/${follower}`] = null;
      updates[`/${Constants.IS_FOLLOWING_PATH}/${follower}/${following}`] = null;
    }
    Firebase.database().ref().update(updates);
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

export function onEditorLoad(itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
    let itineraryObject = itinerarySnapshot.val();
    let reviewsList = itinerarySnapshot.val().reviews;
    let reviewArray = [];
      for (let i = 0; i < itineraryObject.reviews.length; i++) {
        Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + itineraryObject.reviews[i].subjectId).on('value', subjectSnapshot => {
          Firebase.database().ref(Constants.REVIEWS_PATH + '/' + itineraryObject.reviews[i].reviewId).on('value', reviewSnapshot => {
            Object.assign(itineraryObject.reviews[i], subjectSnapshot.val(), reviewSnapshot.val());
            
            dispatch({
              type: EDITOR_PAGE_LOADED,
              itineraryId: itineraryId,
              data: { itinerary: itineraryObject }
            })
          })
        })
      }
    })
  }
}

export function onEditorUnload() {
  return dispatch => {
    dispatch({
      type: EDITOR_PAGE_UNLOADED
    })
  }
}

export function askForAuth() {
  return dispatch => {
    dispatch({
      type: ASK_FOR_AUTH
    })
  }
}

export function showPosition(position) {
  return dispatch => {
    dispatch({
      type: GET_USER_LOCATION,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,

    })
  }
}

export function setWatchPositionId(id) {
  return dispatch => {
    dispatch({
      type: SET_WATCH_ID,
      payload: id
    })
  }
}

export function onCreateLoad(authenticated) {
  return dispatch => {
    if(!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    Firebase.database().ref(Constants.USERS_PATH + '/' + authenticated).once('value', userSnapshot => {
      dispatch({
        type: CREATE_PAGE_LOADED,
        userImage: userSnapshot.val().image
      })
    })
  }
}

export function onCreateUnload() {
  return dispatch => {
    dispatch({
      type: CREATE_PAGE_UNLOADED
    })
  }
}

export function loadCreateSubject(userId, result) {
  return dispatch => {
    let subject = {};

    if (result && result.id) {
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + result.id + '/' + userId).once('value', reviewSnapshot => {
        Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + result.id).once('value', subjectSnapshot => {
          // put together subject info
          if (subjectSnapshot.exists()) {
            subject = subjectSnapshot.val();
          }
          else {
            subject.title = result.value;
            if (result.URL) subject.url = result.url;
            if (result.description) subject.description = result.description;
            if (result.tags) subject.tags = result.tags;
          }

          let dispatchObject = {
            type: CREATE_SUBJECT_LOADED,
            payload: subject,
            review: reviewSnapshot.val(),
            rating: null,
            caption: '',
            subjectId: result.id,
            meta: {
              mixpanel: {
                event: 'Subject loaded from search',
                props: {
                  subjectId: result.id,
                  title: subject.title,
                  service: result._service
                }
              }
            }
          };

          // get image
          if (subjectSnapshot.exists()) {
            dispatchObject.image = Helpers.getImagePath(subjectSnapshot.val().images);
          }
          else if (result.image) dispatchObject.image = result.image;

          // get the user's review if they already reviewed it
          if (reviewSnapshot.exists()) {
            dispatchObject.rating = reviewSnapshot.val().rating;
            dispatchObject.caption = reviewSnapshot.val().caption;
          }

          // fetch image from 4sq API
          if (result._service === '4sq') {
            const foursquareURL = Constants.FOURSQUARE_API_PATH + result.id.slice(4) + 
              '?client_id=' + Constants.FOURSQUARE_CLIENT_ID + 
              '&client_secret=' + Constants.FOURSQUARE_CLIENT_SECRET + '&v=20170101';
            fetch(foursquareURL).then(response => response.json())
            .then(json => {
              if (json.response.venue && json.response.venue.photos && json.response.venue.photos.groups && 
                json.response.venue.photos.groups[0] && json.response.venue.photos.groups[0].items &&
                json.response.venue.photos.groups[0].items[0]) {
                const photoURL = json.response.venue.photos.groups[0].items[0].prefix + 'original' +
                  json.response.venue.photos.groups[0].items[0].suffix;
                dispatchObject.image = photoURL;
              }
              dispatch(dispatchObject);
            })
          }
          else if (result._service === 'amazon') {
            const amazonURL = Constants.AMAZON_SEARCH_URL + result.id;
            fetch(amazonURL).then(response => response.json()).then(json => {
              if (json.images) {
                if (json.images.large) {
                  dispatchObject.image = json.images.large;
                }
                else if (json.images.medium) {
                  dispatchObject.image = json.images.medium;
                }
                else if (json.images.small) {
                  dispatchObject.image = json.images.small;
                }
              }
              if (json.reviews) {
                if (json.reviews.ProductDescription) subject.description = json.reviews.ProductDescription;
              }

              dispatch(dispatchObject);
            })
          }
          else {
            dispatch(dispatchObject);
          }
        })
      })
    }
    else dispatch({
      type: CREATE_SUBJECT_LOADED,
      payload: null,
      key: null,
      rating: null,
      caption: ''
    })
  }
}

export function clearCreateSubject() {
  return dispatch => {
    type: CREATE_SUBJECT_CLEARED
  }
}

export function onUpdateCreateField(key, value) {
  return dispatch => {
    dispatch({
      type: UPDATE_FIELD_CREATE,
      key,
      value
    })
  }
}

export function onUpdateField(key, value) {
  return dispatch => {
    dispatch({
      type: UPDATE_FIELD,
      key,
      value
    })
  }
}

export function onCreateItinerary(auth, itinerary) {
  return dispatch => {
    let itineraryObject = {};
    let itineraryMeta = {
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    }
    Object.assign(itineraryObject, itinerary, itineraryMeta)

    let itineraryId = Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth).push(itineraryObject).key;

    Object.assign(itineraryObject, {userId: auth});
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).update(itineraryObject);

    dispatch({
      type: ITINERARY_CREATED,
      payload: itineraryObject,
      itineraryId: itineraryId
    })
  }
}

export function onCreateSubmit(key, subject, review, rid, imageURL, imageFile, path=null) {
  return dispatch => {
    const updates = {};
    const uid = Firebase.auth().currentUser.uid;
    const lastModified = Firebase.database.ServerValue.TIMESTAMP;
    let subjectId = '',
      imageId = '';

    let imageObject = {
      url: imageURL,
      lastModified: lastModified
    }

    let saveSubject = {};
    Object.assign(saveSubject, subject, {lastModified: lastModified});

    let reviewId = rid ? rid : Firebase.database().ref(Constants.REVIEWS_PATH).push().key;

    // if subject already exists or we get an objectID from a partner API to use as subjectId
    if (key) {
      subjectId = key;
      Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key).once('value', subjectSnapshot => {
        // make sure subject is still there, otherwise save it
        if (!subjectSnapshot.exists()) {
          if (imageURL) {
            Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key).update(saveSubject);
            imageId = Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key + '/images').push(imageObject).key;
            subject.images = {
              imageId: imageObject
            };
            Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + uid + '/' + reviewId + '/subject/images/' + imageId).update(imageObject);
          }
        }
        // if subject exists, just update lastModified
        else {
          Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key).update({lastModified: lastModified});
        }
      })
    }
    else {
      // user created a new subject, save it
      subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push(saveSubject).key;

      // add the image if its there
      if (imageURL) {
        Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key).update(saveSubject);
        imageId = Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key + '/images').push(imageObject).key;
        subject.images = {
          imageId: imageObject
        };
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + uid + '/' + reviewId + '/subject/images/' + imageId).update(imageObject);
      }

      //update Algolia index
      var algoliasearch = require('algoliasearch');
      var client = algoliasearch('2OEMW8KEZS', '62e17a3113351343399fad062d3cbca5', {protocol:'https:'});
      var index = client.initIndex('whatsgood-subjects');
      index.saveObject({
        name: subject.title,
        description: subject.description,
        objectID: subjectId
      }, function(err, content) {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    // add the subject to the tags tree if there
    if (subject.tags) {
      for (var key in subject.tags) {
        if (!subject.tags.hasOwnProperty(key)) continue;
        updates[`/${Constants.TAGS_PATH}/${key}/${subjectId}/`] = true;  
      }
    }

    // save review
    const reviewMeta = {
        userId: Firebase.auth().currentUser.uid,
        subjectId: subjectId,
        lastModified: lastModified
    }

    const reviewObject = {};
    Object.assign(reviewObject, reviewMeta, review);

    updates[`/${Constants.REVIEWS_PATH}/${reviewId}/`] = reviewObject;

    // save reviewByUser
    let reviewsByUserObject = {
      rating: review.rating,
      caption: review.caption,
      lastModified: lastModified,
    }

    reviewsByUserObject.subjectId = subjectId;
    reviewsByUserObject.subject = subject;

    updates[`/${Constants.REVIEWS_BY_USER_PATH}/${uid}/${reviewId}`] = reviewsByUserObject;

    // save reviewBySubject
    let reviewsBySubjectObject = {
      reviewId: reviewId,
      rating: review.rating,
      caption: review.caption,
      lastModified: lastModified      
    }
    updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${uid}`] = reviewsBySubjectObject;

    // reviewsByUserObject.id = reviewId;
    const payloadObject = {};
    Object.assign(payloadObject, reviewObject, {id: reviewId}, {subject: subject});

    Firebase.database().ref().update(updates)
      .then(response => {
        // increment review count on the subject
        var reviewCountRef = Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/reviewsCount');
        reviewCountRef.transaction(function (current_count) {
          return (current_count || 0) + 1;
        });

        // if user uploaded an image, save it
        if (imageFile) {
          const imageUpdates = {};
          const storageRef = Firebase.storage().ref();
          const metadata = {
            contentType: 'image/jpeg'
          }
          let fileName = generateImageFileName();
          const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
          uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function(snapshot) {
            }, function(error) {
              console.log(error.message)
          }, function() {
            const downloadURL = uploadTask.snapshot.downloadURL;
            if (downloadURL) {
              let imageObject = {
                url: downloadURL,
                lastModified: Firebase.database.ServerValue.TIMESTAMP,
                uploader: uid
              }

              let imageId = Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/images').push().key;
              imageUpdates[`/${Constants.SUBJECTS_PATH}/${subjectId}/images/${imageId}`] = imageObject;
              imageUpdates[`/${Constants.REVIEWS_BY_USER_PATH}/${uid}/${reviewId}/subject/images/${imageId}`] = imageObject;

              payloadObject.subject.images = {imageId: imageObject};

              Firebase.database().ref().update(imageUpdates);

              dispatch({
                type: REVIEW_SUBMITTED,
                payload: payloadObject,
                path: path,
                meta: {
                  mixpanel: {
                    event: 'Review submitted',
                    props: {
                      rating: review.rating,
                      subjectId: subjectId,
                      location: (path === REVIEW_MODAL) ? REVIEW_MODAL : 'Create page'
                    }
                  }
                }
              })
            }
          })
        }
        // no image
        else {
          dispatch({
            type: REVIEW_SUBMITTED,
            payload: payloadObject,
            path: path,
            meta: {
              mixpanel: {
                event: 'Review submitted',
                props: {
                  rating: review.rating,
                  subjectId: subjectId,
                  location: (path === REVIEW_MODAL) ? REVIEW_MODAL : 'Create page'
                }
              }
            }
          })
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function setInProgress() {
  return dispatch => {
    dispatch({
      type: SET_IN_PROGRESS
    })
  }
}

// export function uploadFileToFirebase(authenticated, file) {
//   return dispatch => {
//     // Create the file metadata

//     var storageRef = Firebase.storage().ref();

//     var metadata = {
//       contentType: 'image/jpeg'
//     };

//     // Upload file and metadata to the object 'images/mountains.jpg'
//     var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

//     // Listen for state changes, errors, and completion of the upload.
//     uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//       function(snapshot) {
//         // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
//         var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log('Upload is ' + progress + '% done');
//         switch (snapshot.state) {
//           case Firebase.storage.TaskState.PAUSED: // or 'paused'
//             console.log('Upload is paused');
//             break;
//           case Firebase.storage.TaskState.RUNNING: // or 'running'
//             console.log('Upload is running');
//             break;
//         }
//       }, function(error) {
//         console.log(error.message)
//     }, function() {
//       // Upload completed successfully, now we can get the download URL
//       var downloadURL = uploadTask.snapshot.downloadURL;
//       console.log('dl url = ' + downloadURL);
//     });
//   }
// }

export function generateImageFileName()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function onEditorSubmit(auth, itineraryId, itinerary) {
  return dispatch => {
    let updates = {};
    let reviewsList = {};
    const lastModified = { lastModified: Firebase.database.ServerValue.TIMESTAMP };
    let reviews = itinerary.reviews;
    for (var i = 0; i < reviews.length; i++) {
      // create the reviewsList for the itinerary
      let subject = Helpers.makeSubject(reviews[i], lastModified);
      // if subject doesnt exist, create it
      if (!reviews[i].subjectId) {
        reviews[i].subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push(subject).key;
      }

      let review = Helpers.makeReview(reviews[i], reviews[i].subjectId, lastModified);
      // if review doesnt exist, create it
      if (!reviews[i].reviewId) {
        reviews[i].reviewId = Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + auth).push(review).key;
      }
      else {
        updates[`/${Constants.REVIEWS_BY_USER_PATH}/${auth}/${reviews[i].reviewId}/`] = review;
      }
      // update REVIEWS_BY_USER, REVIEWS_BY_SUBJECT, and REVIEWS tables
      updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${reviews[i].subjectId}/${auth}/`] = review;
      updates[`/${Constants.REVIEWS_PATH}/${reviews[i].reviewId}/`] = Object.assign({}, review, { userId: auth })

      let reviewObject = {};      
      reviewsList[i] = Object.assign(reviewObject, { subjectId: reviews[i].subjectId }, { reviewId: reviews[i].reviewId });;
    }

    let itineraryByUserObject = Helpers.makeItinerary(auth, itinerary, lastModified);
    Object.assign(itineraryByUserObject, { reviews: reviewsList }, { reviewsCount: reviews.length });

    let itineraryObject = {};
    Object.assign(itineraryObject, itineraryByUserObject, { userId: auth });

    // create itinerary if it doenst exist
    if (!itineraryId) {
      itineraryId = Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth).push(itineraryByUserObject).key;
    }
    else {
      updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/`] = itineraryByUserObject;
    }
    // update all itinerary tables
    updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/`] = itineraryObject;
    updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo}/${itineraryId}/`] = itineraryObject;

    Firebase.database().ref().update(updates, function(error) {
      if (error) {
        console.log("Error updating data:", error);
      }
    });
  }
}

// export function onEditorSubmit(subject, imageFile, review, tag) {
//   return dispatch => {
//     const updates = {};
//     const uid = Firebase.auth().currentUser.uid;
//     const lastModified = Firebase.database.ServerValue.TIMESTAMP;

//     // save the subject
//     let subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push().key;
//     let saveSubject = {};
//     Object.assign(saveSubject, subject, {lastModified: lastModified});
//     updates[`/${Constants.SUBJECTS_PATH}/${subjectId}/`] = saveSubject;

//     // add the subject to the tags tree if there
//     if (tag) {
//       updates[`/${Constants.TAGS_PATH}/${tag}/${subjectId}/`] = true;
//     }

//     // save the review
//     let reviewId = Firebase.database().ref(Constants.REVIEWS_PATH).push().key;
    

//     // create the reviewObject with the subject info for reviewsByUser and reviewsBySubject
//     const reviewObject = {
//         userId: Firebase.auth().currentUser.uid,
//         subjectId: subjectId,
//         lastModified: lastModified
//     }

//     Object.assign(reviewObject, review);

//     updates[`/${Constants.REVIEWS_PATH}/${reviewId}/`] = reviewObject;

//     let reviewsByUserObject = {
//       rating: review.rating,
//       caption: review.caption,
//       lastModified: lastModified,
//     }

//     let subjectObject = subject;
//     reviewsByUserObject.subjectId = subjectId;
//     reviewsByUserObject.subject = subjectObject;

//     updates[`/${Constants.REVIEWS_BY_USER_PATH}/${uid}/${reviewId}`] = reviewsByUserObject;
//     updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${uid}`] = {
//       reviewId: reviewId,
//       rating: review.rating,
//       caption: review.caption,
//       lastModified: lastModified
//     };

//     // reviewObject.id = reviewId;
//     // reviewObject.subject = subjectObject;

//     const payloadObject = {};
//     Object.assign(payloadObject, reviewObject, {id: reviewId}, {subject: subjectObject});

//     // save updates
//     Firebase.database().ref().update(updates);

//     // increment review count on the subject
//     var reviewCountRef = Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/reviewsCount');
//     reviewCountRef.transaction(function (current_count) {
//       return (current_count || 0) + 1;
//     });

//     // if user uploaded an image, save it
//     if (imageFile) {
//       const imageUpdates = {};
//       const storageRef = Firebase.storage().ref();
//       const metadata = {
//         contentType: 'image/jpeg'
//       }
//       let fileName = generateImageFileName();
//       const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
//       uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//       function(snapshot) {
//         }, function(error) {
//           console.log(error.message)
//       }, function() {
//         const downloadURL = uploadTask.snapshot.downloadURL;
//         if (downloadURL) {
//           let imageObject = {
//             url: downloadURL,
//             lastModified: Firebase.database.ServerValue.TIMESTAMP,
//             uploader: uid
//           }

//           let imageId = Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/images').push().key;
//           imageUpdates[`/${Constants.SUBJECTS_PATH}/${subjectId}/images/${imageId}`] = imageObject;
//           imageUpdates[`/${Constants.REVIEWS_BY_USER_PATH}/${uid}/${reviewId}/subject/images/${imageId}`] = imageObject;
//           // imageUpdates[`/${Constants.REVIEWS_PATH}/${reviewId}/images/${imageId}`] = imageObject;
//           // imageUpdates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${uid}/images/${imageId}`] = imageObject;

//           payloadObject.subject.images = {
//             imageId: imageObject,
//             lastModified: lastModified
//           }

//           Firebase.database().ref().update(imageUpdates).then(response => {
//             dispatch({
//               type: REVIEW_SUBMITTED,
//               payload: payloadObject,
//               meta: {
//                 mixpanel: {
//                   event: 'Review submitted',
//                   props: {
//                     rating: review.rating,
//                     subjectId: subjectId,
//                     location: 'Editor page'
//                   }
//                 }
//               }
//             })
//           });
//         }
//       })
//     }
//     else {
//       dispatch({
//         type: REVIEW_SUBMITTED,
//         payload: payloadObject
//       })
//     }
//   }
// }

// export function updateSubjectImages() {
//   return dispatch => {
//     Firebase.database().ref(Constants.SUBJECTS_PATH).once('value', snapshot => {
//       snapshot.forEach(function(subjectChild) {
//         // && subjectChild.key === '-KZOlUe8RIMnWMkll8bQ'
//         // subjectChild.val().images && 
//         if (subjectChild.val().images && subjectChild.val().images[0]) {
//           let image = {
//             url: subjectChild.val().images[0],
//             lastModified: Firebase.database.ServerValue.TIMESTAMP
//           };
          
//           Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectChild.key + '/images').remove().then(
//             response => {
//               Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectChild.key + '/images').push(image);  
//             })          
//         }
//       })
//     })
//   }
// }

// export function updateReviewByUserImages() {
//   return dispatch => {
//     Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH).once('value', userSnap => {
//       userSnap.forEach(function(user) {
//         user.forEach(function(review) {
//           let reviewSubject = review.val().subject;
//           //review.key == '-KeGsFF9dqzzJja0dZI5' && 
          
//           if (reviewSubject.images && reviewSubject.images[0]) {
//             let image = {
//               url: reviewSubject.images[0],
//               lastModified: Firebase.database.ServerValue.TIMESTAMP
//             };
            
//             Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + user.key + '/' + review.key + '/subject/images').remove().then(
//               response => {
//                 Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + user.key + '/' + review.key + '/subject/images').push(image);  
//               })          
//           }
//         })
//       })
//     })
//   }
// }

export function editorSubmitError(missingField) {
  return dispatch => {
    dispatch({
      type: EDITOR_SUBMIT_ERROR,
      error: 'Please add a ' + missingField
    })
  }
}

export function createSubmitError(missingField) {
  return dispatch => {
    dispatch({
      type: CREATE_SUBMIT_ERROR,
      error: 'Please add a ' + missingField
    })
  }
}

export function getSubject(subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', snapshot => {
      let subject = snapshot.val();
      subject.image = subject.images ? Helpers.getImagePath(subject.images) : '';
      subject.tag = subject.tags ? Helpers.getTagsArray(subject.tags) : [];
      dispatch({
        type: GET_SUBJECT,
        payload: subject
      });
    });
  };
}

export function getReview(authenticated, reviewId) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).on('value', reviewSnapshot => {
      if (!reviewSnapshot.exists()) {
        dispatch({
          type: GET_REVIEW,
          payload: null
        })
      }
      else {
        Firebase.database().ref(Constants.USERS_PATH + '/' + reviewSnapshot.val().userId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewId).on('value', likesSnapshot => {
            Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewId).on('value', savesSnapshot => {
              Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).on('value', commentCountSnapshot => {
                let review = reviewSnapshot.val();
                review.id = reviewSnapshot.key;
                review.reviewer = {};
                let userMeta = { username: userSnapshot.val().username, image: userSnapshot.val().image };
                Object.assign(review.reviewer, userMeta, {userId: reviewSnapshot.val().userId});

                review.isLiked = false
                if (likesSnapshot.val()) {
                  review.isLiked = searchLikes(authenticated, likesSnapshot.val());
                }

                review.isSaved = savesSnapshot.exists();

                if (commentCountSnapshot.exists()) {
                  review.comments = {
                    lastComment: '',
                    commentorImage: '',
                    username: ''                  
                  }
                }

                dispatch({
                  type: GET_REVIEW,
                  payload: review
                });
              })
            })
          })
        })
      }
    });
  }
}

export function getAppUserReview(authenticated, currentUserInfo, subjectId) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: GET_APP_USER_REVIEW,
        payload: {}
      })
    }
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + authenticated).on('value', reviewSnapshot => {
      if (!reviewSnapshot.exists()) {
        dispatch({
          type: GET_REVIEW,
          payload: null
        })
      }
      else {
        Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewSnapshot.val().reviewId).on('value', likesSnapshot => {
          Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewSnapshot.val().reviewId).on('value', savesSnapshot => {
            let review = reviewSnapshot.val();
            review.id = reviewSnapshot.key;
            review.reviewer = currentUserInfo;

            review.isLiked = false
            if (likesSnapshot.val()) {
              review.isLiked = searchLikes(authenticated, likesSnapshot.val());
            }

            review.isSaved = savesSnapshot.exists();

            dispatch({
              type: GET_APP_USER_REVIEW,
              payload: review
            });
          })
        })
      }
    })
  }
}

export function unloadAppUserReview(authenticated, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + authenticated).once('value', reviewSnapshot => {
      if (reviewSnapshot.exists()) {
        Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewSnapshot.val().reviewId).off();
        Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewSnapshot.val().reviewId).off();
      }
    })
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + authenticated).off();
    dispatch({
      type: APP_USER_REVIEW_UNLOADED
    })
  }
}

export function getFollowingReviews(authenticated, subjectId, viewingReviewId) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: GET_APP_USER_REVIEW,
        payload: []
      })
    }
    let reviewArray = [];
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + authenticated).on('value', followingSnapshot => {
      followingSnapshot.forEach(function(followingChild) {
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).on('value', reviewSnapshot => {
          if (reviewSnapshot.exists() && viewingReviewId !== reviewSnapshot.val().reviewId) {
            Firebase.database().ref(Constants.USERS_PATH + '/' + followingChild.key).once('value', userSnapshot => {
              Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewSnapshot.val().reviewId).on('value', likesSnapshot => {
                Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewSnapshot.val().reviewId).on('value', savesSnapshot => {
                  let review = reviewSnapshot.val();
                  review.id = reviewSnapshot.val().reviewId;
                  review.reviewer = {};
                  let userMeta = { username: userSnapshot.val().username, image: userSnapshot.val().image };
                  Object.assign(review.reviewer, userMeta)

                  review.isLiked = false
                  if (likesSnapshot.val()) {
                    review.isLiked = searchLikes(authenticated, likesSnapshot.val());
                  }

                  review.isSaved = savesSnapshot.exists();

                  reviewArray = [review].concat(reviewArray);
                  reviewArray.sort(lastModifiedDesc);

                  dispatch({
                    type: GET_FOLLOWING_REVIEWS,
                    payload: reviewArray
                  });
                })
              })
            })
          }
        })
      })
    })
  }
}

export function unloadFollowingReviews(authenticated, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + authenticated).once('value', followingSnapshot => {
      followingSnapshot.forEach(function(followingChild) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + followingChild.key).off();
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).once('value', reviewSnapshot => {
          if (reviewSnapshot.exists()) {
            Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewSnapshot.val().reviewId).off();
            Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewSnapshot.val().reviewId).off();
          }
        })
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).off();
      })
    })
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + authenticated).off();
    dispatch({
      type: FOLLOWING_REVIEWS_UNLOADED
    })
  }
}

export function getComments(reviewId) {
  return dispatch => {
    if (!reviewId) {
      dispatch({
        type: GET_COMMENTS,
        payload: []
      })
    }
    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).orderByChild('lastModified').on('value', snapshot => {
      if (!snapshot.exists()) {
        dispatch({
          type: GET_COMMENTS,
          payload: []
        })
      }
      else {
        let comments = [];
        snapshot.forEach(function(childSnapshot) {
          Firebase.database().ref(Constants.USERS_PATH + '/' + childSnapshot.val().userId).on('value', userSnapshot => {
            const key = { id: childSnapshot.key };
            const comment = { username: userSnapshot.val().username, image: userSnapshot.val().image };
            Object.assign(comment, childSnapshot.val(), key);
            comments = comments.concat(comment);
            comments.sort(lastModifiedAsc);

            dispatch({
              type: GET_COMMENTS,
              payload: comments
            });
          })
        });
      }
    });
  }
}

export function unloadSubject(subjectId) {
  return dispatch => {
    dispatch({
      type: SUBJECT_UNLOADED,
      payload: Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off()
    });
  }
}

export function unloadReview(authenticated, reviewId, subjectId) {
  return dispatch => {
    if (reviewId) {
      Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).once('value', snapshot => {
        Firebase.database().ref(Constants.USERS_PATH + '/' + snapshot.val().userId).off();
        Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewId).off();
        Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + authenticated + '/' + reviewId).off();
        Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).off();
      });
      dispatch({
        type: REVIEW_UNLOADED,
        payload: Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).off()
      });
    }
  }
}

export function unloadComments(reviewId) {
  return dispatch => {
    if (reviewId) {
      Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).once('value', snapshot => {
        snapshot.forEach(function(childSnapshot) {
          Firebase.database().ref(Constants.USERS_PATH + '/' + childSnapshot.val().userId).off();
        })
      });
      dispatch({
        type: COMMENTS_UNLOADED,
        payload: Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).off()
      });
    }
  }
}

export function onCommentSubmit(authenticated, review, body) {
  return dispatch => {
    if(!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    const userId = Firebase.auth().currentUser.uid;
    const comment = {
      userId: userId,
      body: body,
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    }

    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.id).push(comment).then(response => {
      Helpers.incrementCount(Constants.COMMENTS_COUNT, review.id, review.subjectId, review.reviewer.userId);

      // send message to original review poster
      Helpers.sendInboxMessage(userId, review.userId, Constants.COMMENT_ON_REVIEW_MESSAGE, review);
      const sentArray = [review.userId];

      Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.id).once('value', commentsSnapshot => {
        commentsSnapshot.forEach(function(comment) {
          let commenterId = comment.val().userId;
          // if not commentor or in sent array, then send a message
          if (commenterId !== userId && (sentArray.indexOf(commenterId) === -1)) {
            Helpers.sendInboxMessage(userId, commenterId, Constants.COMMENT_ON_COMMENT_MESSAGE, review);
            sentArray.push(commenterId);
          }
        })
      })

      dispatch({
        type: ADD_COMMENT,
        meta: {
          mixpanel: {
            event: 'Comment added',
            props: {
              subjectId: review.subjectId
            }
          }
        }
      })
    })
    .catch(error => {
      console.log(error);
    })
  }
}

export function onDeleteComment(review, commentId) {
  return dispatch => {
    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.id + '/' + commentId).remove().then(response => {
      Helpers.decrementCount(Constants.COMMENTS_COUNT, review.id, review.subjectId, review.reviewer.userId);

      dispatch({
        type: DELETE_COMMENT
      })
    })
    .catch(error => {
      console.log(error);
    })
  }
}

export function onDeleteReview(userId, reviewId, subjectId, reviewDetailPath) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).remove();
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + reviewId).remove();
    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId + '/' + reviewId).remove();
    Firebase.database().ref(Constants.LIKES_PATH + '/' + reviewId).remove();
    Firebase.database().ref(Constants.SAVES_PATH + '/' + reviewId).remove();
    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).remove();
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH).once('value', likesSnapshot => {
      likesSnapshot.forEach(function(userChild) {
        Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userChild.key + '/' + reviewId).remove();
      })
    })
    Firebase.database().ref(Constants.SAVES_BY_USER_PATH).once('value', savesSnapshot => {
      savesSnapshot.forEach(function(userChild) {
        Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + userChild.key + '/' + reviewId).remove();
      })
    })
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/reviewsCount').transaction(function (current_count) {
      let count = (current_count || 0) - 1;
      return count > 0 ? count : 0;
    })

    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).update({lastModified: Firebase.database.ServerValue.TIMESTAMP});

    dispatch({
      type: REVIEW_DELETED,
      redirect: reviewDetailPath
    })
  }
}

export function onUpdateRating(userId, reviewId, subjectId, rating) {
  return dispatch => {
    const updates = {};
    updates[Constants.REVIEWS_PATH +'/' + reviewId + '/rating'] = rating;
    updates[Constants.REVIEWS_BY_SUBJECT_PATH +'/' + subjectId + '/' + reviewId + '/rating'] = rating;
    updates[Constants.REVIEWS_BY_USER_PATH +'/' + userId + '/' + reviewId +'/rating'] = rating;
    Firebase.database().ref().update(updates);

    dispatch({
      type: RATING_UPDATED
    })
  }
}

export function getReviewsByUser(appUserId, userId) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).orderByChild('lastModified').on('value', reviewsSnapshot => {
      if (!reviewsSnapshot.exists()) {
        dispatch({
          type: GET_REVIEWS_BY_USER,
          payload: []
        })
      }
      let feedArray = [];
      Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', userSnapshot => {
        reviewsSnapshot.forEach(function(review) {
          Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
            Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + appUserId + '/' + review.key).on('value', savesSnapshot => {
              Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).on('value', commentCountSnapshot => {
                const reviewObject = {};
                const key = { id: review.key };
                const reviewer = { reviewer: userSnapshot.val() };
                reviewer.reviewer.userId = userId
                let isLiked = false;
                if (likesSnapshot.val()) {
                  isLiked = searchLikes(appUserId, likesSnapshot.val());
                }
                let likes = {
                  isLiked: isLiked
                }

                let saved = {
                  isSaved: savesSnapshot.exists()
                }

                let commentObject = {};
                if (commentCountSnapshot.exists()) {
                  commentObject.comments = {
                        lastComment: '',
                        commentorImage: '',
                        username: ''                  
                  }
                }
                
                Object.assign(reviewObject, review.val(), key, reviewer, likes, saved, commentObject);

                if (review.val().subject && review.val().subject.images) {
                  reviewObject.subject.image = Helpers.getImagePath(review.val().subject.images);
                }

                feedArray = [reviewObject].concat(feedArray);
                feedArray.sort(lastModifiedDesc);
                dispatch({
                  type: GET_REVIEWS_BY_USER,
                  payload: feedArray
                })
              })
            })  
          })
        });
      })
    })
  }
}

export function getLikesOrSavesByUser(appUserId, userId, path) {
  return dispatch => {
    let feedArray = [];
    Firebase.database().ref(path + '/' + userId).orderByChild('lastModified').on('value', likesByUserSnapshot => {
      if (!likesByUserSnapshot.exists()) {
        dispatch({
          type: GET_LIKES_OR_SAVES_BY_USER,
          payload: []
        })
      }
      likesByUserSnapshot.forEach(function(likeItem) {
        Firebase.database().ref(Constants.REVIEWS_PATH + '/' + likeItem.key).on('value', reviewSnapshot => {
          Firebase.database().ref(Constants.USERS_PATH + '/' + reviewSnapshot.val().userId).on('value', userSnapshot => {
            Firebase.database().ref(Constants.LIKES_PATH + '/' + likeItem.key).on('value', likesSnapshot => {
              Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + appUserId + '/' + likeItem.key).on('value', savesSnapshot => {
                Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).on('value', commentCountSnapshot => {
                  Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewSnapshot.val().subjectId).on('value', subjectSnapshot => {
                    const reviewObject = {};
                    const key = { id: likeItem.key };
                    const reviewer = { reviewer: userSnapshot.val() };
                    let isLiked = false;
                    if (likesSnapshot.val()) {
                      isLiked = searchLikes(appUserId, likesSnapshot.val());
                    }
                    let likes = { 
                      isLiked: isLiked
                    }

                    let saved = {
                      isSaved: savesSnapshot.exists()
                    }

                    let commentObject = {};
                    if (commentCountSnapshot.exists()) {
                      commentObject.comments = {
                            lastComment: '',
                            commentorImage: '',
                            username: ''                  
                      }
                    }

                    Object.assign(reviewObject, reviewSnapshot.val(), key, reviewer, likes, saved, commentObject);
                    reviewObject.subject = subjectSnapshot.val();
                    reviewObject.subject.image = reviewObject.subject.images ? Helpers.getImagePath(reviewObject.subject.images) : '';

                    feedArray = [reviewObject].concat(feedArray);
                    feedArray.sort(lastModifiedDesc);

                    dispatch({
                      type: GET_LIKES_OR_SAVES_BY_USER,
                      payload: feedArray
                    })
                  })
                })
              })
            })
          })
        });
      })
    })
  }
}

export function unloadReviewsByUser(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).orderByChild('lastModified').once('value', reviewsSnapshot => {
      reviewsSnapshot.forEach(function(review) {
        Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).off();
        Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + userId + '/' + review.key).off();
        Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).off();
      })
    })
    Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).off();

    dispatch({
      type: REVIEWS_BY_USER_UNLOADED
    });
  }
}

export function unloadLikesOrSavesByUser(userId, path) {
  return dispatch => {
    Firebase.database().ref(path + '/' + userId).orderByChild('lastModified').once('value', likesByUserSnapshot => {
      likesByUserSnapshot.forEach(function(likeItem) {
        Firebase.database().ref(Constants.REVIEWS_PATH + '/' + likeItem.key).once('value', reviewSnapshot => {
          Firebase.database().ref(Constants.LIKES_PATH + '/' + likeItem.key).off();
          Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + userId + '/' + likeItem.key).off();
          Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).off();
          Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewSnapshot.val().subjectId).off();
        })
        Firebase.database().ref(Constants.REVIEWS_PATH + '/' + likeItem.key).off();
      })
    })
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).orderByChild('lastModified').off();

    dispatch({
      type: UNLOAD_LIKES_OR_SAVES_BY_USER
    })
  }
}

export function lastModifiedDesc(a, b) {
  if (a.lastModified > b.lastModified)
    return -1;
  if (a.lastModified < b.lastModified)
    return 1;
  return 0;
}

export function lastModifiedAsc(a, b) {
  if (a.lastModified < b.lastModified)
    return -1;
  if (a.lastModified > b.lastModified)
    return 1;
  return 0;
}

export function searchLikes(uid, likes) {
  for (var key in likes) {
    if (key === uid) {
      return true;
    }
  }
  return false;
}

export function getUserFeed(uid, tag) {
  return dispatch => {
    if (!uid) {
      dispatch({
        type: HOME_PAGE_NO_AUTH
      })
    }
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + uid).on('value', followedSnapshot => {
      if (!followedSnapshot.exists()) {
        dispatch({
          type: GET_USER_FEED,
          payload: []
        })
      }
      let userList = [uid];
      followedSnapshot.forEach(function(followedUser) {
        userList.push(followedUser.key);
      })
      let feedArray = [];
      userList.forEach(function(followedId) {
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + followedId).orderByChild('lastModified').on('value', reviewsSnapshot => {
          reviewsSnapshot.forEach(function(review) {
            Firebase.database().ref(Constants.USERS_PATH + '/' + followedId).on('value', userSnapshot => {
              Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
                Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).on('value', savesSnapshot => {
                  Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).on('value', commentCountSnapshot => {
                    let reviewObject = {};
                    let key = { id: review.key };
                    let reviewer = { reviewer: userSnapshot.val() };
                    reviewer.reviewer.userId = followedId;
                    let isLiked = false;
                    if (likesSnapshot.val()) {
                      isLiked = searchLikes(uid, likesSnapshot.val());
                    }
                    let likes = { 
                      isLiked: isLiked
                    }
                    let saved = {
                      isSaved: savesSnapshot.exists()
                    }

                    let commentObject = {};
                    if (commentCountSnapshot.exists()) {
                      commentObject.comments = {
                            lastComment: '',
                            commentorImage: '',
                            username: ''                  
                      }
                    }

                    Object.assign(reviewObject, key, reviewer, review.val(), likes, saved, commentObject);

                    // get subject's tags
                    if (review.val().subject && review.val().subject.tags) {
                      reviewObject.subject.tag = Helpers.getTagsArray(review.val().subject.tags);
                    }

                    // get subject images
                    if (review.val().subject && review.val().subject.images) {
                      reviewObject.subject.image = Helpers.getImagePath(review.val().subject.images);
                    }

                    feedArray = [reviewObject].concat(feedArray);
                    feedArray.sort(lastModifiedDesc);

                    dispatch({
                      type: GET_USER_FEED,
                      payload: feedArray
                    })
                  })
                })
              })
            })
          });
        })
      });
    })
  }
}

export function likeReview(authenticated, review) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    const updates = {};
    updates[`/${Constants.LIKES_PATH}/${review.id}/${authenticated}`] = true;
    updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${review.id}`] = true;
    Firebase.database().ref().update(updates).then(response => {
      Helpers.incrementCount(Constants.LIKES_COUNT, review.id, review.subjectId, review.reviewer.userId);
      Helpers.sendInboxMessage(authenticated, review.reviewer.userId, Constants.LIKE_MESSAGE, review);

      dispatch({
        type: REVIEW_LIKED,
        meta: {
          mixpanel: {
            event: 'Liked review',
            props: {
              subjectId: review.subjectId
            }
          }
        }
      })
    })
    .catch(error => {
      console.log(error);
    })
  }
}

export function unLikeReview(authenticated, review) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    const updates = {};
    updates[`/${Constants.LIKES_PATH}/${review.id}/${authenticated}`] = null;
    updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${review.id}`] = null;
    Firebase.database().ref().update(updates).then(response => {
      Helpers.decrementCount(Constants.LIKES_COUNT, review.id, review.subjectId, review.reviewer.userId);
      dispatch({
        type: REVIEW_UNLIKED
      })
    })
    .catch(error => {
      console.log(error);
    })
  }
}

export function saveReview(authenticated, review) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    else {
      const updates = {};
      updates[`/${Constants.SAVES_BY_USER_PATH}/${authenticated}/${review.id}`] = true;
      Firebase.database().ref().update(updates).then(response => {
        Helpers.incrementCount(Constants.SAVES_COUNT, review.id, review.subjectId, review.reviewer.userId);
        Helpers.sendInboxMessage(authenticated, review.reviewer.userId, Constants.SAVE_MESSAGE, review);

        dispatch({
          type: REVIEW_SAVED,
          meta: {
            mixpanel: {
              event: 'Saved review',
              props: {
                subjectId: review.subjectId
              }
            }
          }
        })
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
}
export function unSaveReview(authenticated, review) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    else {
      const updates = {};
      updates[`/${Constants.SAVES_BY_USER_PATH}/${authenticated}/${review.id}`] = null;
      Firebase.database().ref().update(updates).then(response => {
        Helpers.decrementCount(Constants.SAVES_COUNT, review.id, review.subjectId, review.reviewer.userId);
        dispatch({
          type: REVIEW_UNSAVED
        })
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
}

export function unloadUserFeed(uid) {
  return dispatch => {
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + uid).once('value', followedSnapshot => {
      followedSnapshot.forEach(function(followedUser) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + followedUser.key).off();    
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + followedUser.key).once('value', userReviewsSnapshot => {
          userReviewsSnapshot.forEach(function(review) {
            Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).off();
            Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).off();
            Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).off();
          })
        })
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + followedUser.key).off();
      })
    })
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + uid).off();

    dispatch({
      type: USER_FEED_UNLOADED
    });
  }
}

export function getGlobalFeed(uid, tag) {
  return dispatch => {   
    Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').on('value', reviewsSnapshot => {
      if (!reviewsSnapshot.exists()) {
        dispatch({
          type: GET_GLOBAL_FEED,
          payload: []
        })
      }
      let feedArray = [];
      reviewsSnapshot.forEach(function(review) {
        let reviewerId = review.val().userId;
        Firebase.database().ref(Constants.USERS_PATH + '/' + reviewerId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
            Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).on('value', savesSnapshot => {
              Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).on('value', commentCountSnapshot => {
                Firebase.database().ref(Constants.SUBJECTS_PATH +'/' + review.val().subjectId).on('value', subjectSnapshot => {
                  let reviewObject = {};
                  let key = { id: review.key };
                  let reviewer = { reviewer: userSnapshot.val() };
                  reviewer.reviewer.userId = reviewerId;
                  let isLiked = false;
                  if (likesSnapshot.exists()) {
                    isLiked = searchLikes(uid, likesSnapshot.val());
                  }
                  let likes = { 
                    isLiked: isLiked
                  }
                  let saved = {
                    isSaved: savesSnapshot.exists()
                  }
                  let commentObject = {};
                  if (commentCountSnapshot.exists()) {
                    commentObject.comments = {
                          lastComment: '',
                          commentorImage: '',
                          username: ''                  
                    }
                  }

                  Object.assign(reviewObject, key, reviewer, review.val(), likes, saved, commentObject);
                  reviewObject.subject = subjectSnapshot.val();
                  reviewObject.subject.image = reviewObject.subject.images ? Helpers.getImagePath(reviewObject.subject.images) : '';

                   // get subject's tags
                    if (reviewObject.subject.tags) {
                      reviewObject.subject.tag = Helpers.getTagsArray(reviewObject.subject.tags);
                    }

                  feedArray = [reviewObject].concat(feedArray);
                  feedArray.sort(lastModifiedDesc);

                  dispatch({
                    type: GET_GLOBAL_FEED,
                    payload: feedArray
                  })
                })
              })
            })
          })
        })
      });
    })
  }
}

export function unloadGlobalFeed(uid) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').on('value', reviewsSnapshot => {
      reviewsSnapshot.forEach(function(review) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + review.val().userId).off();
        Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).off();
        Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).off();
        Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).off();
        Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + review.val().subjectId).off();
      })
    })
    Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').off();

    dispatch({
      type: GLOBAL_FEED_UNLOADED
    })
  }
}

export function followerFeedCompare(a, b) {
  if (a.username < b.username)
    return -1;
  if (a.username > b.username)
    return 1;
  return 0;
}

export function getFollowers(userId, followPath) {
  return dispatch => {
    let followerArray = [];
    const current = Firebase.auth().currentUser.uid;
    Firebase.database().ref(followPath + '/' + userId).once('value', followersSnapshot => {
      followersSnapshot.forEach(function(follower) {
        let followerId = follower.key;
        Firebase.database().ref(Constants.USERS_PATH + '/' + followerId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + current + '/' + followerId).on('value', isFollowingSnapshot => {
            let userObject = {};
            let key = { userId: followerId };
            let followingObject = { isFollowing: false };
            if (isFollowingSnapshot.exists()) {
              followingObject.isFollowing = true;
            }
            Object.assign(userObject, key, userSnapshot.val(), followingObject);

            followerArray = [userObject].concat(followerArray);
            followerArray.sort(followerFeedCompare);

            // let indexFound = searchFeedArray(key.userId, followerArray);
            // if (indexFound > -1) {
            //   followerArray[indexFound] = userObject;
            // }
            // else followerArray = followerArray.concat(userObject);

            dispatch({
              type: GET_FOLLOWERS,
              payload: followerArray
            })
          })
        })
      })
    })
  }
}

export function unloadFollowers(userId, followPath) {
  return dispatch => {
    const current = Firebase.auth().currentUser.uid;
    Firebase.database().ref(followPath + '/' + userId).on('value', followersSnapshot => {
      followersSnapshot.forEach(function(follower) {
        let followerId = follower.key;
        Firebase.database().ref(Constants.USERS_PATH + '/' + followerId).off();
        Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + current + '/' + followerId).off();
      })
    })
    Firebase.database().ref(followPath + '/' + userId).off();

    dispatch({
      type: UNLOAD_FOLLOWERS
    })
  }
}

export function emptyFriendSelector() {
  return dispatch => {
    dispatch({
      type: EMPTY_FRIEND_SELECTOR
    })
  }
}

export function getFriends(userId) {
  return dispatch => {
    if (!userId) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    else {
      let friendArray = [];
      Firebase.database().ref(Constants.HAS_FOLLOWERS_PATH + '/' + userId).once('value', snapshot => {
        snapshot.forEach(function(friend) {
          Firebase.database().ref(Constants.USERS_PATH + '/' + friend.key).once('value', userSnapshot => {
            let userObject = {};
            Object.assign(userObject, {id: friend.key}, userSnapshot.val());
            friendArray = [userObject].concat(friendArray);
            friendArray.sort(followerFeedCompare);

            dispatch({
              type: GET_FRIENDS,
              payload: friendArray
            })
          })
        })
      })
    }
  }
}

export function onUpdateFriendsCheckbox(label, selectedFriends) {
  return dispatch => {
    // if (selectedFriends.has(label)) {
    //   selectedFriends.delete(label);
    // } else {
    //   selectedFriends.add(label);
    // }
    if (!selectedFriends) {
      selectedFriends = [];
      selectedFriends.push(label)
    }
    else {
      let index = selectedFriends.indexOf(label);
      if (index > -1) {
        selectedFriends.splice(index, 1);
      }
      else selectedFriends.push(label);
    }

    dispatch({
      type: UPDATE_FRIENDS_CHECKBOX,
      payload: selectedFriends
    })
  }
}

export function onFriendSelectorSubmit(authenticated, selectedFriends, review, path=null) {
  return dispatch => {
    let recipientCount = 0;
    // for (const friendId of selectedFriends) {
    for (var i = 0; i < selectedFriends.length; i++) {
      recipientCount++;
      if (path === FORWARD_MODAL) Helpers.sendInboxMessage(authenticated, selectedFriends[i], Constants.FORWARD_MESSAGE, review);
      else Helpers.sendInboxMessage(authenticated, selectedFriends[i], Constants.DIRECT_MESSAGE, review);
      // console.log(friendId, 'is selected.');
      // Helpers.sendInboxMessage(authenticated, friendId, Constants.DIRECT_MESSAGE, review);
    }

    dispatch({
      type: FRIEND_SELECTOR_SUBMIT,
      selectedFriends: [],
      // selectedFriends: selectedFriends ? selectedFriends.clear() : new Set()
      path: path,
      meta: {
        mixpanel: {
          event: 'Direct send to friends',
          props: {
            recipients: recipientCount,
            subjectId: review.subjectId,
            source: (path === FORWARD_MODAL) ? FORWARD_MODAL : 'Create flow direct message'
          }
        }
      }
    })
  }
}

export function unmountFriendSelector(selectedFriends) {
  return dispatch => {
    dispatch({
      type: UNMOUNT_FREIND_SELECTOR,
      // payload: selectedFriends ? selectedFriends.clear() : new Set()
      payload: []
    })
  }
}

export function getInbox(authenticated) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    let inboxArray = [];
    Firebase.database().ref(Constants.INBOX_PATH + '/' + authenticated).on('value', inboxSnapshot => {
      if (!inboxSnapshot.exists()) {
        dispatch({
          type: GET_INBOX,
          payload: []
        })
      }

      inboxSnapshot.forEach(function(inboxChild) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + inboxChild.val().senderId).on('value', senderSnapshot => {
          let inboxObject = inboxChild.val();
          inboxObject.key = inboxChild.key;
          inboxObject.senderUsername = senderSnapshot.val().username;
          inboxObject.senderImage = senderSnapshot.val().image;

          inboxArray = [inboxObject].concat(inboxArray);
          inboxArray.sort(lastModifiedDesc);

          dispatch({
            type: GET_INBOX,
            payload: inboxArray
          })
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
      type: INBOX_UNLOADED
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
          type: GET_INBOX_COUNT,
          payload: messageCount - messagesRead
        })
      }
      else dispatch({
        type: GET_INBOX_COUNT,
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
          type: INBOX_COUNT_UPDATED
        })
      }
    })
  }
}

export function sendMixpanelEvent(eventName, params={}) {
  return dispatch => {
    dispatch({
      type: MIXPANEL_EVENT,
      meta: {
        mixpanel: {
          event: eventName,
          props: Object.assign({}, params)
        }
      }
    })
  }
}

export function applyTag(tag) {
  return dispatch => {
    dispatch({
      type: APPLY_TAG,
      payload: tag
    })
  }
}

export function showModal(type, review) {
  const uid = Firebase.auth().currentUser.uid;
  return dispatch => {
    switch (type) {
      case REVIEW_MODAL:
        if (review) {
          const subjectId = review.subjectId;
          const subject = Object.assign({}, review.subject);

          Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + uid).once('value', snapshot => {
            if (snapshot.exists()) {
              Firebase.database().ref(Constants.REVIEWS_PATH + '/' + snapshot.val().reviewId).once('value', reviewSnapshot => {
                dispatch({
                  type: SHOW_MODAL,
                  modalType: type,
                  subject: subject,
                  review: reviewSnapshot.exists() ? reviewSnapshot.val() : null,
                  reviewId: reviewSnapshot.exists() ? reviewSnapshot.key : null,
                  subjectId: subjectId,
                  rating: reviewSnapshot.exists() ? reviewSnapshot.val().rating : null,
                  caption: reviewSnapshot.exists() ? reviewSnapshot.val().caption : null,
                  image: Helpers.getImagePath(subject.images)
                })
              })
            }
            else {
              dispatch({
                type: SHOW_MODAL,
                modalType: type,
                subject: subject,
                subjectId: subjectId,
                image: Helpers.getImagePath(subject.images)
              })
            }
          })
        }
        break;
      default:
        dispatch({
          type: SHOW_MODAL,
          modalType: type,
          review: review
        })
    }
  }
}

export function hideModal(type) {
  return dispatch => {
    dispatch({
      type: HIDE_MODAL
    })
  }
}