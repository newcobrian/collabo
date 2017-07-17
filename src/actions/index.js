import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import 'whatwg-fetch';

export const AUTH_ERROR = 'AUTH_ERROR';
export const AUTH_USER = 'AUTH_USER';
export const UNLOAD_AUTH = 'UNLOAD_AUTH';
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
export const GET_LIKES_OR_SAVES_BY_USER = 'GET_LIKES_OR_SAVES_BY_USER';
export const GET_LIKES_BY_USER = 'GET_LIKES_BY_USER';
export const REVIEWS_BY_USER_UNLOADED = 'REVIEWS_BY_USER_UNLOADED';
export const ITINERARIES_BY_USER_UNLOADED = 'ITINERARIES_BY_USER_UNLOADED';
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
export const ITINERARY_DELETED = 'ITINERARY_DELETED';
export const SET_IN_PROGRESS = 'SET_IN_PROGRESS';
export const MIXPANEL_EVENT = 'MIXPANEL_EVENT';
export const APPLY_TAG = 'APPLY_TAG';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const UNMOUNT_FREIND_SELECTOR = 'UNMOUNT_FREIND_SELECTOR';
export const FORWARD_MODAL = 'FORWARD_MODAL'
export const REVIEW_MODAL = 'REVIEW_MODAL'
export const SAVE_MODAL = 'SAVE_MODAL'
export const NEW_ITINERARY_MODAL = 'NEW_ITINERARY_MODAL'
export const DELETE_ITINERARY_MODAL = 'DELETE_ITINERARY_MODAL'
export const SHOW_DELETE_ITINERARY_MODAL = 'SHOW_DELETE_ITINERARY_MODAL'
export const DELETE_PICTURE_MODAL = 'DELETE_PICTURE_MODAL'
export const SHOW_DELETE_PICTURE_MODAL = 'SHOW_DELETE_PICTURE_MODAL'
export const ITINERARY_CREATED = 'ITINERARY_CREATED'
export const ITINERARY_PAGE_LOADED = 'ITINERARY_PAGE_LOADED'
export const ITINERARY_PAGE_UNLOADED = 'ITINERARY_PAGE_UNLOADED'
export const ITINERARY_UPDATED = 'ITINERARY_UPDATED'
export const EDITOR_PAGE_NO_AUTH = 'EDITOR_PAGE_NO_AUTH'
export const GET_ITINERARIES_BY_USER = 'GET_ITINERARIES_BY_USER'
export const ITINERARY_COMMMENTS_LOADED = 'ITINERARY_COMMMENTS_LOADED'
export const ITINERARY_COMMMENTS_UNLOADED = 'ITINERARY_COMMMENTS_UNLOADED'
export const SAVE_TO_ITINERARIES_LIST_LOADED = 'SAVE_TO_ITINERARIES_LIST_LOADED'
export const ADDED_TO_ITINERARY = 'ADDED_TO_ITINERARY'
export const SUBJECT_DUPLICATE = 'SUBJECT_DUPLICATE'
export const SHOW_SNACKBAR = 'SHOW_SNACKBAR'
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR'
export const SHOW_NEW_ITINERARY_MODAL = 'SHOW_NEW_ITINERARY_MODAL'
export const CREATE_PAGE = 'CREATE_PAGE'
export const EDITOR_PAGE = 'EDITOR_PAGE'
export const ITINERARY_PAGE = 'ITINERARY_PAGE'
export const OPEN_LIGHTBOX = 'OPEN_LIGHTBOX'
export const CLOSE_LIGHTBOX = 'CLOSE_LIGHTBOX'
export const PREV_LIGHTBOX = 'PREV_LIGHTBOX'
export const NEXT_LIGHTBOX = 'NEXT_LIGHTBOX'
export const USER_DOESNT_EXIST = 'USER_DOESNT_EXIST'
export const SEND_INBOX_MESSAGE = 'Send inbox message'
export const LOADED_ALL_USERS = 'LOADED_ALL_USERS'
export const UNLOADED_ALL_USERS = 'UNLOADED_ALL_USERS'
export const GOOGLE_MAP_LOADED = 'GOOGLE_MAP_LOADED'
export const GET_PLACES_FEED = 'GET_PLACES_FEED'
export const UNLOAD_PLACES_FEED = 'UNLOAD_PLACES_FEED'
export const LOAD_PLACES = 'LOAD_PLACES'
export const COVER_PHOTO_UPDATED = 'COVER_PHOTO_UPDATED'
export const GET_USER_REVIEW = 'GET_USER_REVIEW'
export const UNLOAD_USER_REVIEW = 'UNLOAD_USER_REVIEW'
export const FORGOT_PASSWORD_SENT = 'FORGOT_PASSWORD_SENT'
export const FOLLOWER_ADDED_ACTION = 'FOLLOWER_ADDED_ACTION'
export const FOLLOWER_REMOVED_ACTION = 'FOLLOWER_REMOVED_ACTION'
export const USER_ADDED_ACTION = 'USER_ADDED_ACTION'
export const USER_REMOVED_ACTION = 'USER_REMOVED_ACTION'
export const LIKES_BY_USER_ADDED_ACTION = 'LIKES_BY_USER_ADDED_ACTION'
export const LIKES_BY_USER_REMOVED_ACTION = 'LIKES_BY_USER_REMOVED_ACTION'
export const ITINERARY_ADDED_ACTION = 'ITINERARY_ADDED_ACTION'
export const ITINERARY_REMOVED_ACTION = 'ITINERARY_REMOVED_ACTION'
export const ITINERARY_CHANGED_ACTION = 'ITINERARY_CHANGED_ACTION'
export const ITINERARIES_BY_USER_REMOVED_ACTION = 'ITINERARIES_BY_USER_REMOVED_ACTION'

export * from './authActions';
export * from './itineraryActions';

export function unloadProfileUser(uid) {
  return dispatch => {
    dispatch({
      type: PROFILE_USER_UNLOADED,
      payload: Firebase.database().ref(Constants.USERS_PATH + '/' + uid + '/').off()
    });
  }
}

export function unloadProfileFollowing(auth, uid) {
  return dispatch => {
    dispatch({
      type: PROFILE_FOLLOWING_UNLOADED,
      payload: Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth + '/' + uid).off()
    });
  }
}

export function getProfileUser(userId) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_PATH + '/' + userId + '/').on('value', snapshot => {
      let profile = Object.assign( {}, { userId: userId }, snapshot.val());
      dispatch({
        type: GET_USER,
        payload: profile
      });
    });
  };
}

export function checkFollowing(auth, profile) {
  return dispatch => {
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth + '/' + profile).on('value', snapshot => {
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
    const updates = {};
    if (authenticated && follower) {
      updates[`/${Constants.HAS_FOLLOWERS_PATH}/${follower}/${authenticated}`] = true;
      updates[`/${Constants.IS_FOLLOWING_PATH}/${authenticated}/${follower}`] = true;
    }
    Helpers.sendInboxMessage(authenticated, follower, Constants.FOLLOW_MESSAGE, null, null);
    Firebase.database().ref().update(updates);

    dispatch({
      type: FOLLOWED_USER,
      meta: {
        mixpanel: {
          event: 'Followed user',
          props: {
            userId: follower
          },
        }
      }
    });

    dispatch({
      meta: {
          mixpanel: {
          event: 'Send inbox message',
          props: {
            type: Constants.FOLLOW_MESSAGE
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

export function loadGoogleMaps(googleObject, mapObject, source) {
  return dispatch => {
    dispatch({
      type: GOOGLE_MAP_LOADED,
      googleObject: googleObject,
      mapObject: mapObject,
      source: source
    })
  }
}

export function onEditorLoad(authenticated, itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).on('value', itinerarySnapshot => {
      // make this is the authed user's itinerary
      if (authenticated !== itinerarySnapshot.val().userId) {
        dispatch ({
          type: EDITOR_PAGE_NO_AUTH,
          itineraryId: itineraryId
        })
      }
      let itineraryObject = Object.assign({}, itinerarySnapshot.val());
      if (itineraryObject && itineraryObject.reviews) {
        for (let i = 0; i < itineraryObject.reviews.length; i++) {
          Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + itineraryObject.reviews[i].subjectId).on('value', subjectSnapshot => {
            Firebase.database().ref(Constants.REVIEWS_PATH + '/' + itineraryObject.reviews[i].reviewId).on('value', reviewSnapshot => {
              Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + authenticated + '/' + itineraryObject.reviews[i].subjectId).on('value', userImageSnapshot => {
                Firebase.database().ref(Constants.IMAGES_PATH + '/' + itineraryObject.reviews[i].subjectId).on('value', imageSnapshot => {
                  let imageList = (userImageSnapshot.exists() ? Helpers.getImagePath(userImageSnapshot.val()) : Helpers.getImagePath(imageSnapshot.val()) );
                  Object.assign(itineraryObject.reviews[i], subjectSnapshot.val(), reviewSnapshot.val(), 
                    { images: imageList });

                  if (i === itineraryObject.reviews.length - 1) {
                    dispatch({
                      type: EDITOR_PAGE_LOADED,
                      itineraryId: itineraryId,
                      searchLocation: itinerarySnapshot.val().geo.location,
                      geoSuggest: itinerarySnapshot.val().geo.label,
                      itineraryImages: itineraryObject.images,
                      data: { itinerary: itineraryObject }
                    })
                  }
                })
              })
            })
          })
        }
      }
      else {
        itineraryObject.reviews = [];
        dispatch({
          type: EDITOR_PAGE_LOADED,
          itineraryId: itineraryId,
          searchLocation: itinerarySnapshot.val().geo.location,
          geoSuggest: itinerarySnapshot.val().geo.label,
          itineraryImages: itineraryObject.images,
          data: { itinerary: itineraryObject }
        })
      }
    })
  }
}

export function onEditorUnload(itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinerarySnapshot => {
      let itineraryObject = itinerarySnapshot.val();
      if (itineraryObject && itineraryObject.reviews) {
        for (let i = 0; i < itineraryObject.reviews.length; i++) {
          Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + itineraryObject.reviews[i].subjectId).off();
          Firebase.database().ref(Constants.REVIEWS_PATH + '/' + itineraryObject.reviews[i].reviewId).off();
        }
      }
    })
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).off();
    dispatch({
      type: EDITOR_PAGE_UNLOADED
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

export function onUpdateCreateField(key, value, source) {
  return dispatch => {
    dispatch({
      type: UPDATE_FIELD_CREATE,
      key,
      value,
      source: source
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
    Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId).once('value', geoSnapshot => {
      Firebase.database().ref(Constants.COUNTRIES_PATH + '/' + itinerary.geo.country + '/places/' + itinerary.geo.placeId).once('value', countrySnapshot => {
        let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
        let itineraryObject = {
          lastModified: serverTimestamp,
          createdOn: serverTimestamp
        }
        let updates = {};
        Object.assign(itineraryObject, itinerary)

        let itineraryId = Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth).push(itineraryObject).key;

        updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${auth}/${itineraryId}`] = itineraryObject;
        updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}`] = Object.assign({}, itineraryObject, {userId: auth});
        updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}`] = Object.assign({}, itineraryObject, {userId: auth});

        // add geo to the geo table if it doesnt exists
        if (!geoSnapshot.exists()) {
          let geoObject = {
            country: itinerary.geo.country,
            location: itinerary.geo.location,
            label: itinerary.geo.label
          }
          updates[`/${Constants.GEOS_PATH}/${itinerary.geo.placeId}`] = geoObject;
        }

        if (!countrySnapshot.exists()) {
          updates[`/${Constants.COUNTRIES_PATH}/${itinerary.geo.country}/places/${itinerary.geo.placeId}`] = true;
        }
        Firebase.database().ref().update(updates);

        dispatch({
          type: ITINERARY_CREATED,
          payload: itineraryObject,
          itineraryId: itineraryId,
          meta: {
            mixpanel: {
              event: 'Itinerary created'
            }
          }
        })
      })
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
          let fileName = Helpers.generateImageFileName();
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

export function uploadImages(auth, objectId, objectType, images, itineraryId) {
  if (images) {
    let storagePath = (objectType === Constants.REVIEW_TYPE ? Constants.IMAGES_PATH : Constants.IMAGES_ITINERARIES_PATH);
    let byUserPath = (objectType === Constants.REVIEW_TYPE ? Constants.IMAGES_BY_USER_PATH : Constants.IMAGES_ITINERARIES_BY_USER_PATH);
    // let updates = {};
    let imageId = '';
    images.forEach(function(imageFile) {
      let imageObject = {
        lastModified: Firebase.database.ServerValue.TIMESTAMP
      };
      if (typeof imageFile === 'string' || imageFile instanceof String) {
        // if its the URL path of the image, just save it
        imageObject.url = imageFile;
        Firebase.database().ref(byUserPath + '/' + auth + '/' + objectId).push(imageObject);
        // updates[`/${storagePath}/${objectId}/${imageId}`] = Object.assign({}, imageObject, {userId: auth});
      }
      else {
        // otherwise upload the file if we need to
        const storageRef = Firebase.storage().ref();
        
        const metadata = {
          contentType: imageFile.type
        }
        // save all the new images in Firebase storage, get all the image URLs
        let fileName = Helpers.generateImageFileName();
        const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
        uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          }, function(error) {
            console.log(error.message)
        }, function() {
          const downloadURL = uploadTask.snapshot.downloadURL;
          // let uploadUpdates = {};
          if (downloadURL) {
            imageObject.url = downloadURL;
             // save images in images and images-by-user
            Firebase.database().ref(byUserPath + '/' + auth + '/' + objectId).push(imageObject);
            // uploadUpdates[`/${storagePath}/${objectId}/${imageId}`] = Object.assign({}, imageObject, {userId: auth});

            // Firebase.database().ref().update(uploadUpdates);
          }
        })
      }
    })
    // Firebase.database().ref().update(updates);
  }
}

export function dispatchUploadCoverPhoto(auth, imageFile, itinerary, itineraryId) {
  return dispatch => {
    uploadCoverPhoto(auth, imageFile, itinerary, itineraryId);
    dispatch({
      type: COVER_PHOTO_UPDATED
    })
  }
}

export function uploadCoverPhoto(auth, imageFile, itinerary, itineraryId) {
  if (imageFile) {
    let updates = {};
    let imageId = '';
    let imageObject = {
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    };
    if (typeof imageFile === 'string' || imageFile instanceof String) {
      // if its the URL path of the image, just save it
      imageObject.url = imageFile;

      updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/${itineraryId}/images/`] = imageObject;
      updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/images/`] = imageObject;
      updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${auth}/${itineraryId}/images/`] = imageObject;
      updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}/images/`] = imageObject;

      Firebase.database().ref().update(updates);
    }
    else {
      // otherwise upload the file if we need to
      const storageRef = Firebase.storage().ref();
      
      const metadata = {
        contentType: imageFile.type
      }
      // save all the new images in Firebase storage, get all the image URLs
      let fileName = Helpers.generateImageFileName();
      const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
      uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      function(snapshot) {
        }, function(error) {
          console.log(error.message)
      }, function() {
        const downloadURL = uploadTask.snapshot.downloadURL;
        let uploadUpdates = {};
        if (downloadURL) {
          imageObject.url = downloadURL;
           // save images to all destinations
           
          updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/${itineraryId}/images/`] = imageObject;
          updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/images/`] = imageObject;
          updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${auth}/${itineraryId}/images/`] = imageObject;
          updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}/images/`] = imageObject;

          Firebase.database().ref().update(updates);
        }
      })
    }
  }
}

// export function updatePlaceId () {
// // SF ChIJIQBpAG2ahYAR_6128GcTUEo
// // Tokyo ChIJ51cu8IcbXWARiRtXIothAS4
// // Paris ChIJD7fiBh9u5kcRYJSMaMOCCwQ
// // NYC ChIJOwg_06VPwokRYv534QaPC8g
// // Palo Alto ChIJORy6nXuwj4ARz3b1NVL1Hw4
// // BCN ChIJ5TCOcRaYpBIRCmZHTz37sEQ
// // San Sebastian ChIJFf5oO_6vUQ0RSUaGlFnFPuQ
  
//   Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH).once('value', snapshot => {
//     let updates = {};
//     snapshot.forEach(function(location) {

//       let geoObject = {};
//       let geoId = '';
//       if (location.key.includes('Barcelona')) {
//         geoObject = { placeId: 'ChIJ5TCOcRaYpBIRCmZHTz37sEQ', label: 'Barcelona, Spain' }
//         geoId = 'ChIJ5TCOcRaYpBIRCmZHTz37sEQ';
//       }
//       else if (location.key.includes('San Francisco')) {
//         geoObject = { placeId: 'ChIJIQBpAG2ahYAR_6128GcTUEo', label: 'San Francisco, CA, United States' }
//         geoId = 'ChIJIQBpAG2ahYAR_6128GcTUEo';
//       }
//       else if (location.key.includes('Tokyo')) {
//         geoObject = { placeId: 'ChIJ51cu8IcbXWARiRtXIothAS4', label: 'Tokyo, Japan' }
//         geoId = 'ChIJ51cu8IcbXWARiRtXIothAS4'
//       }
//       else if (location.key.includes('Paris')) {
//         geoObject = { placeId: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ', label: 'Paris, France' }
//         geoId = 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ'
//       }
//       else if (location.key.includes('New York')) {
//         geoObject = { placeId: 'ChIJOwg_06VPwokRYv534QaPC8g', label: 'New York, NY, United States' }
//         geoId = 'ChIJOwg_06VPwokRYv534QaPC8g'
//       }
//       else if (location.key.includes('Palo Alto')) {
//         geoObject = { placeId: 'ChIJORy6nXuwj4ARz3b1NVL1Hw4', label: 'Palo Alto, CA, United States' }
//         geoId = 'ChIJORy6nXuwj4ARz3b1NVL1Hw4'
//       }
//       else if (location.key.includes('San Sebastian')) {
//         geoObject = { placeId: 'ChIJFf5oO_6vUQ0RSUaGlFnFPuQ', label: 'San Sebastian, Spain' }
//         geoId = 'ChIJFf5oO_6vUQ0RSUaGlFnFPuQ'
//       }

//       let itineraryObject = location.val();
//       updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${geoId}`] = itineraryObject;
//       updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${location.key}`] = null;
//       // for (var user in location.val()) {
//       //   if (!location.val().hasOwnProperty(user)) continue;
//         // for (var itineraryId in location.val()[user]) {
//         //   if (!location.val()[user].hasOwnProperty(itineraryId)) continue;
//         //   updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${user}/${itineraryId}/geo`] = geoObject;
//         //   updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/geo`] = geoObject;
//           // Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + location.key + '/' + user + '/' + itineraryId + '/geo').set(geoObject);
//         // }
//       // }
//       Firebase.database().ref().update(updates);
//     })
//   })
// }

export function onEditorSubmit(auth, itineraryId, itinerary) {
  return dispatch => {
    let updates = {};
    let reviewsList = {};
    const lastModified = { lastModified: Firebase.database.ServerValue.TIMESTAMP };
    let reviews = itinerary.reviews;

    // create an itineraryId if it doesn't exist
    if (!itineraryId) {
      itineraryId = Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth).push(Object.assign({}, itinerary, {createdOn: Firebase.database.ServerValue.TIMESTAMP})).key;
    }
    let fallbackImageChosen = false,
      fallbackImageURL = '';
    for (var i = 0; i < reviews.length; i++) {
      if (reviews[i].title) {
        // create the reviewsList for the itinerary
        let subject = Helpers.makeSubject(reviews[i], lastModified);
        
        // if no subject id, create the subject
        if (!reviews[i].subjectId) {
          if (reviews[i].id) {
            // if this is a search result from 4sq, use their id as the subject id
            reviews[i].subjectId = reviews[i].id;
            updates[`/${Constants.SUBJECTS_PATH}/${reviews[i].subjectId}`] = subject;

            // save the default image from 4sq
            if (reviews[i].defaultImage && reviews[i].defaultImage[0]) {
              let imageObject = {
                lastModified: Firebase.database.ServerValue.TIMESTAMP
              };
              imageObject.url = reviews[i].defaultImage[0];
              Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviews[i].subjectId).push(imageObject);
            }
          }
          else {
            // new custom subject, so create it
            reviews[i].subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push(subject).key;
          }
        }

        let reviewBySubject = Helpers.makeReviewBySubject(reviews[i], reviews[i].subjectId, lastModified);
        let review = Helpers.makeReview(reviews[i], reviews[i].subjectId, lastModified);

        // if review doesnt exist, create it
        if (!reviews[i].reviewId) {
          reviews[i].reviewId = Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + auth).push(review).key;
        }
        else {
          updates[`/${Constants.REVIEWS_BY_USER_PATH}/${auth}/${reviews[i].reviewId}/`] = review;
        }
        // update REVIEWS_BY_USER, REVIEWS_BY_SUBJECT, and REVIEWS tables
        updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${reviews[i].subjectId}/${auth}/`] = reviewBySubject;
        updates[`/${Constants.REVIEWS_PATH}/${reviews[i].reviewId}/`] = Object.assign({}, review, { userId: auth })

        reviewsList[i] = Object.assign({}, { subjectId: reviews[i].subjectId }, { reviewId: reviews[i].reviewId });
        // reviewsList[reviews[i].subjectId] = Object.assign({}, { reviewId: reviews[i].reviewId }, {priority: i});

        // save the custom images from each review
        let subjectId = reviews[i].subjectId;
        if (reviews[i].images && reviews[i].images.isNew) {
          let customImage = uploadImages(auth, subjectId, Constants.REVIEW_TYPE, reviews[i].images.files, itineraryId);
          if (fallbackImageChosen === false) {
            // fallbackImageURL = customImage ||;
            fallbackImageChosen = true;
          }
        }
      }
    }

    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinSnapshot => {
      Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId).once('value', geoSnapshot => { 
        Firebase.database().ref(Constants.COUNTRIES_PATH + '/' + itinerary.geo.country + '/places/' + itinerary.geo.placeId).once('value', countrySnapshot => {
          let itineraryByUserObject = Helpers.makeItinerary(auth, itinerary, lastModified);
          Object.assign(itineraryByUserObject, { reviews: reviewsList }, { reviewsCount: reviews.length });
          if (itinSnapshot.exists() && itinSnapshot.val().createdOn) itineraryByUserObject.createdOn = itinSnapshot.val().createdOn;
          if (itinSnapshot.exists() && itinSnapshot.val().images) itineraryByUserObject.images = itinSnapshot.val().images;

          let itineraryObject = {};
          Object.assign(itineraryObject, itineraryByUserObject, { userId: auth });

          // update all itinerary tables
          updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/${itineraryId}`] = itineraryByUserObject;
          updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/`] = itineraryObject;
          updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${auth}/${itineraryId}/`] = itineraryByUserObject;
          updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}/`] = itineraryObject;

          // add geo to geo table if its not there
          if (!geoSnapshot.exists()) {
            let geoObject = {
              country: itinerary.geo.country,
              location: itinerary.geo.location,
              label: itinerary.geo.label
            }
            updates[`/${Constants.GEOS_PATH}/${itinerary.geo.placeId}`] = geoObject;
          }

          if (!countrySnapshot.exists()) {
            updates[`/${Constants.COUNTRIES_PATH}/${itinerary.geo.country}/places/${itinerary.geo.placeId}`] = true;
          }

          Firebase.database().ref().update(updates, function(error) {
            if (error) {
              console.log("Error updating data:", error);
            }
          });

          // upload itinerary images if they exist
          if (itinerary.images && itinerary.images.isNew && itinerary.images.files && itinerary.images.files[0]) {
            setTimeout(function() {
              uploadCoverPhoto(auth, itinerary.images.files[0], itinerary, itineraryId);
            }, 2000);
          }
          // else if (itinerary.images && itinerary.images.isFallback === true) {

          // }

          let message = itinerary.title + ' has been saved.';

          dispatch({
            type: ITINERARY_UPDATED,
            itineraryId: itineraryId,
            message: message,
            meta: {
              mixpanel: {
                event: 'Itinerary updated',
                props: {
                  itineraryId: itineraryId,
                }
              }
            }
          })
      })
      })
    })
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

export function createSubmitError(missingField, source) {
  let message = (missingField === 'location' ? 'Please select a valid location from the dropdown' : 'Please add a ' + missingField);
  return dispatch => {
    dispatch({
      type: CREATE_SUBMIT_ERROR,
      error: message,
      source: source
    })
  }
}

export function getSubject(subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnapshot => {
      Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', imageSnapshot => {
        let subject = Object.assign({}, subjectSnapshot.val(), 
          { images: Helpers.getImagePath(imageSnapshot.val()) } );
        
        dispatch({
          type: GET_SUBJECT,
          payload: subject
        })
      })
    })
  }
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
                  review.isLiked = Helpers.searchLikes(authenticated, likesSnapshot.val());
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
              review.isLiked = Helpers.searchLikes(authenticated, likesSnapshot.val());
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

export function getFollowingReviews(auth, subjectId) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: GET_FOLLOWING_REVIEWS,
        payload: []
      })
    }
    let reviewArray = [];
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnapshot => {
      Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).on('value', followingSnapshot => {
        followingSnapshot.forEach(function(followingChild) {
          Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).on('value', reviewSnapshot => {
            if (reviewSnapshot.exists()) {
              Firebase.database().ref(Constants.USERS_PATH + '/' + followingChild.key).once('value', userSnapshot => {
                Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + reviewSnapshot.val().reviewId).on('value', likesSnapshot => {
                  Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewSnapshot.val().reviewId).on('value', commentSnapshot => {
                    Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + followingChild.key + '/' + subjectId).on('value', imagesSnapshot => {
                      Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', defaultImagesSnapshot => {
                        let reviewObject = {};
                        let likes = {
                          isLiked: likesSnapshot.exists()
                        }

                        let comments = [];
                        commentSnapshot.forEach(function(commentChild) {
                          const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
                          comments = comments.concat(comment);
                        })
                        comments.sort(Helpers.lastModifiedAsc);

                        let images = imagesSnapshot.exists() ? Helpers.getImagePath(imagesSnapshot.val()) : Helpers.getImagePath(defaultImagesSnapshot.val());

                        Object.assign(reviewObject, subjectSnapshot.val(), {subjectId: subjectSnapshot.key}, 
                          reviewSnapshot.val(), {id: reviewSnapshot.val().reviewId},
                          { createdBy: userSnapshot.val() }, likes, {comments: comments}, {images: images} );
                        reviewArray = [reviewObject].concat(reviewArray);
                        reviewArray.sort(Helpers.lastModifiedDesc);

                        dispatch({
                          type: GET_FOLLOWING_REVIEWS,
                          payload: reviewArray
                        })
                      })
                    })
                  })
                })
              })
            }
          })
        })
      })
    })
  }
}

export function unloadFollowingReviews(auth, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).once('value', followingSnapshot => {
      followingSnapshot.forEach(function(followingChild) {
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).once('value', reviewSnapshot => {
          if (reviewSnapshot.exists()) {
            Firebase.database().ref(Constants.USERS_PATH + '/' + followingChild.key).off();
            Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + reviewSnapshot.val().reviewId).off();
            Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewSnapshot.val().reviewId).off();
          }
        })
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + followingChild.key).off();
      })
      Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).off();
    })

    dispatch({
      type: FOLLOWING_REVIEWS_UNLOADED
    })
  }
}

export function getUserReview(auth, userId, subjectId) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: GET_USER_REVIEW,
        payload: {}
      })
    }
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).on('value', subjectSnapshot => {
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).on('value', reviewSnapshot => {
        if (reviewSnapshot.exists()) {
          Firebase.database().ref(Constants.USERS_PATH + '/' + userId).once('value', userSnapshot => {
            Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + reviewSnapshot.val().reviewId).on('value', likesSnapshot => {
              Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewSnapshot.val().reviewId).on('value', commentSnapshot => {
                Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userId + '/' + subjectId).on('value', imagesSnapshot => {
                  Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).on('value', defaultImagesSnapshot => {
                    let reviewObject = {};
                    let likes = {
                      isLiked: likesSnapshot.exists()
                    }

                    let comments = [];
                    commentSnapshot.forEach(function(commentChild) {
                      const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
                      comments = comments.concat(comment);
                    })
                    comments.sort(Helpers.lastModifiedAsc);

                    let images = imagesSnapshot.exists() ? Helpers.getImagePath(imagesSnapshot.val()) : Helpers.getImagePath(defaultImagesSnapshot.val());

                    Object.assign(reviewObject, subjectSnapshot.val(), {subjectId: subjectSnapshot.key}, 
                      reviewSnapshot.val(), {id: reviewSnapshot.val().reviewId},
                      { createdBy: userSnapshot.val() }, likes, {comments: comments}, {images: images} );
                    
                    dispatch({
                      type: GET_USER_REVIEW,
                      payload: reviewObject
                    })
                  })
                })
              })
            })
          })
        }
      })
    })
  }
}

export function unloadUserReview(auth, userId, subjectId) {
  return dispatch => {
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).once('value', subjectSnapshot => {
      Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).once('value', reviewSnapshot => {
        if (reviewSnapshot.exists()) {
          Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
          Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + reviewSnapshot.val().reviewId).off();
          Firebase.database().ref(Constants.COMMENTS_PATH + '/' + reviewSnapshot.val().reviewId).off();
          Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + userId + '/' + subjectId).off();
          Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).off();
        }
      })
    })
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId).off();

    dispatch({
      type: UNLOAD_USER_REVIEW
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
            comments.sort(Helpers.lastModifiedAsc);

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
  Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).off();
  Firebase.database().ref(Constants.IMAGES_PATH + '/' + subjectId).off();
  
  return dispatch => {
    dispatch({
      type: SUBJECT_UNLOADED
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

export function onCommentSubmit(authenticated, userInfo, type, commentObject, body, itineraryId) {
  return dispatch => {
    if(!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    const comment = {
      userId: authenticated,
      username: userInfo.username,
      image: userInfo.image,
      body: body,
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    }

    let inboxMessageType = ( type === Constants.REVIEW_TYPE ? Constants.COMMENT_ON_REVIEW_MESSAGE : Constants.COMMENT_ON_ITINERARY_MESSAGE );
    let commentOnCommentType = ( type === Constants.REVIEW_TYPE ? Constants.COMMENT_ON_COMMENT_REVIEW_MESSAGE : Constants.COMMENT_ON_COMMENT_ITINERARY_MESSAGE );
    let objectId = ( type === Constants.REVIEW_TYPE ? commentObject.reviewId : commentObject.id );

    if (objectId) {
      let commentId = Firebase.database().ref(Constants.COMMENTS_PATH + '/' + objectId).push(comment).key;
      if (type === Constants.REVIEW_TYPE) {
        Helpers.incrementReviewCount(Constants.COMMENTS_COUNT, objectId, commentObject.subjectId, commentObject.createdBy.userId);
      }
      else {
      // this is a comment on an itinerary
        Helpers.incrementItineraryCount(Constants.COMMENTS_COUNT, objectId, commentObject.geo, commentObject.createdBy.userId); 

        // update lastComment on itinerary
        let updates = {};
        updates[Constants.ITINERARIES_BY_USER_PATH +'/' + commentObject.createdBy.userId + '/' + commentObject.id + '/lastComment'] = Object.assign({}, comment, {commentId: commentId});
        updates[Constants.ITINERARIES_PATH +'/' + commentObject.id + '/lastComment'] = Object.assign({}, comment, {commentId: commentId});
        updates[Constants.ITINERARIES_BY_GEO_BY_USER_PATH + '/' + commentObject.geo.placeId + '/' + commentObject.createdBy.userId + '/' + commentObject.id + '/lastComment'] = Object.assign({}, comment, {commentId: commentId});
        updates[Constants.ITINERARIES_BY_GEO_PATH + '/' + commentObject.geo.placeId + '/' + commentObject.id + '/lastComment'] = Object.assign({}, comment, {commentId: commentId});

        Firebase.database().ref().update(updates);
      }

      // send message to original review poster if they are not the commentor
      const sentArray = [];
      if (authenticated !== commentObject.userId) {
        Helpers.sendInboxMessage(authenticated, commentObject.userId, inboxMessageType, commentObject, itineraryId);
        sentArray.push(commentObject.userId);
        dispatch({
          type: MIXPANEL_EVENT,
          mixpanel: {
            event: SEND_INBOX_MESSAGE,
            props: {
              type: Constants.inboxMessageType
            }
          }
        })
      }

      Firebase.database().ref(Constants.COMMENTS_PATH + '/' + objectId).once('value', commentsSnapshot => {
        commentsSnapshot.forEach(function(comment) {
          let commenterId = comment.val().userId;
          // if not commentor or in sent array, then send a message
          if (commenterId !== authenticated && (sentArray.indexOf(commenterId) === -1)) {
            Helpers.sendInboxMessage(authenticated, commenterId, commentOnCommentType, commentObject, itineraryId);
            sentArray.push(commenterId);
            dispatch({
              type: MIXPANEL_EVENT,
              mixpanel: {
                event: SEND_INBOX_MESSAGE,
                props: {
                  type: commentOnCommentType
                }
              }
            })
          }
        })
      })

      const mixpanelProps = ( type === Constants.REVIEW_TYPE ? {subjectId: commentObject.subjectId} : {itineraryId: commentObject.id});
      dispatch({
        type: ADD_COMMENT,
        meta: {
          mixpanel: {
            event: 'Comment added',
            props: mixpanelProps
          }
        }
      })
    }
  }
}

export function onDeleteComment(commentObject, commentId) {
  return dispatch => {
    if (commentObject.subjectId) {
      // this is a review comment
      Firebase.database().ref(Constants.COMMENTS_PATH + '/' + commentObject.id + '/' + commentId).remove();
      Helpers.decrementReviewCount(Constants.COMMENTS_COUNT, commentObject.id, commentObject.subjectId, commentObject.createdBy.userId);
    }
    // else this is an itinerary comment
    else {
      // update the lastComment on each itinerary
      Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + commentObject.id).once('value', itinSnapshot => {
        if (itinSnapshot.exists() && itinSnapshot.val().lastComment && itinSnapshot.val().lastComment.commentId === commentId) {
          if (itinSnapshot.val().commentsCount >= 2) {
            Firebase.database().ref(Constants.COMMENTS_PATH + '/' + commentObject.id).orderByKey().limitToFirst(itinSnapshot.val().commentsCount - 1).once('value', limitedSnap => {
              let saveObject = {};
              if (limitedSnap.exists()) {
                limitedSnap.forEach(function(commentItem) {
                  saveObject = Object.assign({}, commentItem.val(), { commentId: commentItem.key });
                })
                let updates = {};
                updates[`/${Constants.ITINERARIES_PATH}/${commentObject.id}/lastComment`] = saveObject;
                updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${commentObject.userId}/${commentObject.id}/lastComment`] = saveObject;
                updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${commentObject.geo.placeId}/${commentObject.id}/lastComment`] = saveObject;
                updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${commentObject.geo.placeId}/${commentObject.userId}/${commentObject.id}/lastComment`] = saveObject;

                Firebase.database().ref().update(updates);
              }
            })
          }
          else {
            // only 1 comment so just remove lastComment
            let updates = {};
            updates[`/${Constants.ITINERARIES_PATH}/${commentObject.id}/lastComment`] = null;
            updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${commentObject.userId}/${commentObject.id}/lastComment`] = null;
            updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${commentObject.geo.placeId}/${commentObject.id}/lastComment`] = null;
            updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${commentObject.geo.placeId}/${commentObject.userId}/${commentObject.id}/lastComment`] = null;

            Firebase.database().ref().update(updates);
          }
        }
      })

      // delete the comment
      Firebase.database().ref(Constants.COMMENTS_PATH + '/' + commentObject.id + '/' + commentId).remove();

      Helpers.decrementItineraryCount(Constants.COMMENTS_COUNT, commentObject.id, commentObject.geo, commentObject.createdBy.userId);
    }

    dispatch({
      type: DELETE_COMMENT
    })
  }
}

export function onDeleteItinerary(userId, itineraryId, geo, redirectPath) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).remove();
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_BY_USER_PATH + '/' + geo + '/' + userId + '/' + itineraryId).remove();
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + geo + '/' + itineraryId).remove();
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId + '/' + itineraryId).remove();
    Firebase.database().ref(Constants.LIKES_PATH + '/' + itineraryId).remove();
    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + itineraryId).remove();
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH).once('value', likesSnapshot => {
      likesSnapshot.forEach(function(userChild) {
        Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userChild.key + '/' + itineraryId).remove();
      })
    })

    let message = 'Your itinerary has been deleted.'
    dispatch({
      type: ITINERARY_DELETED,
      redirect: redirectPath,
      message: message
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

export function onDeletePicture() {
  return dispatch => {

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

export function getItinerariesByUser(auth, userId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('value', itinerariesSnapshot => {
      if (!itinerariesSnapshot.exists()) {
        dispatch({
          type: GET_ITINERARIES_BY_USER,
          payload: []
        })
      }
      else {
        let feedArray = [];
        Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', userSnapshot => {
          itinerariesSnapshot.forEach(function(itin) {
            Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).on('value', likesSnapshot => {
              const itineraryObject = {};
              const key = { id: itin.key };
              const createdBy = { createdBy: userSnapshot.val() };
              createdBy.createdBy.userId = userId
              let likes = {
                isLiked: likesSnapshot.exists()
              }
              
              Object.assign(itineraryObject, itin.val(), key, createdBy, likes);

              // if (itin.val().subject && itin.val().subject.images) {
              //   reviewObject.subject.image = Helpers.getImagePath(itin.val().subject.images);
              // }

              feedArray = [itineraryObject].concat(feedArray);
              feedArray.sort(Helpers.lastModifiedDesc);
              // console.log('feed array = ' + JSON.stringify(feedArray))
              dispatch({
                type: GET_ITINERARIES_BY_USER,
                payload: feedArray
              })
            })
          })
        })
      }
    })
  }
}

export function unloadItinerariesByUser(auth, userId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('value', itinerariesSnapshot => {
      if (itinerariesSnapshot.exists()) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
        itinerariesSnapshot.forEach(function(itin) {
          Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).off();
        })
      }
    })
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).off();

    dispatch({
      type: ITINERARIES_BY_USER_UNLOADED
    });
  }
}

export function getLikesByUser(auth, userId) {
  return dispatch => {
    let likesArray = [];
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).orderByChild('lastModified').on('value', likesByUserSnapshot => {
      if (!likesByUserSnapshot.exists()) {
        dispatch({
          type: GET_LIKES_BY_USER,
          payload: []
        })
      }
      else {
        likesByUserSnapshot.forEach(function(likeItem) {
          let objectPath = (likeItem.val().type === Constants.ITINERARY_TYPE ? Constants.ITINERARIES_PATH : Constants.REVIEWS_PATH);
          let imagePath = (likeItem.val().type === Constants.ITINERARY_TYPE ? 
            (Constants.IMAGES_ITINERARIES_PATH + '/' + likeItem.key) : 
            (Constants.IMAGES_PATH + '/' + likeItem.val().subjectId) );
          Firebase.database().ref(objectPath + '/' + likeItem.key).on('value', objectSnapshot => {
            if (objectSnapshot.exists()) {
              Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + likeItem.val().subjectId).on('value', subjectSnapshot => {
                Firebase.database().ref(Constants.USERS_PATH + '/' + objectSnapshot.val().userId).on('value', userSnapshot => {
                  Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + likeItem.key).on('value', isLikedSnapshot => {
                    Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).on('value', commentSnapshot => {
                      Firebase.database().ref(imagePath).on('value', imagesSnapshot => {
                        const containerObject = {};
                        const key = { id: likeItem.key };
                        const createdBy = { createdBy: userSnapshot.val(), userId: userSnapshot.key };
                        let likes = { 
                          isLiked: isLikedSnapshot.exists()
                        }

                        let itineraryObject = {};
                        let reviewObject = {};

                        let comments = [];
                        commentSnapshot.forEach(function(commentChild) {
                          const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
                          comments = comments.concat(comment);
                        })
                        comments.sort(Helpers.lastModifiedAsc);

                        if (likeItem.val().type === Constants.REVIEW_TYPE) {
                          let images = Helpers.getImagePath(imagesSnapshot.val());
                          Object.assign(reviewObject, key, objectSnapshot.val(), subjectSnapshot.val(), createdBy, likes, {comments: comments}, {images: images})
                        }
                        else {
                          Object.assign(itineraryObject, objectSnapshot.val(), key, createdBy, likes, {comments: comments});
                        }

                        Object.assign(containerObject, {review: reviewObject}, {itinerary: itineraryObject});
                        likesArray = [containerObject].concat(likesArray);
                        likesArray.sort(Helpers.lastModifiedDesc);

                        dispatch({
                          type: GET_LIKES_BY_USER,
                          payload: likesArray
                        })
                      })
                    })
                  })
                })
              })
            }
          })
        })
      }
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

export function unloadLikesByUser(auth, userId) {
    return dispatch => {
    let likesArray = [];
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).orderByChild('lastModified').once('value', likesByUserSnapshot => {
      likesByUserSnapshot.forEach(function(likeItem) {
        let objectPath = (likeItem.val().type === Constants.ITINERARY_TYPE ? Constants.ITINERARIES_PATH : Constants.REVIEWS_PATH);
        let imagePath = (likeItem.val().type === Constants.ITINERARY_TYPE ? 
          (Constants.IMAGES_ITINERARIES_PATH + '/' + likeItem.key) : 
          (Constants.IMAGES_PATH + '/' + likeItem.val().subjectId) );
        Firebase.database().ref(objectPath + '/' + likeItem.key).once('value', objectSnapshot => {
          if (objectSnapshot.exists()) {
            Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + likeItem.val().subjectId).off();
            Firebase.database().ref(Constants.USERS_PATH + '/' + objectSnapshot.val().userId).off();
            Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + likeItem.key).off();
            Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).off();
            Firebase.database().ref(imagePath).off();
          }
        })
        Firebase.database().ref(objectPath + '/' + likeItem.key).off();
      })
    })
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).off();

    dispatch({
      type: UNLOAD_LIKES_OR_SAVES_BY_USER
    })
  }
}

// ORIGINAL VERSION on value
// export function getUserFeed(auth) {
//   return dispatch => {
//     if (!auth) {
//       dispatch({
//         type: HOME_PAGE_NO_AUTH
//       })
//     }
//     Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth).on('value', followedSnapshot => {
//       if (!followedSnapshot.exists()) {
//         dispatch({
//           type: GET_USER_FEED,
//           payload: []
//         })
//       }
//       else {
//         let userList = [auth];
//         followedSnapshot.forEach(function(followedUser) {
//           userList.push(followedUser.key);
//         })
//         let feedArray = [];
//         userList.forEach(function(userId) {
//           Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('value', itinerariesSnapshot => {
//             Firebase.database().ref(Constants.USERS_PATH + '/' + userId).once('value', userSnapshot => {
//               itinerariesSnapshot.forEach(function(itin) {
//                 Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).on('value', likesSnapshot => {
//                   const itineraryObject = createItineraryObject(itin.key, itin.val(), userId, userSnapshot.val(), likesSnapshot.exists())

//                   feedArray = [itineraryObject].concat(feedArray);
//                   feedArray.sort(Helpers.lastModifiedDesc);
                  
//                   dispatch({
//                     type: GET_USER_FEED,
//                     payload: feedArray
//                   })
//                 })
//               })
//             })
//           })
//         })
//       }
//     })
//   }
// } 

export function startFeedWatch(auth) {
  return dispatch => {
    watchLikesByUser(dispatch, auth, Constants.USER_FEED);
    watchFollowingFeed(dispatch, auth);
    watchItinerariesByUser(dispatch, auth)
  }
}

export function unloadFeedWatch(auth) {
  return dispatch => {
  unwatchLikesByUser(dispatch, auth, Constants.USER_FEED);
  unwatchItinerariesByUser(dispatch, auth);
  unwatchFollowingFeed(dispatch, auth);
  }
}

export function watchFollowingFeed(dispatch, userId) {
  // when new follower added, watch the user's info and their itineraries
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).on('child_added', snap => {
    watchUser(dispatch, snap.key, Constants.USER_FEED);
    watchItinerariesByUser(dispatch, snap.key);
  })

  // on child_removed - unwatch all the listeners
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).on('child_removed', snap => {
    unwatchUser(dispatch, snap.key, Constants.USER_FEED);
    unwatchItinerariesByUser(dispatch, snap.key);
  })
}

export function unwatchFollowingFeed(dispatch, userId) {
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).once('value', snap => {
    snap.forEach(function(user) {
      Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + user.key).off();
      Firebase.database().ref(Constants.USERS_PATH + '/' + user.key).off();
    })
  })
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + userId).off();

  dispatch({
    type: USER_FEED_UNLOADED
  })
}

export function watchItinerariesByUser(dispatch, userId) {
  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('child_added', addedSnap => {
    dispatch(itineraryAddedAddedAction(addedSnap.key,userId,  addedSnap.val()));
  })
  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('child_changed', changedSnap => {
    dispatch(itineraryChangedAction(changedSnap.key, changedSnap.val()));
  })
  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).on('child_removed', removedSnap => {
    dispatch(itineraryRemovedAction(removedSnap.key));
  })
}

export function unwatchItinerariesByUser(dispatch, userId) {
  Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId).off();
  dispatch(itineraryByUserRemovedAction(userId));
}

function itineraryByUserRemovedAction(userId) {
  return {
    type: ITINERARIES_BY_USER_REMOVED_ACTION,
    userId
  }
}

function itineraryAddedAddedAction(itineraryId, userId, itinerary) {
  return {
    type: ITINERARY_ADDED_ACTION,
    itineraryId,
    userId,
    itinerary
  }
}

function itineraryChangedAction(itineraryId, itinerary) {
  return {
    type: ITINERARY_CHANGED_ACTION,
    itineraryId,
    itinerary
  }
}

function itineraryRemovedAction(itineraryId) {
  return {
    type: ITINERARY_REMOVED_ACTION,
    itineraryId
  }
}

export function watchUser(dispatch, userId, source) {
  Firebase.database().ref(Constants.USERS_PATH + '/' + userId).on('value', snap => {
    dispatch(userAddedAction(userId, snap.val(), source));
  })
}

export function unwatchUser(dispatch, userId, source) {
  dispatch(userRemovedAction(userId, source));
  Firebase.database().ref(Constants.USERS_PATH + '/' + userId).off();
}

function userAddedAction(userId, user, source) {
  return {
    type: USER_ADDED_ACTION,
    userInfo: user,
    userId: userId,
    source: source
  }
}

function userRemovedAction(userId, source) {
  return {
    type: USER_REMOVED_ACTION,
    userId,
    source
  }
}

export function watchLikesByUser(dispatch, userId, source) {
  Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).on('child_added', snap => {
    dispatch(likesByUserAddedAction(snap.key, source));
  })
  Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).on('child_removed', snap => {
    dispatch(likesByUserRemovedAction(snap.key, source));
  })
}

export function unwatchLikesByUser(dispatch, userId) {
  Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).off();
}

function likesByUserAddedAction(objectId, source) {
  return {
    type: LIKES_BY_USER_ADDED_ACTION,
    objectId,
    source
  }
}

function likesByUserRemovedAction(objectId, source) {
  return {
    type: LIKES_BY_USER_REMOVED_ACTION,
    objectId,
    source
  }
}

export function likeReview(authenticated, type, likeObject, itineraryId) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }

    let id = (type === Constants.REVIEW_TYPE ? likeObject.reviewId : likeObject.id);
    if (id) {
      const updates = {};
      let saveObject = {
        type: type,
        lastModified: Firebase.database.ServerValue.TIMESTAMP
      }
      if (type === Constants.REVIEW_TYPE) saveObject.subjectId = likeObject.subjectId;

      updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${id}`] = saveObject;
      updates[`/${Constants.LIKES_PATH}/${id}/${authenticated}`] = saveObject;
      Firebase.database().ref().update(updates).then(response => {
        if (type === Constants.ITINERARY_TYPE) {
          Helpers.incrementItineraryCount(Constants.LIKES_COUNT, id, likeObject.geo, likeObject.createdBy.userId);
          Helpers.sendInboxMessage(authenticated, likeObject.createdBy.userId, Constants.LIKE_ITINERARY_MESSAGE, likeObject, itineraryId);

          dispatch({
            type: REVIEW_LIKED,
            meta: {
              mixpanel: {
                event: 'Liked itinerary',
                props: {
                  itineraryId: likeObject.itineraryId
                }
              }
            }
          })
          dispatch({
            meta: {
              mixpanel: {
                event: 'Send inbox message',
                props: {
                  type: Constants.LIKE_ITINERARY_MESSAGE
                }
              }
            }
          })
        }
        else if (type === Constants.REVIEW_TYPE) {
          Helpers.incrementReviewCount(Constants.LIKES_COUNT, id, likeObject.subjectId, likeObject.createdBy.userId);
          Helpers.sendInboxMessage(authenticated, likeObject.createdBy.userId, Constants.LIKE_MESSAGE, likeObject, itineraryId);

          dispatch({
            type: REVIEW_LIKED,
            meta: {
              mixpanel: {
                event: 'Liked review',
                props: {
                  subjectId: likeObject.subjectId
                }
              }
            }
          })
          dispatch({
            meta: {
              mixpanel: {
                event: SEND_INBOX_MESSAGE,
                props: {
                  type: Constants.LIKE_MESSAGE
                }
              }
            }
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
    }
  }
}

export function unLikeReview(authenticated, type, unlikeObject) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    let id = (type === Constants.REVIEW_TYPE ? unlikeObject.reviewId : unlikeObject.id);
    const updates = {};
    updates[`/${Constants.LIKES_PATH}/${id}/${authenticated}`] = null;
    updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${id}`] = null;
    Firebase.database().ref().update(updates).then(response => {
      if (type === Constants.REVIEW_TYPE) {
        Helpers.decrementReviewCount(Constants.LIKES_COUNT, id, unlikeObject.subjectId, unlikeObject.createdBy.userId);
      }
      else if (type === Constants.ITINERARY_TYPE) {
        Helpers.decrementItineraryCount(Constants.LIKES_COUNT, id, unlikeObject.geo, unlikeObject.createdBy.userId);
      }
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
        dispatch({
          meta: {
            mixpanel: {
              event: SEND_INBOX_MESSAGE,
              props: {
                type: Constants.SAVE_MESSAGE
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
        Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + followedUser.key).once('value', userItinerariesSnapshot => {
          userItinerariesSnapshot.forEach(function(itin) {
            Firebase.database().ref(Constants.LIKES_PATH + '/' + itin.key).off();
          })
        })
        Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + followedUser.key).off();
      })
    })
    Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + uid).off();

    dispatch({
      type: USER_FEED_UNLOADED
    });
  }
}

export function getGlobalFeed(auth) {
  return dispatch => {
    let feedArray = [];
    Firebase.database().ref(Constants.ITINERARIES_PATH).on('value', itinerariesSnapshot => {
      itinerariesSnapshot.forEach(function(itin) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + itin.val().userId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).on('value', likesSnapshot => {
            const itineraryObject = {};
            const key = { id: itin.key };
            const createdBy = { createdBy: Object.assign({}, userSnapshot.val(), {userId: itin.val().userId}) };
            let likes = {
              isLiked: likesSnapshot.exists()
            }
            
            Object.assign(itineraryObject, itin.val(), key, createdBy, likes);

            feedArray = [itineraryObject].concat(feedArray);
            feedArray.sort(Helpers.lastModifiedDesc);
            dispatch({
              type: GET_GLOBAL_FEED,
              payload: feedArray
            })
          })
        })
      })
    })
  }
}

//   return dispatch => {   
//     Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').on('value', reviewsSnapshot => {
//       if (!reviewsSnapshot.exists()) {
//         dispatch({
//           type: GET_GLOBAL_FEED,
//           payload: []
//         })
//       }
//       let feedArray = [];
//       reviewsSnapshot.forEach(function(review) {
//         let reviewerId = review.val().userId;
//         Firebase.database().ref(Constants.USERS_PATH + '/' + reviewerId).on('value', userSnapshot => {
//           Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).on('value', likesSnapshot => {
//             Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).on('value', savesSnapshot => {
//               Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).on('value', commentCountSnapshot => {
//                 Firebase.database().ref(Constants.SUBJECTS_PATH +'/' + review.val().subjectId).on('value', subjectSnapshot => {
//                   let reviewObject = {};
//                   let key = { id: review.key };
//                   let reviewer = { reviewer: userSnapshot.val() };
//                   reviewer.createdBy.userId = reviewerId;
//                   let isLiked = false;
//                   if (likesSnapshot.exists()) {
//                     isLiked = Helpers.searchLikes(uid, likesSnapshot.val());
//                   }
//                   let likes = { 
//                     isLiked: isLiked
//                   }
//                   let saved = {
//                     isSaved: savesSnapshot.exists()
//                   }
//                   let commentObject = {};
//                   if (commentCountSnapshot.exists()) {
//                     commentObject.comments = {
//                           lastComment: '',
//                           commentorImage: '',
//                           username: ''                  
//                     }
//                   }

//                   Object.assign(reviewObject, key, reviewer, review.val(), likes, saved, commentObject);
//                   reviewObject.subject = subjectSnapshot.val();
//                   reviewObject.subject.image = reviewObject.subject.images ? Helpers.getImagePath(reviewObject.subject.images) : '';

//                    // get subject's tags
//                     if (reviewObject.subject.tags) {
//                       reviewObject.subject.tag = Helpers.getTagsArray(reviewObject.subject.tags);
//                     }

//                   feedArray = [reviewObject].concat(feedArray);
//                   feedArray.sort(Helpers.lastModifiedDesc);

//                   dispatch({
//                     type: GET_GLOBAL_FEED,
//                     payload: feedArray
//                   })
//                 })
//               })
//             })
//           })
//         })
//       });
//     })
//   }
// }

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

export function getFollowers(userId, followPath) {
  return dispatch => {
    let followerArray = [];
    const current = Firebase.auth().currentUser.uid;
    Firebase.database().ref(followPath + '/' + userId).once('value', followersSnapshot => {
      if (followersSnapshot.exists()) {
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
              followerArray.sort(Helpers.byUsername);

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
      }
      else dispatch({
        type: GET_FOLLOWERS,
        payload: []
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
            friendArray.sort(Helpers.byUsername);

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
      if (path === FORWARD_MODAL) {
        Helpers.sendInboxMessage(authenticated, selectedFriends[i], Constants.FORWARD_MESSAGE, review);
        dispatch({
          type: MIXPANEL_EVENT,
          mixpanel: {
            event: SEND_INBOX_MESSAGE,
            props: {
              type: Constants.FORWARD_MESSAGE
            }
          }
        })
      }
      else {
        Helpers.sendInboxMessage(authenticated, selectedFriends[i], Constants.DIRECT_MESSAGE, review);
        dispatch({
          type: MIXPANEL_EVENT,
          mixpanel: {
            event: SEND_INBOX_MESSAGE,
            props: {
              type: Constants.DIRECT_MESSAGE
            }
          }
        })
      }
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
          inboxArray.sort(Helpers.lastModifiedDesc);

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

export function getSaveToItinerariesList(auth) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth).once('value', snapshot => {
      let itineraryList = [];
      snapshot.forEach(function(itinerary) {
        let item = {
          title: itinerary.val().title,
          itineraryId: itinerary.key
        }
        itineraryList.push(item);
      })
      dispatch({
        type: SAVE_TO_ITINERARIES_LIST_LOADED,
        payload: itineraryList
      })
    })
  }
}

/*
export function modifyItineraryReviews() {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH).once('value', itinerarySnapshot => {
      let updates = {};
      itinerarySnapshot.forEach(function(itinerary) {
        // if (itinerary.key === '-KkvH7gR46xsj7D-7cy-') {
          if (itinerary.val().reviews && itinerary.val().reviews[0]) {
            let reviewList = [];
            let reviewsObject = {};
            let ity = itinerary.val();
            // itinerary.val().reviews.forEach(function(reviewItem) {
            //   console.log(JSON.stringify(reviewItem))
            // })
            for (let i = 0; i < ity.reviews.length; i++) {
              // console.log(i + ': ' + JSON.stringify(ity.reviews[i]))
              reviewsObject[ity.reviews[i].subjectId] = { priority: i };
              if (ity.reviews[i].reviewId) reviewsObject[ity.reviews[i].subjectId].reviewId = ity.reviews[i].reviewId;
            }
            // console.log('reviewsObject = ' + JSON.stringify(reviewsObject))
            // console.log(`/${Constants.ITINERARIES_PATH}/${itinerary.key}/reviews/`);
            updates[`/${Constants.ITINERARIES_PATH}/${itinerary.key}/reviews/`] = reviewsObject;
            updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.val().userId}/${itinerary.key}/reviews/`] = reviewsObject;
            updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.val().geo}/${itinerary.val().userId}/${itinerary.key}/reviews/`] = reviewsObject;
            // console.log(`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.val().userId}/${itinerary.key}/reviews/`)
            // console.log(`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.val().geo}/${itinerary.val().userId}/${itinerary.key}/reviews/`)
          }
        // }
      })
      // Firebase.database().ref().update(updates);
    })
  }
}

export function modifyItineraryReviews2() {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_PATH).once('value', itinerarySnapshot => {
      let updates = {};
      itinerarySnapshot.forEach(function(itinerary) {
        // if (itinerary.key === '-KkvH7gR46xsj7D-7cy-') {
          if (itinerary.val().reviews) {
            let reviewList = [];
            let reviewsObject = {};
            let ity = itinerary.val();
            // itinerary.val().reviews.forEach(function(reviewItem) {
            //   console.log(JSON.stringify(reviewItem))
            // })
            let i = 0;
            for (let subjectId in ity.reviews) {
              // console.log(i + ': ' + JSON.stringify(ity.reviews[subjectId]))
              reviewsObject[i] = { subjectId: subjectId };
              if (ity.reviews[subjectId].reviewId) reviewsObject[i].reviewId = ity.reviews[subjectId].reviewId;
              i++;
            }
            // console.log('reviewsObject = ' + JSON.stringify(reviewsObject))
            updates[`/${Constants.ITINERARIES_PATH}/${itinerary.key}/reviews/`] = reviewsObject;
            updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.val().userId}/${itinerary.key}/reviews/`] = reviewsObject;
            updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.val().geo}/${itinerary.val().userId}/${itinerary.key}/reviews/`] = reviewsObject;
            // console.log(`/${Constants.ITINERARIES_PATH}/${itinerary.key}/reviews/`);
            // console.log(`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.val().userId}/${itinerary.key}/reviews/`)
            // console.log(`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.val().geo}/${itinerary.val().userId}/${itinerary.key}/reviews/`)
          }
        // }
      })
      Firebase.database().ref().update(updates);
    })
  }
}
*/

export function findSubject(subjectId, reviewsList) {
  for (let i = 0; i < reviewsList.length; i++) {
    if (subjectId === reviewsList[i].subjectId) {
      return true;
    }
  }
  return false;
}

export function showNewItineraryModal(auth, review) {
  return dispatch => {
    dispatch({
      type: SHOW_NEW_ITINERARY_MODAL,
      auth: auth,
      review: review
    })
  }
}

export function addToItinerary(auth, tip, itinerary) {
  return dispatch => {
    let itineraryId;
    if (!itinerary.itineraryId) {
      itineraryId = Firebase.database().ref(Constants.ITINERARIES_PATH).push(Object.assign({}, itinerary, {createdOn: Firebase.database.ServerValue.TIMESTAMP})).key;
    }
    else {
      itineraryId = itinerary.itineraryId;
    }
    Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth + '/' + itineraryId).once('value', itinSnapshot => {
      let subjectId = tip.subjectId;
      if (itinSnapshot.exists() && itinSnapshot.val().reviews && findSubject(subjectId, itinSnapshot.val().reviews)) {
      // if (itinSnapshot.val().reviews && itinSnapshot.val().reviews[subjectId]) {
        let message = itinerary.title + ' already contains ' + tip.title;
        dispatch({
          type: SUBJECT_DUPLICATE,
          message: message
        })
      }
      else {
        if (itinSnapshot.exists()) itinerary = Object.assign({}, itinSnapshot.val());

        // see if the user has already reviewed the subject. If so, add their review
        Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + auth).once('value', reviewSnapshot => {
          let geo = itinerary.geo;
          let updates = {};
          let tipData = {
            subjectId: subjectId
          }
          if (reviewSnapshot.exists()) {
            tipData.reviewId = reviewSnapshot.val().reviewId;
          }
          else {
            // create the empty review
            let lastModified = Firebase.database.ServerValue.TIMESTAMP;
            let reviewObject = Object.assign({}, {lastModified: lastModified});
            let reviewId = Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + auth).push().key;
            updates[`/${Constants.REVIEWS_BY_USER_PATH}/${auth}/${reviewId}/`] = Object.assign({}, reviewObject, {subjectId: subjectId});
            updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${auth}/`] = Object.assign({}, reviewObject, {reviewId: reviewId});
            updates[`/${Constants.REVIEWS_PATH}/${reviewId}/`] = Object.assign({}, reviewObject, { userId: auth }, {subjectId: subjectId});
            tipData.reviewId = reviewId;
          }

          let itineraryByUserObject = Object.assign({}, itinerary);
          itineraryByUserObject.reviewsCount = itineraryByUserObject.reviewsCount ? itineraryByUserObject.reviewsCount + 1 : 1;

          if (!itineraryByUserObject.reviews) itineraryByUserObject.reviews = [];
          itineraryByUserObject.reviews[itineraryByUserObject.reviews.length] = tipData;
          itineraryByUserObject.lastModified = Firebase.database.ServerValue.TIMESTAMP;
          let itineraryObject = Object.assign({}, itineraryByUserObject, {userId: itinerary.userId});

          updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/`] = itineraryObject;
          updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${geo.placeId}/${auth}/${itineraryId}/`] = itineraryByUserObject;
          updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${geo.placeId}/${itineraryId}/`] = itineraryObject;
          updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/${itineraryId}/`] = itineraryByUserObject;

          Firebase.database().ref().update(updates);

          let message = tip.title + ' successfully added to ' + itinerary.title;
          dispatch({
            type: ADDED_TO_ITINERARY,
            message: message,
            meta: {
              mixpanel: {
                event: 'Saved to itinerary'
              }
            }
          })
        })
      }
    })
  }
}

export function getAllUsers(auth) {
  return dispatch => {
    let userArray = [];
    Firebase.database().ref(Constants.USERS_PATH).on('value', snapshot => {
      snapshot.forEach(function(user) {
        if (user.key !== auth) {
          Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth + '/' + user.key).on('value', isFollowingSnapshot => {
            let userObject = Object.assign({}, user.val(), {userId: user.key});
            if (isFollowingSnapshot.exists()) {
              userObject.isFollowing = true;
            }
            userArray = [userObject].concat(userArray);
            userArray.sort(Helpers.byUsername);

            dispatch({
              type: LOADED_ALL_USERS,
              payload: userArray
            })
          })
        }
      })
    })
  }
}

export function unloadAllUsers(auth) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_PATH).once('value', snapshot => {
      snapshot.forEach(function(user) {
        Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth + '/' + user.key).off();
      })
    })
    Firebase.database().ref(Constants.USERS_PATH).off();
    dispatch({
      type: UNLOADED_ALL_USERS
    })
  }
}

export function showDeleteModal(itinerary, source) {
  return dispatch => {
    dispatch({
      type: SHOW_DELETE_ITINERARY_MODAL,
      modalType: DELETE_ITINERARY_MODAL,
      itinerary: itinerary,
      source: source
    })
  }
}

export function showModal(type, review, images) {
  return dispatch => {
    const uid = Firebase.auth().currentUser.uid;
    if (!uid) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    else {
      switch (type) {
        case SAVE_MODAL:
          Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + uid).once('value', snapshot => {
            let itineraryList = [];
            snapshot.forEach(function(itinerary) {
              let item = {
                title: itinerary.val().title,
                userId: uid,
                itineraryId: itinerary.key
              }
              itineraryList.push(item);
            })
            dispatch({
              type: SHOW_MODAL,
              modalType: SAVE_MODAL,
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
          type: SHOW_MODAL,
          modalType: type,
          review: review
        })
      }
    }
  }
}

export function openLightbox(images) {
  return dispatch => {
    dispatch({
      type: OPEN_LIGHTBOX,
      images: images
    })
  }
}

export function closeLightbox(images) {
  return dispatch => {
    dispatch({
      type: CLOSE_LIGHTBOX
    })
  }
}

export function prevLightbox(index) {
  return dispatch => {
    dispatch({
      type: PREV_LIGHTBOX,
      index: index
    })
  }
}

export function nextLightbox(index) {
  return dispatch => {
    dispatch({
      type: NEXT_LIGHTBOX,
      index: index
    })
  }
}

export function hideModal(type) {
  return dispatch => {
    dispatch({
      type: HIDE_MODAL
    })
  }
}

export function openSnackbar(message) {
  return dispatch => {
    dispatch({
      type: SHOW_SNACKBAR,
      payload: message
    })
  }
}

export function closeSnackbar() {
  return dispatch => {
    dispatch({
      type: CLOSE_SNACKBAR
    })
  }
}

export function loadPlaces(geoId) {
  return dispatch => {
    Firebase.database().ref(Constants.GEOS_PATH + '/' + geoId).once('value', geoSnapshot => {
      dispatch({
        type: LOAD_PLACES,
        geo: geoSnapshot.val()
      })
    })
  }
}

export function getPlacesFeed(auth, locationId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + locationId).on('value', itinerariesSnapshot => {
      let feedArray = [];
      itinerariesSnapshot.forEach(function(itin) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + itin.val().userId).on('value', userSnapshot => {
          Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).on('value', likesSnapshot => {
            const itineraryObject = {};
            const key = { id: itin.key };
            const createdBy = { createdBy: Object.assign({}, userSnapshot.val(), {userId: itin.val().userId}) };
            let likes = {
              isLiked: likesSnapshot.exists()
            }
            
            Object.assign(itineraryObject, itin.val(), key, createdBy, likes);

            feedArray = [itineraryObject].concat(feedArray);
            feedArray.sort(Helpers.lastModifiedDesc);
            dispatch({
              type: GET_PLACES_FEED,
              payload: feedArray
            })
          })
        })
      })
    })
  }
}

export function unloadPlacesFeed(auth, locationId) {
  return dispatch => {
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + locationId).once('value', itinerariesSnapshot => {
      itinerariesSnapshot.forEach(function(itin) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + itin.val().userId).off();
        Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).off();
      })
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + locationId).off();
    })

    dispatch({
      type: UNLOAD_PLACES_FEED
    })
  }
}