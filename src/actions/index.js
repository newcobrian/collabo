import Firebase from 'firebase';
import * as Constants from '../constants'
import { sendInboxMessage } from '../helpers'
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
export const UPDATE_FIELD_EDITOR = 'UPDATE_FIELD_EDITOR';
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
            payload: userId
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
          payload: response.uid
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

export function saveSettings(user, currentUsername) {
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

          dispatch({
            type: SETTINGS_SAVED,
            payload:
              Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user)
          });  
        }
      });
    } else {
        dispatch({
          type: SETTINGS_SAVED,
          payload:
            Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').update(user)
        });  
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
    sendInboxMessage(following, follower, Constants.FOLLOW_MESSAGE, null);
    Firebase.database().ref().update(updates);
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

export function onEditorLoad() {
  return dispatch => {
    dispatch({
      type: EDITOR_PAGE_LOADED
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

export function onCreateLoad(authenticated) {
  return dispatch => {
    if(!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    dispatch({
      type: CREATE_PAGE_LOADED
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
    const subject = {};

    if (result && result.id) {
      // get the user's review if they already reviewed it
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + result.id + '/' + userId).once('value', reviewSnapshot => {
        // put together subject info
        subject.title = result.value;
        if (result.url) subject.url = result.url;
        if (result.description) subject.description = result.description;
        if (result.image) subject.image = result.image;

        let dispatchObject = {
          type: CREATE_SUBJECT_LOADED,
          payload: subject,
          review: reviewSnapshot.val(),
          rating: null,
          caption: null,
          subjectId: result.id
        };
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
              subject.image = photoURL;
            }

            dispatchObject.payload = subject;

            dispatch(dispatchObject);
          })
        }
        else if (result._service === 'amazon') {
          const amazonURL = Constants.AMAZON_SEARCH_URL + result.id;
          fetch(amazonURL).then(response => response.json()).then(json => {
            if (json.images) {
              if (json.images.large) {
                subject.image = json.images.large;
              }
              else if (json.images.medium) {
                subject.image = json.images.medium;
              }
              else if (json.images.small) {
                subject.image = json.images.small;
              }
            }
            if (json.reviews) {
              if (json.reviews.ProductDescription) subject.description = json.reviews.ProductDescription;
            }

            dispatchObject.payload = subject;
            dispatch(dispatchObject);
          })
        }
        else {
          dispatch(dispatchObject);
        }
      })
    }
    else dispatch({
      type: CREATE_SUBJECT_LOADED,
      payload: null,
      key: null,
      rating: null,
      caption: null
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
      type: UPDATE_FIELD_EDITOR,
      key,
      value
    })
  }
}

export function onReviewSubmit(key, subject, review, rid) {
  return dispatch => {
    const updates = {};
    const uid = Firebase.auth().currentUser.uid;
    let subjectId = {};

    if (key) {
      subjectId = key;
      Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key).once('value', subjectSnapshot => {
        if (!subjectSnapshot.exists()) {
          Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + key).set(subject);
        }
      })
    }
    else {
      subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push().key;
      updates[`/${Constants.SUBJECTS_PATH}/${subjectId}/`] = subject;
    }

    let reviewId = rid ? rid : Firebase.database().ref(Constants.REVIEWS_PATH).push().key;
    const lastModified = Firebase.database.ServerValue.TIMESTAMP;
    const reviewMeta = {
        userId: Firebase.auth().currentUser.uid,
        subjectId: subjectId,
        lastModified: lastModified
    }

    const reviewObject = {};
    Object.assign(reviewObject, reviewMeta, review);

    updates[`/${Constants.REVIEWS_PATH}/${reviewId}/`] = reviewObject;

    let reviewsByUserObject = {
      rating: review.rating,
      caption: review.caption,
      lastModified: lastModified,
    }

    let subjectObject = subject;
    reviewsByUserObject.subjectId = subjectId;
    reviewsByUserObject.subject = subjectObject;

    updates[`/${Constants.REVIEWS_BY_USER_PATH}/${uid}/${reviewId}`] = reviewsByUserObject;
    updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${uid}`] = {
      reviewId: reviewId,
      rating: review.rating,
      caption: review.caption,
      lastModified: lastModified
    };

    Firebase.database().ref().update(updates)
      .then(response => {
        dispatch({
          type: REVIEW_SUBMITTED,
          subjectId: subjectId,
          reviewId: reviewId
        })
      })
      .catch(error => {
        console.log(error);
      });
  }
}

export function getSubject(subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', snapshot => {
      dispatch({
        type: GET_SUBJECT,
        payload: snapshot.val()
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
              let review = reviewSnapshot.val();
              review.id = reviewSnapshot.key;
              review.reviewer = {};
              let userMeta = { username: userSnapshot.val().username, image: userSnapshot.val().image };
              Object.assign(review.reviewer, userMeta);

              review.isLiked = false
              review.likesCount = 0;
              if (likesSnapshot.val()) {
                review.isLiked = searchLikes(authenticated, likesSnapshot.val());
                review.likesCount = likesSnapshot.numChildren()
              }

              review.isSaved = savesSnapshot.exists();

              dispatch({
                type: GET_REVIEW,
                payload: review
              });
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
            review.likesCount = 0;
            if (likesSnapshot.val()) {
              review.isLiked = searchLikes(authenticated, likesSnapshot.val());
              review.likesCount = likesSnapshot.numChildren()
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
                  review.likesCount = 0;
                  if (likesSnapshot.val()) {
                    review.isLiked = searchLikes(authenticated, likesSnapshot.val());
                    review.likesCount = likesSnapshot.numChildren()
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
      let comments = [];
      snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.exists()) {
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
        }
      });
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

    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.id).push(comment);

    // send message to original review poster
    sendInboxMessage(userId, review.userId, Constants.COMMENT_ON_REVIEW_MESSAGE, review);
    const sentArray = [review.userId];

    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.id).once('value', commentsSnapshot => {
      commentsSnapshot.forEach(function(comment) {
        let commenterId = comment.val().userId;
        // if not commentor or in sent array, then send a message
        if (commenterId !== userId && (sentArray.indexOf(commenterId) === -1)) {
          sendInboxMessage(userId, commenterId, Constants.COMMENT_ON_COMMENT_MESSAGE, review);
          sentArray.push(commenterId);
        }
      })
    })

    dispatch({
      type: ADD_COMMENT
    })
  }
}

export function onDeleteComment(reviewId, commentId) {
  return dispatch => {    
    dispatch({
      type: DELETE_COMMENT,
      payload: Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId + '/' + commentId).remove()
    });
  };
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
    let feedArray = [];
    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).orderByChild('lastModified').on('value', reviewsSnapshot => {
      if (!reviewsSnapshot.exists()) {
        dispatch({
          type: GET_REVIEWS_BY_USER,
          payload: []
        })
      }
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
                  likesCount: likesSnapshot.numChildren(), 
                  isLiked: isLiked
                }

                let saved = {
                  isSaved: savesSnapshot.exists()
                }

                let commentObject = {};
                if (commentCountSnapshot.exists()) {
                  commentObject.comments = {
                        commentsCount: commentCountSnapshot.numChildren(),
                        lastComment: '',
                        commentorImage: '',
                        username: ''                  
                  }
                }
                
                Object.assign(reviewObject, review.val(), key, reviewer, likes, saved, commentObject);
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
                      likesCount: likesSnapshot.numChildren(), 
                      isLiked: isLiked
                    }

                    let saved = {
                      isSaved: savesSnapshot.exists()
                    }

                    let commentObject = {};
                    if (commentCountSnapshot.exists()) {
                      commentObject.comments = {
                            commentsCount: commentCountSnapshot.numChildren(),
                            lastComment: '',
                            commentorImage: '',
                            username: ''                  
                      }
                    }

                    reviewObject.subject = subjectSnapshot.val();

                    Object.assign(reviewObject, reviewSnapshot.val(), key, reviewer, likes, saved, commentObject);
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

export function getUserFeed(uid) {
  return dispatch => {
    if (!uid) {
      dispatch({
        type: HOME_PAGE_NO_AUTH
      })
    }
    let feedArray = [];
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + uid).on('value', followedSnapshot => {
      followedSnapshot.forEach(function(followedUser) {
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + followedUser.key).orderByChild('lastModified').on('value', reviewsSnapshot => {
          reviewsSnapshot.forEach(function(review) {
            Firebase.database().ref(Constants.USERS_PATH + '/' + followedUser.key).on('value', userSnapshot => {
              Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
                Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).on('value', savesSnapshot => {
                  Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).on('value', commentCountSnapshot => {
                    let reviewObject = {};
                    let key = { id: review.key };
                    let reviewer = { reviewer: userSnapshot.val() };
                    reviewer.reviewer.userId = followedUser.key
                    let isLiked = false;
                    if (likesSnapshot.val()) {
                      isLiked = searchLikes(uid, likesSnapshot.val());
                    }
                    let likes = { 
                      likesCount: likesSnapshot.numChildren(), 
                      isLiked: isLiked
                    }

                    let saved = {
                      isSaved: savesSnapshot.exists()
                    }

                    let commentObject = {};
                    if (commentCountSnapshot.exists()) {
                      commentObject.comments = {
                            commentsCount: commentCountSnapshot.numChildren(),
                            lastComment: '',
                            commentorImage: '',
                            username: ''                  
                      }
                    }

                    Object.assign(reviewObject, key, reviewer, review.val(), likes, saved, commentObject);
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
    Firebase.database().ref().update(updates);

    sendInboxMessage(authenticated, review.reviewer.userId, Constants.LIKE_MESSAGE, review);

    dispatch({
      type: REVIEW_LIKED
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
    Firebase.database().ref().update(updates);

    dispatch({
      type: REVIEW_UNLIKED
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
    const updates = {};
    updates[`/${Constants.SAVES_BY_USER_PATH}/${authenticated}/${review.id}`] = true;
    Firebase.database().ref().update(updates);

    dispatch({
      type: REVIEW_SAVED
    })
  }
}
export function unSaveReview(authenticated, review) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    const updates = {};
    updates[`/${Constants.SAVES_BY_USER_PATH}/${authenticated}/${review.id}`] = null;
    Firebase.database().ref().update(updates);

    dispatch({
      type: REVIEW_UNSAVED
    })
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

export function getGlobalFeed(uid) {
  return dispatch => {
    let feedArray = [];
    Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').on('value', reviewsSnapshot => {
      if (!reviewsSnapshot.exists()) {
        dispatch({
          type: GET_GLOBAL_FEED,
          payload: []
        })
      }
      reviewsSnapshot.forEach(function(review) {
        let reviewerId = review.val().userId;
        Firebase.database().ref(Constants.USERS_PATH + '/' + reviewerId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
            Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).on('value', savesSnapshot => {
              Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).on('value', commentCountSnapshot => {
                Firebase.database().ref(Constants.SUBJECTS_PATH +'/' + review.val().subjectId).on('value', subjectSnapshot => {
                  if (reviewerId !== uid) {
                    let reviewObject = {};
                    let key = { id: review.key };
                    let reviewer = { reviewer: userSnapshot.val() };
                    let isLiked = false;
                    if (likesSnapshot.exists()) {
                      isLiked = searchLikes(uid, likesSnapshot.val());
                    }
                    let likes = { 
                      likesCount: likesSnapshot.numChildren(), 
                      isLiked: isLiked
                    }
                    let saved = {
                      isSaved: savesSnapshot.exists()
                    }
                    let commentObject = {};
                    if (commentCountSnapshot.exists()) {
                      commentObject.comments = {
                            commentsCount: commentCountSnapshot.numChildren(),
                            lastComment: '',
                            commentorImage: '',
                            username: ''                  
                      }
                    }

                    reviewObject.subject = subjectSnapshot.val();
                    Object.assign(reviewObject, key, reviewer, review.val(), likes, saved, commentObject);
                    feedArray = [reviewObject].concat(feedArray);
                    feedArray.sort(lastModifiedDesc);

                    dispatch({
                      type: GET_GLOBAL_FEED,
                      payload: feedArray
                    })
                  }
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


