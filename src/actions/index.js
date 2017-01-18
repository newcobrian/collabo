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
export const REVIEWS_BY_USER_UNLOADED = 'REVIEWS_BY_USER_UNLOADED';
export const GET_USER_FEED = 'GET_USER_FEED';
export const USER_FEED_UNLOADED = 'USER_FEED_UNLOADED';
export const HOME_PAGE_LOADED = 'HOME_PAGE_LOADED';
export const GET_GLOBAL_FEED = 'GET_GLOBAL_FEED';
export const APP_USER_LOADED = 'APP_USER_LOADED';
export const GET_FOLLOWING_COUNT = 'GET_FOLLOWING_COUNT';
export const GET_FOLLOWER_COUNT = 'GET_FOLLOWER_COUNT';
export const REVIEW_LIKED = 'REVIEW_LIKED';
export const REVIEW_UNLIKED = 'REVIEW_UNLIKED';
export const GET_FOLLOWERS = 'GET_FOLLOWERS';
export const GET_FOLLOWINGS = 'GET_FOLLOWINGS';
export const UNLOAD_FOLLOWERS = 'UNLOAD_FOLLOWERS';

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
      payload: Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + current + '/' + uid).off()
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
    Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + current + '/' + profile).on('value', snapshot => {
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
    Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + userId).once('value', snapshot => {
      dispatch({
        type: GET_FOLLOWING_COUNT,
        payload: snapshot.numChildren()
      })
    })
  }
}

export function getFollowerCount(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.FOLLOWERS_PATH + '/' + userId).once('value', snapshot => {
      dispatch({
        type: GET_FOLLOWER_COUNT,
        payload: snapshot.numChildren()
      })
    })
  }
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
      updates[`/${Constants.FOLLOWERS_PATH}/${following}/${follower}`] = null;
      updates[`/${Constants.FOLLOWINGS_PATH}/${follower}/${following}`] = null;
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

export function onUpdateField(key, value) {
  return dispatch => {
    dispatch({
      type: UPDATE_FIELD_EDITOR,
      key,
      value
    })
  }
}

export function onReviewSubmit(subject, review) {
  return dispatch => {
    const updates = {};
    const uid = Firebase.auth().currentUser.uid;
    const subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push().key;
    const reviewId = Firebase.database().ref(Constants.REVIEWS_PATH).push().key;
    const lastModified = Firebase.database.ServerValue.TIMESTAMP;
    const reviewMeta = {
        userId: Firebase.auth().currentUser.uid,
        subjectId: subjectId,
        lastModified: lastModified
    }

    const reviewObject = {};
    Object.assign(reviewObject, reviewMeta, review);

    updates[`/${Constants.SUBJECTS_PATH}/${subjectId}/`] = subject;
    updates[`/${Constants.REVIEWS_PATH}/${reviewId}/`] = reviewObject;
    updates[`/${Constants.REVIEWS_BY_USER_PATH}/${uid}/${reviewId}`] = { 
      subjectId: subjectId,
      rating: review.rating,
      caption: review.caption,
      lastModified: lastModified,
      title: subject.title,
      description: subject.description,
      image: subject.image
    };
    updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${reviewId}`] = {
      userId: uid,
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

export function getReview(reviewId) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).on('value', snapshot => {
      const review = snapshot.val();
      review.rater = {};
      Firebase.database().ref(Constants.USERS_PATH + '/' + review.userId).on('value', userSnapshot => {
        const userMeta = { username: userSnapshot.val().username, image: userSnapshot.val().image };
        Object.assign(review.rater, userMeta);
          dispatch({
            type: GET_REVIEW,
            payload: review
          });
      })
    });
  }
}

export function getComments(reviewId) {
  return dispatch => {
    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).orderByChild('timestamp').on('value', snapshot => {
      let comments = [];
      snapshot.forEach(function(childSnapshot) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + childSnapshot.val().userId).on('value', userSnapshot => {
          const key = { id: childSnapshot.key };
          const comment = { username: userSnapshot.val().username, image: userSnapshot.val().image };
          Object.assign(comment, childSnapshot.val(), key);
          comments = [comment].concat(comments);

          dispatch({
            type: GET_COMMENTS,
            payload: comments
          });
        })
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

export function unloadReview(reviewId) {
  return dispatch => {
    Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).once('value', snapshot => {
      Firebase.database().ref(Constants.USERS_PATH + '/' + snapshot.val().userId).off();
    });
    dispatch({
      type: REVIEW_UNLOADED,
      payload: Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId).off()
    });
  }
}

export function unloadComments(reviewId) {
  return dispatch => {
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

export function onCommentSubmit(reviewId, body) {
  return dispatch => {
    const userId = Firebase.auth().currentUser.uid;
    const comment = {
      userId: userId,
      body: body,
      timestamp: Firebase.database.ServerValue.TIMESTAMP
    }

    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewId).push(comment)
      .then(response => {
        dispatch({
          type: ADD_COMMENT
        })
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: ADD_COMMENT,
          payload: error
        })
      });
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

export function getReviewsByUser(appUserId, userId) {
  return dispatch => {
    let feedArray = [];
    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).orderByChild('lastModified').on('value', reviewsSnapshot => {
      Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', userSnapshot => {
        reviewsSnapshot.forEach(function(review) {
          Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
            const reviewObject = {};
            const key = { id: review.key };
            const reviewer = { reviewer: userSnapshot.val() };
            let isLiked = false;
            if (likesSnapshot.val()) {
              isLiked = searchLikes(appUserId, likesSnapshot.val());
            }
            let likes = { 
              likesCount: likesSnapshot.numChildren(), 
              isLiked: isLiked
            }
            Object.assign(reviewObject, review.val(), key, reviewer, likes);
            feedArray = [reviewObject].concat(feedArray);
            feedArray.sort(userFeedCompare);

            dispatch({
              type: GET_REVIEWS_BY_USER,
              payload: feedArray
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
      })
    })
    Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
    Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId).off();

    dispatch({
      type: REVIEWS_BY_USER_UNLOADED
    });
  }
}

export function userFeedCompare(a, b) {
  if (a.lastModified > b.lastModified)
    return -1;
  if (a.lastModified < b.lastModified)
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
    let feedArray = [];
    Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + uid).on('value', followedSnapshot => {
      followedSnapshot.forEach(function(followedUser) {
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + followedUser.key).orderByChild('lastModified').on('value', reviewsSnapshot => {
          reviewsSnapshot.forEach(function(review) {
            Firebase.database().ref(Constants.USERS_PATH + '/' + followedUser.key).on('value', userSnapshot => {
              Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
                let reviewObject = {};
                let key = { id: review.key };
                let reviewer = { reviewer: userSnapshot.val() };
                let isLiked = false;
                if (likesSnapshot.val()) {
                  isLiked = searchLikes(uid, likesSnapshot.val());
                }
                let likes = { 
                  likesCount: likesSnapshot.numChildren(), 
                  isLiked: isLiked
                }
                Object.assign(reviewObject, key, reviewer, review.val(), likes);
                feedArray = [reviewObject].concat(feedArray);
                feedArray.sort(userFeedCompare);

                dispatch({
                  type: GET_USER_FEED,
                  payload: feedArray
                })
              })
            })
          });
        })
      });
    })
  }
}

export function likeReview(userId, reviewId) {
  const updates = {};
  updates[`/${Constants.LIKES_PATH}/${reviewId}/${userId}`] = true;
  Firebase.database().ref().update(updates);
  return dispatch => {
    dispatch({
      type: REVIEW_LIKED
    })
  }
}

export function unLikeReview(userId, reviewId) {
  const updates = {};
  updates[`/${Constants.LIKES_PATH}/${reviewId}/${userId}`] = null;
  Firebase.database().ref().update(updates);
  return dispatch => {
    dispatch({
      type: REVIEW_LIKED
    })
  }
}

export function unloadUserFeed(uid) {
  return dispatch => {
    Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + uid).once('value', followedSnapshot => {
      followedSnapshot.forEach(function(followedUser) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + followedUser.key).off();    
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + followedUser.key).once('value', userReviewsSnapshot => {
          userReviewsSnapshot.forEach(function(review) {
            Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).off();
          })
        })
        Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + followedUser.key).off();
      })
    })
    Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + uid).off();

    dispatch({
      type: USER_FEED_UNLOADED
    });
  }
}

export function onMainViewTabClick (tab, payload) {
  return dispatch => {
    dispatch({ type: 'CHANGE_TAB', tab, payload })
  }
}

export function onHomePageLoad(tab) {
  return dispatch => {
    dispatch({ type: HOME_PAGE_LOADED, payload: tab })
  }
}

export function getGlobalFeed(uid) {
  return dispatch => {
    let feedArray = [];
    Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').on('value', reviewsSnapshot => {
      reviewsSnapshot.forEach(function(review) {
        let reviewerId = review.val().userId;
        Firebase.database().ref(Constants.USERS_PATH + '/' + reviewerId).on('value', userSnapshot => {
          if (reviewerId !== uid) {
            let reviewObject = {};
            let key = { id: review.key };
            let reviewer = { reviewer: userSnapshot.val() };
            Object.assign(reviewObject, key, reviewer, review.val());
            feedArray = [reviewObject].concat(feedArray);
            feedArray.sort(userFeedCompare);

            dispatch({
              type: GET_GLOBAL_FEED,
              payload: feedArray
            })
          }
        })
      });
    })
  }
}

// export function searchFeedArray(key, arr) {
//   for (var i = 0; i < arr.length; i++) {
//     if (arr[i].userId === key) {
//       return i;
//     }
//   }
//   return -1;
// }

export function getFollowers(userId, followPath) {
  return dispatch => {
    let followerArray = [];
    const current = Firebase.auth().currentUser.uid;
    Firebase.database().ref(followPath + '/' + userId).on('value', followersSnapshot => {
      followersSnapshot.forEach(function(follower) {
        let followerId = follower.key;
        Firebase.database().ref(Constants.USERS_PATH + '/' + followerId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + current + '/' + followerId).on('value', isFollowingSnapshot => {
            let userObject = {};
            let key = { userId: followerId };
            let followingObject = { isFollowing: false };
            if (isFollowingSnapshot.exists()) {
              followingObject.isFollowing = true;
            }
            Object.assign(userObject, key, userSnapshot.val(), followingObject);

            followerArray = [userObject].concat(followerArray);

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
        Firebase.database().ref(Constants.FOLLOWINGS_PATH + '/' + current + '/' + followerId).off();
      })
    })
    Firebase.database().ref(followPath + '/' + userId).off();

    dispatch({
      type: UNLOAD_FOLLOWERS
    })
  }
}


