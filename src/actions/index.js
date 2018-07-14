import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit } from 'lodash'

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
export const USER_VALUE_ACTION = 'USER_VALUE_ACTION'
export const USER_REMOVED_ACTION = 'USER_REMOVED_ACTION'
export const LIKES_BY_USER_ADDED_ACTION = 'LIKES_BY_USER_ADDED_ACTION'
export const LIKES_BY_USER_REMOVED_ACTION = 'LIKES_BY_USER_REMOVED_ACTION'
export const ITINERARY_ADDED_ACTION = 'ITINERARY_ADDED_ACTION'
export const ITINERARY_REMOVED_ACTION = 'ITINERARY_REMOVED_ACTION'
export const ITINERARY_CHANGED_ACTION = 'ITINERARY_CHANGED_ACTION'
export const ITINERARIES_BY_USER_REMOVED_ACTION = 'ITINERARIES_BY_USER_REMOVED_ACTION'

export * from './authActions';
export * from './itineraryActions';
export * from './homepageActions';
export * from './inboxActions';
export * from './reviewActions';
export * from './modalActions';
export * from './loggingActions';
export * from './profileActions';
export * from './projectActions';

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
        type: ActionTypes.GET_USER,
        payload: profile
      });
    });
  };
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
    Helpers.sendInboxMessage(authenticated, follower, Constants.FOLLOW_MESSAGE, null, null, null);
    Firebase.database().ref().update(updates);
    // Helpers.fanOutFollowUser(authenticated, follower);

    mixpanel.people.increment("total follows");

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
      type: SEND_INBOX_MESSAGE,
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
    // Helpers.fanOutUnFollowUser(authenticated, following);

    mixpanel.people.increment("total follows", -1);

    dispatch({
      type: ActionTypes.UNFOLLOWED_USER,
      meta: {
        mixpanel: {
          event: 'Followed user',
          props: {
            userId: following
          },
        }
      }
    });
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
      Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).on('value', reviewsListSnapshot => {
        // make this is the authed user's itinerary
        if (authenticated !== itinerarySnapshot.val().userId && Constants.SHARED_ITINERARIES.indexOf(itineraryId) === -1) {
          dispatch ({
            type: EDITOR_PAGE_NO_AUTH,
            itineraryId: itineraryId
          })
        }
        let itineraryObject = Object.assign({}, itinerarySnapshot.val(), {reviews: []});
        if (itineraryObject && reviewsListSnapshot.exists()) {
          let reviewsList = Object.assign({}, reviewsListSnapshot.val());
          let reviewsLength = reviewsListSnapshot.numChildren();
          for (let i = 0; i < reviewsLength; i++) {
            Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewsList[i].subjectId).on('value', subjectSnapshot => {
              Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewsList[i].reviewId).on('value', reviewSnapshot => {
                Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + authenticated + '/' + reviewsList[i].subjectId).on('value', userImageSnapshot => {
                  Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviewsList[i].subjectId).on('value', imageSnapshot => {
                    let imageList = (userImageSnapshot.exists() ? Helpers.getImagePath(userImageSnapshot.val()) : Helpers.getImagePath(imageSnapshot.val()) );
                    Object.assign(reviewsList[i], subjectSnapshot.val(), reviewSnapshot.val(), 
                      { images: imageList });
                    itineraryObject.reviews = itineraryObject.reviews.concat(reviewsList[i])
                    itineraryObject.reviews = itineraryObject.reviews.slice();
                    
                    if (i === reviewsLength - 1) {
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
    })
  }
}

export function onEditorUnload(itineraryId) {
  return dispatch => {
    Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).once('value', reviewsListSnapshot => {
      if (reviewsListSnapshot.exists()) {
        let reviewsLength = reviewsListSnapshot.numChildren();
        for (let i = 0; i < reviewsLength; i++) {
          Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + reviewsListSnapshot.val()[i].subjectId).off();
          Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewsListSnapshot.val()[i].reviewId).off();
        }
      }
    })
    Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).off();
    Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).off();
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
        updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}`] = Object.assign({}, itineraryObject, {userId: auth}, {popularityScore: 0});
        updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}`] = Object.assign({}, itineraryObject, {userId: auth}, {popularityScore: 0});

        // add geo to the geo table if it doesnt exists
        if (!geoSnapshot.exists() || !geoSnapshot.val().fullCountry) {
          let geoObject = {
            location: itinerary.geo.location,
            label: itinerary.geo.label,
            itineraryCount: 1
          }
          if (itinerary.geo.country) geoObject.country = itinerary.geo.country;
          if (itinerary.geo.fullCountry) geoObject.fullCountry = itinerary.geo.fullCountry;
          if (itinerary.geo.shortName) geoObject.shortName = itinerary.geo.shortName;
          updates[`/${Constants.GEOS_PATH}/${itinerary.geo.placeId}`] = geoObject;
        }
        // otherwise just increment itineraryCount for geo
        else {
          // increment itinerary count on geo
          Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId + '/itineraryCount').transaction(function (current_count) {
            return (current_count || 0) + 1;
          });
        }

        if (!countrySnapshot.exists()) {
          updates[`/${Constants.COUNTRIES_PATH}/${itinerary.geo.country}/places/${itinerary.geo.placeId}`] = true;
        }

        Firebase.database().ref().update(updates);
        Helpers.fanOutToFollowersFeed(auth, itineraryId, serverTimestamp)

        // update Algolia index
        Helpers.updateAlgloiaGeosIndex(itinerary.geo)

        mixpanel.people.increment("total itineraries");
        mixpanel.people.set({ "last itinerary created": (new Date()).toISOString() });
        mixpanel.identify(auth);

        dispatch({
          type: ITINERARY_CREATED,
          payload: itineraryObject,
          itineraryId: itineraryId,
          meta: {
            mixpanel: {
              event: 'Itinerary created',
              source: 'create page',
              itineraryId: itineraryId,
              geo: itinerary.geo.placeId
            }
          }
        })
      })
    })
  }
}

export function setInProgress() {
  return dispatch => {
    dispatch({
      type: SET_IN_PROGRESS
    })
  }
}

export function uploadCustomSubjectImages(auth, objectId, images, itineraryId) {
  return dispatch => {
    if (images) {
      let imageId = '';
      images.forEach(function(imageFile) {
        let imageObject = {
          lastModified: Firebase.database.ServerValue.TIMESTAMP
        };
        if (typeof imageFile === 'string' || imageFile instanceof String) {
          // if its the URL path of the image, just save it
          imageObject.url = imageFile;
          Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + auth + '/' + objectId).push(imageObject);
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
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              // console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case Firebase.storage.TaskState.PAUSED: // or 'paused'
                  // console.log('Upload is paused');
                  dispatch({
                    type: ActionTypes.TIP_IMAGE_UPLOAD_PAUSED,
                    progress,
                    subjectId: objectId
                  })
                  break;
                case Firebase.storage.TaskState.RUNNING: // or 'running'
                  // console.log('Upload is running');
                  dispatch({
                    type: ActionTypes.TIP_IMAGE_UPLOAD_RUNNING,
                    progress,
                    subjectId: objectId
                  })
                  break;
              }
            }, function(error) {
              console.log(error.message)
              dispatch({
                type: ActionTypes.UPLOAD_ERROR,
                error: error.message
              })
          }, function() {
            const downloadURL = uploadTask.snapshot.downloadURL;
            if (downloadURL) {
              imageObject.url = downloadURL;
               // save images in images and images-by-user
              Firebase.database().ref(Constants.IMAGES_BY_USER_PATH + '/' + auth + '/' + objectId).push(imageObject);

              dispatch({
                type: ActionTypes.TIP_IMAGE_UPLOAD_COMPLETED,
                subjectId: objectId,
                meta: {
                mixpanel: {
                  event: 'Upload custom subject photos',
                  itineraryId: itineraryId,
                  subjectId: objectId,
                  numImages: images ? images.length : 0
                }
              }
              })
            }
          })
        }
      })
      // Firebase.database().ref().update(updates);
    }
  }
}

export function uploadCoverPhoto(auth, imageFile, itinerary, itineraryId) {
  return dispatch => {
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
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case Firebase.storage.TaskState.PAUSED: // or 'paused'
              // console.log('Upload is paused');
              dispatch({
                type: ActionTypes.UPLOAD_PAUSED,
                progress
              })
              break;
            case Firebase.storage.TaskState.RUNNING: // or 'running'
              // console.log('Upload is running');
              dispatch({
                type: ActionTypes.UPLOAD_RUNNING,
                progress
              })
              break;
          }
        }, function(error) {
            console.log(error.message)
            dispatch({
              type: ActionTypes.UPLOAD_ERROR,
              error: error.message
            })
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

            dispatch({
              type: ActionTypes.UPLOAD_COMPLETED,
              meta: {
                mixpanel: {
                  event: 'Upload cover photo',
                  itineraryId: itineraryId,
                  geo: itinerary.geo.placeId,
                  numTips: itinerary.tips ? itinerary.tips.length : 0
                }
              }
            })
          }
        })
      }
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

// export function onEditorSubmit(auth, itineraryId, itinerary) {
//   return dispatch => {
//     let updates = {};
//     let reviewsList = {};
//     const lastModified = { lastModified: Firebase.database.ServerValue.TIMESTAMP };
//     let reviews = itinerary.reviews;

//     // create an itineraryId if it doesn't exist
//     if (!itineraryId) {
//       itineraryId = Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + auth).push(Object.assign({}, itinerary, {createdOn: Firebase.database.ServerValue.TIMESTAMP})).key;
//     }
//     for (var i = 0; i < reviews.length; i++) {
//       if (reviews[i].title) {
//         // create the reviewsList for the itinerary
//         let subject = Helpers.makeSubject(reviews[i], lastModified);

//         // if no subject id, create the subject
//         if (!reviews[i].subjectId) {
//           if (reviews[i].id) {
//             // if this is a search result from 4sq, use their id as the subject id
//             reviews[i].subjectId = reviews[i].id;
//             updates[`/${Constants.SUBJECTS_PATH}/${reviews[i].subjectId}`] = subject;

//             let reviewItem = Object.assign({}, reviews[i]);
//             // save the default image from google
//             if (reviews[i].defaultImage && reviews[i].defaultImage[0]) {
//               Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviews[i].subjectId).once('value', imageCheckSnap => {
//                 if (!imageCheckSnap.exists()) {
//                   let imageObject = {
//                     lastModified: Firebase.database.ServerValue.TIMESTAMP
//                   };
//                   imageObject.url = reviewItem.defaultImage[0];
//                   Firebase.database().ref(Constants.IMAGES_PATH + '/' + reviewItem.subjectId).push(imageObject);
//                 }
//               })
//             }
//           }
//           else {
//             // new custom subject, so create it
//             reviews[i].subjectId = Firebase.database().ref(Constants.SUBJECTS_PATH).push(subject).key;
//           }
//         }

//         let reviewBySubject = Helpers.makeReviewBySubjectEditor(reviews[i], reviews[i].subjectId, lastModified);
//         let review = Helpers.makeReviewEditor(reviews[i], reviews[i].subjectId, lastModified);

//         let reviewCreator = reviews[i].userId ? reviews[i].userId : auth;

//         // if review doesnt exist, create it
//         if (!reviews[i].reviewId) {
//           reviews[i].reviewId = Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + auth).push(review).key;
//         }
//         else {
//           updates[`/${Constants.REVIEWS_BY_USER_PATH}/${reviewCreator}/${reviews[i].reviewId}/`] = review;
//         }
//         // update REVIEWS_BY_USER, REVIEWS_BY_SUBJECT, and REVIEWS tables
//         updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${reviews[i].subjectId}/${reviewCreator}/`] = reviewBySubject;
//         updates[`/${Constants.REVIEWS_PATH}/${reviews[i].reviewId}/`] = Object.assign({}, review, { userId: reviewCreator })

//         reviewsList[i] = Object.assign({}, { subjectId: reviews[i].subjectId }, { reviewId: reviews[i].reviewId }, { userId: reviewCreator });
//         // reviewsList[reviews[i].subjectId] = Object.assign({}, { reviewId: reviews[i].reviewId }, {priority: i});

//         // save the custom images from each review
//         let subjectId = reviews[i].subjectId;
//         if (reviews[i].images && reviews[i].images.isNew) {
//           uploadCustomSubjectImages(auth, subjectId, reviews[i].images.files, itineraryId);
//         }
//       }
//     }

//     Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinSnapshot => {
//       Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId).once('value', geoSnapshot => { 
//         Firebase.database().ref(Constants.COUNTRIES_PATH + '/' + itinerary.geo.country + '/places/' + itinerary.geo.placeId).once('value', countrySnapshot => {
//           let itineraryByUserObject = Helpers.makeItineraryByUser(itinerary, lastModified);
//           Object.assign(itineraryByUserObject, { reviewsCount: reviews.length });
//           if (itinSnapshot.exists() && itinSnapshot.val().createdOn) itineraryByUserObject.createdOn = itinSnapshot.val().createdOn;
//           if (itinSnapshot.exists() && itinSnapshot.val().images) itineraryByUserObject.images = itinSnapshot.val().images;

          
//           let itineraryCreator = itinerary.userId ? itinerary.userId : auth;
//           let itineraryObject = Object.assign({}, itineraryByUserObject, { userId: itineraryCreator });

//           // update all itinerary tables
//           updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itineraryCreator}/${itineraryId}`] = itineraryByUserObject;
//           updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itineraryCreator}/${itineraryId}/`] = itineraryByUserObject;
//           updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/`] = itineraryObject;
//           updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}/`] = itineraryObject;

//           // udpate reviews-by-itinerary
//           updates[`/${Constants.TIPS_BY_ITINERARY_PATH}/${itineraryId}/`] = Object.assign({}, reviewsList);

//           // add geo to geo table if its not there
//           if (!geoSnapshot.exists()) {
//             let geoObject = {
//               country: itinerary.geo.country,
//               location: itinerary.geo.location,
//               label: itinerary.geo.label
//             }
//             updates[`/${Constants.GEOS_PATH}/${itinerary.geo.placeId}`] = geoObject;
//           }

//           if (!countrySnapshot.exists()) {
//             updates[`/${Constants.COUNTRIES_PATH}/${itinerary.geo.country}/places/${itinerary.geo.placeId}`] = true;
//           }

//           Firebase.database().ref().update(updates, function(error) {
//             if (error) {
//               console.log("Error updating data:", error);
//             }
//           });

//           // upload itinerary images if they exist
//           if (itinerary.images && itinerary.images.isNew && itinerary.images.files && itinerary.images.files[0]) {
//             setTimeout(function() {
//               uploadCoverPhoto(auth, itinerary.images.files[0], itinerary, itineraryId);
//             }, 2000);
//           }

//           let message = itinerary.title + ' has been saved.';

//           dispatch({
//             type: ITINERARY_UPDATED,
//             itineraryId: itineraryId,
//             message: message,
//             meta: {
//               mixpanel: {
//                 event: 'Itinerary updated',
//                 props: {
//                   itineraryId: itineraryId,
//                 }
//               }
//             }
//           })
//       })
//       })
//     })
//   }
// }

export function editorSubmitError(missingField) {
  return dispatch => {
    dispatch({
      type: EDITOR_SUBMIT_ERROR,
      error: 'Please add: ' + missingField
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

export function findCommentMentions(dispatch, authenticated, commentBody, commentObject, threadId, sentArray, commentId) {
  let pattern = /\B@[a-z0-9_-]+/gi;
  let found = commentBody.match(pattern);
  if (found) {
    for (let i = 0; i < found.length; i++) {
      let username = found[i].substr(1);
      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).once('value', snap => {
        if (snap.exists()) {
          if (snap.val().userId !== authenticated && sentArray.indexOf(snap.val().userId) === -1) {
            Helpers.sendInboxMessage(authenticated, snap.val().userId, Constants.COMMENT_IN_THREAD_MESSAGE, commentObject, threadId, Object.assign({commentId: commentId, message: commentBody}));
            sentArray.push(snap.val().userId);

            // dispatch({
            //   type: MIXPANEL_EVENT,
            //   mixpanel: {
            //     event: SEND_INBOX_MESSAGE,
            //     props: {
            //       type: Constants.USER_MENTIONED_TYPE
            //     }
            //   }
            // })
          }
        }
      })    
    }
  }
}

// export function findCommentMentions(dispatch, authenticated, commentBody, commentObject, itineraryId, sentArray, commentId) {
//   let pattern = /\B@[a-z0-9_-]+/gi;
//   let found = commentBody.match(pattern);
//   if (found) {
//     for (let i = 0; i < found.length; i++) {
//       let username = found[i].substr(1);
//       Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).once('value', snap => {
//         if (snap.exists()) {
//           if (snap.val().userId !== authenticated && sentArray.indexOf(snap.val().userId) === -1) {
//             Helpers.sendInboxMessage(authenticated, snap.val().userId, Constants.USER_MENTIONED_TYPE, commentObject, itineraryId, Object.assign({commentId: commentId, message: commentBody}));
//             sentArray.push(snap.val().userId);

//             dispatch({
//               type: MIXPANEL_EVENT,
//               mixpanel: {
//                 event: SEND_INBOX_MESSAGE,
//                 props: {
//                   type: Constants.USER_MENTIONED_TYPE
//                 }
//               }
//             })
//           }
//         }
//       })    
//     }
//   }
// }

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
      body: body ? body : '',
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    }
    if (userInfo.image) comment.image = userInfo.image;

    let inboxMessageType = ( type === Constants.ITINERARY_TYPE ? Constants.COMMENT_ON_ITINERARY_MESSAGE : Constants.COMMENT_ON_REVIEW_MESSAGE );
    let commentOnCommentType = ( type === Constants.ITINERARY_TYPE ? Constants.COMMENT_ON_COMMENT_ITINERARY_MESSAGE : Constants.COMMENT_ON_COMMENT_REVIEW_MESSAGE );
    let objectId = ( type === Constants.ITINERARY_TYPE ? commentObject.id : commentObject.key );

    if (objectId) {
      // let commentId = Firebase.database().ref(Constants.COMMENTS_PATH + '/' + objectId).push(comment).key;
      let commentId = '';
      let path = '';
      if (type === Constants.TIPS_TYPE) {
        // Helpers.incrementReviewCount(Constants.COMMENTS_COUNT, objectId, commentObject.subjectId, commentObject.userId);
        commentId = Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + objectId + '/comments').push(comment).key;
        path = Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + objectId + '/comments';

        Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + objectId + '/commentsCount').transaction(function (current_count) {
          return (current_count || 0) + 1;
        });
      }
      else if (type === Constants.RECOMMENDATIONS_TYPE) {
        commentId = Firebase.database().ref(Constants.RECS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + objectId + '/comments').push(comment).key;
        path = Constants.RECS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + objectId + '/comments';

        inboxMessageType = Constants.COMMENT_ON_REC_MESSAGE;
        commentOnCommentType = Constants.COMMENT_ON_COMMENT_REC_MESSAGE;
      }
      else if (type === Constants.ITINERARY_TYPE) {
      // this is a comment on an itinerary
        commentId = Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/comments').push(comment).key;
        path = Constants.ITINERARIES_PATH + '/' + itineraryId + '/comments';

        Helpers.incrementItineraryCount(Constants.COMMENTS_COUNT, objectId, commentObject.geo, commentObject.userId); 

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
        Helpers.sendInboxMessage(authenticated, commentObject.userId, inboxMessageType, commentObject, itineraryId, Object.assign({commentId: commentId, message: body}));
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

      Firebase.database().ref(path + '/' + objectId).once('value', commentsSnapshot => {
        commentsSnapshot.forEach(function(comment) {
          let commenterId = comment.val().userId;
          // if not commentor or in sent array, then send a message
          if (commenterId !== authenticated && (sentArray.indexOf(commenterId) === -1)) {
            Helpers.sendInboxMessage(authenticated, commenterId, commentOnCommentType, commentObject, itineraryId, Object.assign({commentId: commentId, message: body}));
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

      // send inbox messages to any usernames mentioned in the comment
      findCommentMentions(dispatch, authenticated, body, commentObject, itineraryId, sentArray, commentId);

      // update guide popularity score
      Helpers.incrementGuideScore(itineraryId, Constants.COMMENT_GUIDE_SCORE);

      const mixpanelProps = ( (type === Constants.TIPS_TYPE ||  type === Constants.RECOMMENDATIONS_TYPE) ? {subjectId: commentObject.subjectId} : {itineraryId: commentObject.id});
      dispatch({
        type: ADD_COMMENT,
        meta: {
          mixpanel: {
            event: 'Comment added',
            dataType: type,
            props: mixpanelProps
          }
        }
      })

      mixpanel.people.increment("total comments");
      mixpanel.people.set({ "last comment date": (new Date()).toISOString() });
      mixpanel.identify(authenticated);
    }
  }
}

export function onDeleteComment(commentObject, commentId, itineraryId, type) {
  return dispatch => {
    if (type === Constants.TIPS_TYPE) {
      Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + commentObject.key + '/comments/' + commentId).remove();
      Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + commentObject.key + '/commentsCount').transaction(function (current_count) {
        return current_count && current_count > 1 ? current_count - 1 : 0;
      })
    }
    else if (type === Constants.RECOMMENDATIONS_TYPE) {
      Firebase.database().ref(Constants.RECS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + commentObject.key + '/comments/' + commentId).remove();
      Firebase.database().ref(Constants.RECS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + commentObject.key + '/commentsCount').transaction(function (current_count) {
        return current_count && current_count > 1 ? current_count - 1 : 0;
      })
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
      Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/comments/' + commentId).remove();

      Helpers.decrementItineraryCount(Constants.COMMENTS_COUNT, commentObject.id, commentObject.geo, commentObject.createdBy.userId);
    }

    // update guide popularity score
    Helpers.decrementGuideScore(itineraryId, Constants.COMMENT_GUIDE_SCORE);

    mixpanel.people.increment("total comments", -1);

    dispatch({
      type: DELETE_COMMENT
    })
  }
}

export function onDeleteItinerary(userId, itineraryId, geo, redirectPath) {
  return dispatch => {
    // first delete all tips in guide in TIPS_BY_SUBJECT
    // paths are TIPS_BY_SUBJECT/subjectId/userId/tipId
    // Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId).once('value', tipsSnap => {
    //   tipsSnap.forEach(function(tipItem) {
    //     let tip = tipItem.val();
    //     Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + tip.subjectId + '/' + tip.userId + '/' + tipItem.key).remove();
    //   })
    // })

    // then delete any likes on the guide
    // LEAVING THIS COMMENTED OUT FOR NOW
    // Firebase.database().ref(Constants.LIKES_BY_USER_PATH).once('value', likesSnapshot => {
    //   likesSnapshot.forEach(function(userChild) {
    //     Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userChild.key + '/' + itineraryId).remove();
    //   })
    // })

    let updates = {};
    updates[Constants.ITINERARIES_PATH + '/' + itineraryId] = null;
    updates[Constants.ITINERARIES_BY_GEO_BY_USER_PATH + '/' + geo + '/' + userId + '/' + itineraryId] = null;
    updates[Constants.ITINERARIES_BY_GEO_PATH + '/' + geo + '/' + itineraryId] = null;
    updates[Constants.ITINERARIES_BY_USER_PATH + '/' + userId + '/' + itineraryId] = null;
    updates[Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId] = null;
    updates[Constants.LIKES_PATH + '/' + itineraryId] = null;
    updates[Constants.COMMENTS_PATH + '/' + itineraryId] = null;

    Firebase.database().ref().update(updates);
    Helpers.fanOutToFollowersFeed(userId, itineraryId, null);

    // decrement itineraryCount for the geo
    Firebase.database().ref(Constants.GEOS_PATH + '/' + geo + '/itineraryCount').transaction(function (current_count) {
      return (current_count - 1 >= 0) ? current_count - 1 : 0;
    });

    let message = 'Your itinerary has been deleted.'
    dispatch({
      type: ITINERARY_DELETED,
      redirect: redirectPath,
      message: message
    })

    mixpanel.people.increment("total itineraries");
    mixpanel.identify(userId);
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
      type: RATING_UPDATED,
      meta: {
        mixpanel: {
          event: 'rating updated',
          props: {
            subject: subjectId,
            rating: rating
          }
        }
      }
    })
  }
}

export function getLikesByUser(auth, userId) {
  return dispatch => {
    let tipFeed = [];
    let guideFeed = [];
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).orderByChild('lastModified').on('value', likesByUserSnapshot => {
      if (!likesByUserSnapshot.exists()) {
        dispatch({
          type: ActionTypes.GET_LIKES_BY_USER,
          guideFeed: [],
          tipFeed: []
        })
      }
      else {
        likesByUserSnapshot.forEach(function(likeItem) {
          if (likeItem.val().type === Constants.ITINERARY_TYPE) {
            let objectPath = Constants.ITINERARIES_PATH
            let imagePath = Constants.IMAGES_ITINERARIES_PATH + '/' + likeItem.key
            Firebase.database().ref(objectPath + '/' + likeItem.key).on('value', objectSnapshot => {
              if (objectSnapshot.exists() && objectSnapshot.val().userId) {
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

                        let comments = [];
                        commentSnapshot.forEach(function(commentChild) {
                          const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
                          comments = comments.concat(comment);
                        })
                        comments.sort(Helpers.lastModifiedAsc);
                       
                        Object.assign(itineraryObject, objectSnapshot.val(), key, createdBy, likes, {comments: comments});
                       
                        // guideFeed = [itineraryObject].concat(guideFeed);
                        guideFeed = guideFeed.concat(itineraryObject)
                        guideFeed.sort(Helpers.lastModifiedDesc);

                        dispatch({
                          type: ActionTypes.GET_LIKES_BY_USER,
                          guideFeed: guideFeed,
                          tipFeed: tipFeed
                        })
                      })
                    })
                  })
                })
              }
            })
          }
          else if (likeItem.exists() && likeItem.val().type === Constants.TIPS_TYPE && likeItem.val().subjectId && likeItem.val().reviewId && likeItem.val().tipCreatedByUserId) {
            Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + likeItem.val().subjectId + '/' + likeItem.val().tipCreatedByUserId + '/' + likeItem.key).on('value', objectSnapshot => {
              if (objectSnapshot.exists()) {
                Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + likeItem.val().subjectId).on('value', subjectSnapshot => {
                  Firebase.database().ref(Constants.REVIEWS_PATH + '/' + likeItem.val().reviewId).on('value', reviewSnapshot => {
                    Firebase.database().ref(Constants.USERS_PATH + '/' + likeItem.val().tipCreatedByUserId).on('value', userSnapshot => {
                      Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + likeItem.key).on('value', isLikedSnapshot => {
                        Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).on('value', commentSnapshot => {
                          Firebase.database().ref(Constants.IMAGES_PATH + '/' + likeItem.val().subjectId).on('value', imagesSnapshot => {
                            const key = { key: likeItem.key };
                            const createdBy = { createdBy: userSnapshot.val(), userId: userSnapshot.key };
                            let likes = { 
                              isLiked: isLikedSnapshot.exists()
                            }

                            let reviewObject = {};

                            let comments = [];
                            commentSnapshot.forEach(function(commentChild) {
                              const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
                              comments = comments.concat(comment);
                            })
                            comments.sort(Helpers.lastModifiedAsc);

                            let images = Helpers.getImagePath(imagesSnapshot.val());

                            Object.assign(reviewObject, key, objectSnapshot.val(), {subjectId: likeItem.val().subjectId}, 
                              {reviewId: likeItem.val().reviewId}, {subject: subjectSnapshot.val()}, 
                              {review: reviewSnapshot.val()}, {userId: userSnapshot.key}, 
                              createdBy, likes, {comments: comments}, {images: images});

                            // tipFeed = [reviewObject].concat(tipFeed);
                            tipFeed = tipFeed.concat(reviewObject)
                            tipFeed.sort(Helpers.lastModifiedDesc);

                            dispatch({
                              type: ActionTypes.GET_LIKES_BY_USER,
                              tipFeed: tipFeed,
                              guideFeed: guideFeed
                            })
                          })
                        })
                      })
                    })
                  })
                })
              }
            })
          }
        })
      }
    })
  }
}


// export function getGuideLikesByUser(auth, userId) {
//   return dispatch => {
//     let likesArray = [];
//     Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).orderByChild('lastModified').on('value', likesByUserSnapshot => {
//       if (!likesByUserSnapshot.exists()) {
//         dispatch({
//           type: GET_LIKES_BY_USER,
//           payload: []
//         })
//       }
//       else {
//         likesByUserSnapshot.forEach(function(likeItem) {
//           if (likeItem.val().type === Constants.ITINERARY_TYPE) {
//             let objectPath = Constants.ITINERARIES_PATH
//             let imagePath = Constants.IMAGES_ITINERARIES_PATH + '/' + likeItem.key
//             Firebase.database().ref(objectPath + '/' + likeItem.key).on('value', objectSnapshot => {
//               if (objectSnapshot.exists()) {
//                 Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + likeItem.val().subjectId).on('value', subjectSnapshot => {
//                   Firebase.database().ref(Constants.USERS_PATH + '/' + objectSnapshot.val().userId).on('value', userSnapshot => {
//                     Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + likeItem.key).on('value', isLikedSnapshot => {
//                       Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).on('value', commentSnapshot => {
//                         Firebase.database().ref(imagePath).on('value', imagesSnapshot => {
//                           const containerObject = {};
//                           const key = { id: likeItem.key };
//                           const createdBy = { createdBy: userSnapshot.val(), userId: userSnapshot.key };
//                           let likes = { 
//                             isLiked: isLikedSnapshot.exists()
//                           }

//                           let itineraryObject = {};

//                           let comments = [];
//                           commentSnapshot.forEach(function(commentChild) {
//                             const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
//                             comments = comments.concat(comment);
//                           })
//                           comments.sort(Helpers.lastModifiedAsc);
                         
//                           Object.assign(itineraryObject, objectSnapshot.val(), key, createdBy, likes, {comments: comments});
                         
//                           likesArray = [itineraryObject].concat(likesArray);
//                           likesArray.sort(Helpers.lastModifiedDesc);

//                           dispatch({
//                             type: ActionTypes.GET_GUIDE_LIKES_BY_USER,
//                             guideFeed: likesArray
//                           })
//                         })
//                       })
//                     })
//                   })
//                 })
//               }
//             })
//           }
//         })
//       }
//     })
//   }
// }

// export function getTipLikesByUser(auth, userId) {
//   return dispatch => {
//     let likesArray = [];
//     Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).orderByChild('lastModified').once('value', likesByUserSnapshot => {
//       if (!likesByUserSnapshot.exists()) {
//         dispatch({
//           type: GET_LIKES_BY_USER,
//           payload: []
//         })
//       }
//       else {
//         likesByUserSnapshot.forEach(function(likeItem) {
//           if (likeItem.exists() && likeItem.val().type === Constants.REVIEW_TYPE && likeItem.val().subjectId && likeItem.val().reviewId && likeItem.val().tipCreatedByUserId) {
//             Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + likeItem.val().subjectId + '/' + likeItem.val().tipCreatedByUserId + '/' + likeItem.key).on('value', objectSnapshot => {
//               if (objectSnapshot.exists()) {
//                 Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + likeItem.val().subjectId).on('value', subjectSnapshot => {
//                   Firebase.database().ref(Constants.REVIEWS_PATH + '/' + likeItem.val().reviewId).on('value', reviewSnapshot => {
//                     Firebase.database().ref(Constants.USERS_PATH + '/' + likeItem.val().tipCreatedByUserId).on('value', userSnapshot => {
//                       Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + likeItem.key).on('value', isLikedSnapshot => {
//                         Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).on('value', commentSnapshot => {
//                           Firebase.database().ref(Constants.IMAGES_PATH + '/' + likeItem.val().subjectId).on('value', imagesSnapshot => {
//                             const key = { key: likeItem.key };
//                             const createdBy = { createdBy: userSnapshot.val(), userId: userSnapshot.key };
//                             let likes = { 
//                               isLiked: isLikedSnapshot.exists()
//                             }

//                             let reviewObject = {};

//                             let comments = [];
//                             commentSnapshot.forEach(function(commentChild) {
//                               const comment = Object.assign({}, { id: commentChild.key }, commentChild.val());
//                               comments = comments.concat(comment);
//                             })
//                             comments.sort(Helpers.lastModifiedAsc);

//                             let images = Helpers.getImagePath(imagesSnapshot.val());

//                             Object.assign(reviewObject, key, objectSnapshot.val(), {subjectId: likeItem.val().subjectId}, 
//                               {reviewId: likeItem.val().reviewId}, {subject: subjectSnapshot.val()}, 
//                               {review: reviewSnapshot.val()}, {userId: userSnapshot.key}, 
//                               createdBy, likes, {comments: comments}, {images: images});

//                             likesArray = [reviewObject].concat(likesArray);
//                             likesArray.sort(Helpers.lastModifiedDesc);

//                             dispatch({
//                               type: ActionTypes.GET_TIP_LIKES_BY_USER,
//                               tipFeed: likesArray
//                             })
//                           })
//                         })
//                       })
//                     })
//                   })
//                 })
//               }
//             })
//           }
//         })
//       }
//     })
//   }
// }

export function onLikesTabClick(tab) {
  return dispatch => {
    dispatch({
      type: ActionTypes.ON_LIKES_TAB_CLICK,
      tipTabActive: tab === 'tip' ? true : false
    })
  }
}

export function unloadLikesByUser(auth, userId) {
    return dispatch => {
    let likesArray = [];
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).orderByChild('lastModified').once('value', likesByUserSnapshot => {
      likesByUserSnapshot.forEach(function(likeItem) {
        if (likeItem.val().type === Constants.ITINERARY_TYPE) {
          Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + likeItem.key).once('value', objectSnapshot => {
            if (objectSnapshot.exists() && objectSnapshot.val().userId) {
              Firebase.database().ref(Constants.USERS_PATH + '/' + objectSnapshot.val().userId).off();
              Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + likeItem.key).off();
              Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).off();
              Firebase.database().ref(Constants.IMAGES_ITINERARIES_PATH + '/' + likeItem.key).off();
            }
          })
          Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + likeItem.key).off();
        }
        else if (likeItem.exists() && likeItem.val().type === Constants.TIPS_TYPE && likeItem.val().subjectId && likeItem.val().reviewId && likeItem.val().tipCreatedByUserId) {
          Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + likeItem.val().subjectId + '/' + likeItem.val().tipCreatedByUserId + '/' + likeItem.key).once('value', objectSnapshot => {
            if (objectSnapshot.exists()) {
              Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + likeItem.val().subjectId).off();
              Firebase.database().ref(Constants.REVIEWS_PATH + '/' + likeItem.val().reviewId).off();
              Firebase.database().ref(Constants.USERS_PATH + '/' + likeItem.val().tipCreatedByUserId).off();
              Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + likeItem.key).off();
              Firebase.database().ref(Constants.COMMENTS_PATH + '/' + likeItem.key).off();
              Firebase.database().ref(Constants.IMAGES_PATH + '/' + likeItem.val().subjectId).off();
            }
          })
          Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + likeItem.val().subjectId + '/' + likeItem.val().tipCreatedByUserId + '/' + likeItem.key).off();
        }
      })
    })
    Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + userId).off();
  }
}

// export function getGlobalFeed(auth) {
//   return dispatch => {
//     let feedArray = [];
//     Firebase.database().ref(Constants.ITINERARIES_PATH).orderByChild('lastModified').limitToLast(20).on('value', itinerariesSnapshot => {
//       itinerariesSnapshot.forEach(function(itin) {
//         Firebase.database().ref(Constants.USERS_PATH + '/' + itin.val().userId).on('value', userSnapshot => {
//           Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).on('value', likesSnapshot => {
//             const itineraryObject = {};
//             const key = { id: itin.key };
//             const createdBy = { createdBy: Object.assign({}, userSnapshot.val(), {userId: itin.val().userId}) };
//             let likes = {
//               isLiked: likesSnapshot.exists()
//             }
            
//             Object.assign(itineraryObject, itin.val(), key, createdBy, likes);

//             feedArray = [itineraryObject].concat(feedArray);
//             // feedArray.sort(Helpers.byPopularity);
//             feedArray.sort(Helpers.byLastModifiedAsc);
//             dispatch({
//               type: ActionTypes.GET_GLOBAL_FEED,
//               payload: feedArray
//             })
//           })
//         })
//       })
//     })
//   }
// }

// export function unloadGlobalFeed(uid) {
//   return dispatch => {
//     Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').on('value', reviewsSnapshot => {
//       reviewsSnapshot.forEach(function(review) {
//         Firebase.database().ref(Constants.USERS_PATH + '/' + review.val().userId).off();
//         Firebase.database().ref(Constants.LIKES_PATH + '/' + review.key).off();
//         Firebase.database().ref(Constants.SAVES_BY_USER_PATH + '/' + uid + '/' + review.key).off();
//         Firebase.database().ref(Constants.COMMENTS_PATH + '/' + review.key).off();
//         Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + review.val().subjectId).off();
//       })
//     })
//     Firebase.database().ref(Constants.REVIEWS_PATH + '/').orderByChild('lastModified').off();

//     dispatch({
//       type: ActionTypes.GLOBAL_FEED_UNLOADED
//     })
//   }
// }

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

export function likeItinerary(authenticated, type, likeObject, itineraryId, username) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
  }
}

export function likeReview(authenticated, type, likeObject, itineraryId, username) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }

    let id = (type === Constants.ITINERARY_TYPE ? likeObject.id : likeObject.key);
    if (id) {
      const updates = {};
      let saveObject = {
        type: type,
        itineraryId: itineraryId
        // lastModified: Firebase.database.ServerValue.TIMESTAMP
      }
      if (type === Constants.TIPS_TYPE) {
        // saveObject.subjectId = likeObject.subjectId;
        // saveObject.reviewId = likeObject.reviewId;
        // saveObject.tipCreatedByUserId = likeObject.userId;
        updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${id}`] = saveObject;
        updates[`/${Constants.SUBJECTS_BY_ITINERARY_PATH}/${itineraryId}/${likeObject.key}/likes/${authenticated}`] = username;
      }
      else if (type === Constants.RECOMMENDATIONS_TYPE) {
        updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${id}`] = saveObject;
        updates[`/${Constants.RECS_BY_ITINERARY_PATH}/${itineraryId}/${likeObject.key}/likes/${authenticated}`] = username;
      }
      else {  // ITINERARY_TYPE
        updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${id}`] = omit(saveObject, ['itineraryId']);
        updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/likes/${authenticated}`] = username;
      }

      Firebase.database().ref().update(updates).then(response => {
        if (type === Constants.ITINERARY_TYPE) {
          Helpers.incrementItineraryCount(Constants.LIKES_COUNT, id, likeObject.geo, likeObject.createdBy.userId);
          Helpers.sendInboxMessage(authenticated, likeObject.createdBy.userId, Constants.LIKE_ITINERARY_MESSAGE, likeObject, itineraryId, null);

          mixpanel.people.increment("total likes");

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
            type: SEND_INBOX_MESSAGE,
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
        // this is actually liking a tip, not a review. Just incrementing the counts
        else if (type === Constants.TIPS_TYPE) {
          // Helpers.incrementReviewCount(Constants.LIKES_COUNT, id, likeObject.subjectId, likeObject.createdBy.userId);
          Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + id + '/likesCount').transaction(function (current_count) {
            return (current_count || 0) + 1;
          });
          // Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + likeObject.subjectId + '/' + likeObject.userId + '/' + id + '/likesCount').transaction(function (current_count) {
          //   return (current_count || 0) + 1;
          // });

          // update guide popularity score
          Helpers.incrementGuideScore(itineraryId, Constants.LIKE_GUIDE_SCORE);
          // send inbox message to guide owner
          Helpers.sendInboxMessage(authenticated, likeObject.userId, Constants.LIKE_TIP_MESSAGE, likeObject, itineraryId, null);

          mixpanel.people.increment("total likes");

          dispatch({
            type: REVIEW_LIKED,
            meta: {
              mixpanel: {
                event: 'Liked review',
                props: {
                  tipId: id,
                  itineraryId: itineraryId
                }
              }
            }
          })
          dispatch({
            type: SEND_INBOX_MESSAGE,
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
        else if (type === Constants.RECOMMENDATIONS_TYPE) {
          // incrementing counts for recs
          Firebase.database().ref(Constants.RECS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + id + '/likesCount').transaction(function (current_count) {
            return (current_count || 0) + 1;
          });

          // send inbox message to guide owner
          Helpers.sendInboxMessage(authenticated, likeObject.userId, Constants.LIKE_REC_MESSAGE, likeObject, itineraryId, null);

          dispatch({
            type: ActionTypes.RECOMMENDATION_LIKED,
            meta: {
              mixpanel: {
                event: 'Liked recommendation',
                props: {
                  tipId: id,
                  itineraryId: itineraryId
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

// export function likeReview2(authenticated, type, likeObject, itineraryId, username) {
//   return dispatch => {
//     if (!authenticated) {
//       dispatch({
//         type: ASK_FOR_AUTH
//       })
//     }

//     let id = (type === Constants.ITINERARY_TYPE ? likeObject.id : likeObject.key);
//     if (id) {
//       const updates = {};
//       let saveObject = {
//         type: type,
//         // lastModified: Firebase.database.ServerValue.TIMESTAMP
//       }
//       if (type === Constants.TIPS_TYPE || type === Constants.RECOMMENDATIONS_TYPE) {
//         saveObject.subjectId = likeObject.subjectId;
//         saveObject.reviewId = likeObject.reviewId;
//         saveObject.tipCreatedByUserId = likeObject.userId;
//       }

//       updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${id}`] = saveObject;
//       updates[`/${Constants.LIKES_PATH}/${id}/${authenticated}`] = saveObject;

//       Firebase.database().ref().update(updates).then(response => {
//         if (type === Constants.ITINERARY_TYPE) {
//           Helpers.incrementItineraryCount(Constants.LIKES_COUNT, id, likeObject.geo, likeObject.createdBy.userId);
//           Helpers.sendInboxMessage(authenticated, likeObject.createdBy.userId, Constants.LIKE_ITINERARY_MESSAGE, likeObject, itineraryId, null);

//           mixpanel.people.increment("total likes");

//           dispatch({
//             type: REVIEW_LIKED,
//             meta: {
//               mixpanel: {
//                 event: 'Liked itinerary',
//                 props: {
//                   itineraryId: likeObject.itineraryId
//                 }
//               }
//             }
//           })
//           dispatch({
//             type: SEND_INBOX_MESSAGE,
//             meta: {
//               mixpanel: {
//                 event: 'Send inbox message',
//                 props: {
//                   type: Constants.LIKE_ITINERARY_MESSAGE
//                 }
//               }
//             }
//           })
//         }
//         // this is actually liking a tip, not a review. Just incrementing the counts
//         else if (type === Constants.TIPS_TYPE) {
//           // Helpers.incrementReviewCount(Constants.LIKES_COUNT, id, likeObject.subjectId, likeObject.createdBy.userId);
//           Firebase.database().ref(Constants.TIPS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + id + '/likesCount').transaction(function (current_count) {
//             return (current_count || 0) + 1;
//           });
//           Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + likeObject.subjectId + '/' + likeObject.userId + '/' + id + '/likesCount').transaction(function (current_count) {
//             return (current_count || 0) + 1;
//           });

//           // update guide popularity score
//           Helpers.incrementGuideScore(itineraryId, Constants.LIKE_GUIDE_SCORE);
//           // send inbox message to guide owner
//           Helpers.sendInboxMessage(authenticated, likeObject.userId, Constants.LIKE_TIP_MESSAGE, likeObject, itineraryId, null);

//           mixpanel.people.increment("total likes");

//           dispatch({
//             type: REVIEW_LIKED,
//             meta: {
//               mixpanel: {
//                 event: 'Liked review',
//                 props: {
//                   tipId: id,
//                   itineraryId: itineraryId
//                 }
//               }
//             }
//           })
//           dispatch({
//             type: SEND_INBOX_MESSAGE,
//             meta: {
//               mixpanel: {
//                 event: SEND_INBOX_MESSAGE,
//                 props: {
//                   type: Constants.LIKE_MESSAGE
//                 }
//               }
//             }
//           })
//         }
//         else if (type === Constants.RECOMMENDATIONS_TYPE) {
//           // incrementing counts for recs
//           Firebase.database().ref(Constants.RECS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + id + '/likesCount').transaction(function (current_count) {
//             return (current_count || 0) + 1;
//           });

//           // send inbox message to guide owner
//           Helpers.sendInboxMessage(authenticated, likeObject.userId, Constants.LIKE_REC_MESSAGE, likeObject, itineraryId, null);

//           dispatch({
//             type: ActionTypes.RECOMMENDATION_LIKED,
//             meta: {
//               mixpanel: {
//                 event: 'Liked recommendation',
//                 props: {
//                   tipId: id,
//                   itineraryId: itineraryId
//                 }
//               }
//             }
//           })
//         }
//       })
//       .catch(error => {
//         console.log(error);
//       })
//     }
//   }
// }

export function unLikeReview(authenticated, type, unlikeObject, itineraryId) {
  return dispatch => {
    if (!authenticated) {
      dispatch({
        type: ASK_FOR_AUTH
      })
    }
    let id = (type === Constants.ITINERARY_TYPE ? unlikeObject.id : unlikeObject.key);
    const updates = {};
    // updates[`/${Constants.LIKES_PATH}/${id}/${authenticated}`] = null;
    if (type === Constants.TIPS_TYPE) {
      updates[`/${Constants.SUBJECTS_BY_ITINERARY_PATH}/${itineraryId}/${unlikeObject.key}/likes/${authenticated}`] = null;
    }
    else if (type === Constants.RECOMMENDATIONS_TYPE) {
      updates[`/${Constants.RECS_BY_ITINERARY_PATH}/${itineraryId}/${unlikeObject.key}/likes/${authenticated}`] = null;
    }
    else { // type === Constants.ITINERARY_TYPE
      updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/likes/${authenticated}`] = null;
    }
    updates[`/${Constants.LIKES_BY_USER_PATH}/${authenticated}/${id}`] = null;
    Firebase.database().ref().update(updates).then(response => {
      if (type === Constants.TIPS_TYPE) {
        // Helpers.decrementReviewCount(Constants.LIKES_COUNT, id, unlikeObject.subjectId, unlikeObject.createdBy.userId);
        Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + id + '/likesCount').transaction(function (current_count) {
          return (current_count >= 1) ? current_count - 1 : 0;
        });
        // Firebase.database().ref(Constants.TIPS_BY_SUBJECT_PATH + '/' + unlikeObject.subjectId + '/' + unlikeObject.userId + '/' + id + '/likesCount').transaction(function (current_count) {
        //   return (current_count >= 1) ? current_count - 1 : 0;
        // });
      }
      else if (type === Constants.RECOMMENDATIONS_TYPE) {
        Firebase.database().ref(Constants.RECS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + id + '/likesCount').transaction(function (current_count) {
          return (current_count >= 1) ? current_count - 1 : 0;
        });
      }
      else if (type === Constants.ITINERARY_TYPE) {
        Helpers.decrementItineraryCount(Constants.LIKES_COUNT, id, unlikeObject.geo, unlikeObject.createdBy.userId);
      }

      // update guide popularity score
      Helpers.decrementGuideScore(itineraryId, Constants.LIKE_GUIDE_SCORE);

      mixpanel.people.increment("total likes", -1);

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

        mixpanel.people.increment("total saves");

        dispatch({
          type: REVIEW_SAVED,
          meta: {
            mixpanel: {
              event: 'Saved review',
              props: {
                subjectId: review.subjectId,
              }
            }
          }
        })
        dispatch({
          type: SEND_INBOX_MESSAGE,
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

        mixpanel.people.increment("total saves", -1);

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
    const current = Firebase.auth().currentUser ? Firebase.auth().currentUser.uid : null;
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

export function findSubject(subjectId, reviewsList) {
  for (let i = 0; i < reviewsList.length; i++) {
    if (subjectId === reviewsList[i].subjectId) {
      return true;
    }
  }
  return false;
}

function createGeo(itinerary) {
  // adds geo to the geo table if it doesnt exists
  if (itinerary && itinerary.geo && itinerary.geo.location && itinerary.geo.label && itinerary.geo.placeId) {
    Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId).once('value', geoSnapshot => {
      Firebase.database().ref(Constants.COUNTRIES_PATH + '/' + itinerary.geo.country + '/places/' + itinerary.geo.placeId).once('value', countrySnapshot => {
        let updates = {}
        
        if (!geoSnapshot.exists() || !geoSnapshot.val().fullCountry) {
          let geoObject = {
            location: itinerary.geo.location,
            label: itinerary.geo.label,
            itineraryCount: 1
          }
          if (itinerary.geo.country) geoObject.country = itinerary.geo.country;
          if (itinerary.geo.fullCountry) geoObject.fullCountry = itinerary.geo.fullCountry;
          if (itinerary.geo.shortName) geoObject.shortName = itinerary.geo.shortName;
          updates[`/${Constants.GEOS_PATH}/${itinerary.geo.placeId}`] = geoObject;
        }
        // otherwise just increment itineraryCount for geo
        else {
          // increment itinerary count on geo
          Firebase.database().ref(Constants.GEOS_PATH + '/' + itinerary.geo.placeId + '/itineraryCount').transaction(function (current_count) {
            return (current_count || 0) + 1;
          });
        }

        if (!countrySnapshot.exists()) {
          updates[`/${Constants.COUNTRIES_PATH}/${itinerary.geo.country}/places/${itinerary.geo.placeId}`] = true;
        }

        Firebase.database().ref().update(updates);
      })
    })
  }
}

export function addToItinerary(auth, tip, itinerary, fromItineraryId) {
  return dispatch => {
    let itineraryId;
    // create the itinerary if this is a new itinerary
    if (!itinerary.itineraryId) {
      itineraryId = Firebase.database().ref(Constants.ITINERARIES_PATH).push(Object.assign({}, itinerary, {createdOn: Firebase.database.ServerValue.TIMESTAMP}, {maxPriority: 1})).key;
      let itineraryObject = Object.assign({}, itinerary, {createdOn: Firebase.database.ServerValue.TIMESTAMP});
      delete itineraryObject.userId;
      let newItinUpdates =  {};
      newItinUpdates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${auth}/${itineraryId}`] = itineraryObject;
      newItinUpdates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itineraryId}`] = Object.assign({}, itineraryObject, {userId: auth});
      newItinUpdates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/${itineraryId}`] = Object.assign({}, itineraryObject);
      Firebase.database().ref().update(newItinUpdates);
      createGeo(itinerary);
    }
    else {
      itineraryId = itinerary.itineraryId;
    }

    Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId + '/' + tip.key).once('value', tipByItinSnap => {
      let subjectId = tip.key;
      // if itinerary already contains the subject, show a message that its already there
      if (tipByItinSnap.exists()) {
        // tip already exists in itinerary, dispatch an error message
        dispatch({
          type: SUBJECT_DUPLICATE,
          message: itinerary.title + ' already contains ' + tip.subject.title
        })
      }
      else {
        Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', itinSnapshot => {
          if (itinSnapshot.exists()) {
            // see if the user has already reviewed the subject. If so, add their review
            Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + auth).once('value', reviewSnapshot => {
              let geo = itinSnapshot.val().geo;
              let updates = {};
              let lastModified = Firebase.database.ServerValue.TIMESTAMP;
              let priority = itinSnapshot.val().maxPriority ? itinSnapshot.val().maxPriority + 1 : (itinSnapshot.val().reviewsCount ? itinSnapshot.val().reviewsCount + 1 : 1);
              let tipData = Object.assign({}, pick(tip, ['lastModified', 'comments', 'tags']), {userId: auth}, {priority: priority})
              tipData.subject = Object.assign({}, pick(tip.subject, ['title', 'location']))
                
              if (reviewSnapshot.exists() && reviewSnapshot.val().reviewId) {
                Object.assign(tipData, pick(reviewSnapshot.val(), ['rating', 'caption', 'reviewId']))
              }
              else {
                // get review data from the itinerary we saved from
                let reviewObject = Object.assign({}, pick(tip, ['rating', 'caption']), {lastModified: lastModified});
                let reviewId = Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + auth).push().key;
                updates[`/${Constants.REVIEWS_BY_USER_PATH}/${auth}/${reviewId}/`] = Object.assign({}, reviewObject, {subjectId: subjectId});
                updates[`/${Constants.REVIEWS_BY_SUBJECT_PATH}/${subjectId}/${auth}/`] = Object.assign({}, reviewObject, {reviewId: reviewId});
                updates[`/${Constants.REVIEWS_PATH}/${reviewId}/`] = Object.assign({}, reviewObject, { userId: auth }, {subjectId: subjectId});
                Object.assign(tipData, reviewObject, {reviewId: reviewId});
              }

              // update reviews by itinerary
              // let tipId = Firebase.database().ref(Constants.SUBJECTS_BY_ITINERARY_PATH + '/' + itineraryId).push(tipData).key;
              updates[`/${Constants.SUBJECTS_BY_ITINERARY_PATH}/${itineraryId}/${subjectId}`] = tipData;

              // add to tips-by-subject
              // updates[`/${Constants.TIPS_BY_SUBJECT_PATH}/${subjectId}/${auth}/${tipId}/`] = Object.assign({}, {itineraryId: itineraryId}, {title: itinSnapshot.val().title});

              // add the new itinerary for this tip
              updates[`/${Constants.ITINERARIES_BY_USER_BY_TIP_PATH}/${auth}/${subjectId}/${itineraryId}`] = true

              // update lastModified on itinerary tables
              updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/lastModified`] = lastModified;
              updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${geo.placeId}/${auth}/${itineraryId}/lastModified`] = lastModified;
              updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${geo.placeId}/${itineraryId}/lastModified`] = lastModified;
              updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/${itineraryId}/lastModified`] = lastModified;

              // update maxPriority on all itineraries
              updates[`/${Constants.ITINERARIES_PATH}/${itineraryId}/maxPriority`] = priority;
              updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${geo.placeId}/${auth}/${itineraryId}/maxPriority`] = priority;
              updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${geo.placeId}/${itineraryId}/maxPriority`] = priority;
              updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${auth}/${itineraryId}/maxPriority`] = priority;

              // increment reviewsCount counters on itinerary tables
              Helpers.incrementItineraryCount(Constants.REVIEWS_COUNT, itineraryId, geo, auth);

              Helpers.incrementGuideScore(itineraryId, Constants.ADD_TIP_GUIDE_SCORE)

              Firebase.database().ref().update(updates);
              Helpers.fanOutToFollowersFeed(auth, itineraryId, lastModified);

              // update tag counts on itinerary
              for (var tagName in tip.tags) {
                if(tip.tags.hasOwnProperty(tagName)) {
                  Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/tags/' + tagName).transaction(function (current_count) {
                    return (current_count || 0) + 1;
                  });
                }
              }

              let message = tip.subject.title + ' successfully added to ' + itinerary.title;

              Helpers.sendInboxMessage(auth, tip.userId, Constants.SAVE_MESSAGE, Object.assign({}, itinerary, {id: itineraryId}), itineraryId)

              mixpanel.people.increment("total saves");

              dispatch({
                type: ADDED_TO_ITINERARY,
                message: message,
                link: '/guide/' + itineraryId,
                meta: {
                  mixpanel: {
                    event: 'Saved to itinerary',
                    props: {
                      itineraryId: itineraryId,
                      tipId: tip.key,
                      userId: tip.userId
                    },
                  }
                }
              })
            })
          }
          else {
            dispatch({
              type: SHOW_SNACKBAR,
              message: 'ERROR: Sorry, place info does not exist'
            })
          }
        })
      }
    })
  }
}

export function watchAllUsers(auth, source) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_PATH).on('value', snapshot => {
      snapshot.forEach(function(user) {
        if (user.key !== auth) {
          watchFollowingPath(dispatch, auth, user.key);
        }
        dispatch({
          type: ActionTypes.USER_VALUE_ACTION,
          userInfo: user.val(),
          userId: user.key,
          source: source
        })
      })
    })
  }
}

export function watchFollowingPath(dispatch, auth, userId) {
  Firebase.database().ref(Constants.IS_FOLLOWING_PATH + '/' + auth + '/' + userId).on('value', followingSnap => {
    if (followingSnap.exists()) {
      dispatch({
        type: ActionTypes.IS_FOLLOWING_ADDED,
        userId
      })
    }
    else {
      dispatch({
        type: ActionTypes.IS_FOLLOWING_REMOVED,
        userId
      })
    }
  })
}

export function unwatchAllUsers(auth) {
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

export function openLightbox(images) {
  return dispatch => {
    dispatch({
      type: OPEN_LIGHTBOX,
      images: images,
      meta: {
        mixpanel: {
          event: 'Opened Lightbox',
        }
      }
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

export function openSnackbar(message) {
  return dispatch => {
    dispatch({
      type: SHOW_SNACKBAR,
      message: message
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

export function getPopularGeos() {
  return dispatch => {
    Firebase.database().ref(Constants.GEOS_PATH).orderByChild('itineraryCount').limitToLast(5).once('value', snap => {
      let geosArray = [];
      snap.forEach(function(geo) {
        let geoObject = Object.assign({}, {id: geo.key}, {label: geo.val().label}, {shortName: geo.val().shortName})
        geosArray = geosArray.concat(geoObject)
      })
      dispatch({
        type: ActionTypes.GET_POPULAR_GEOS,
        popularGeos: geosArray
      })
    })
  }
}

export function userDoesntExist() {
  return dispatch => {
    dispatch({
      type: ActionTypes.USER_DOESNT_EXIST
    })
  }
}

export function loadRecommendPage(rid) {
  return dispatch => {
    Firebase.database().ref(Constants.RECOMMENDATIONS_PATH + '/' + rid).on('value', snap => {
      dispatch({
        type: ActionTypes.LOAD_RECOMMEND_PAGE,
        recId: rid,
        recObject: snap.val()
      })
    })
  }
}

export function universalGeoSearch(placeId, geoData) {
  return dispatch => {
    Firebase.database().ref(Constants.GEOS_PATH + '/' + placeId).once('value', snap => {
      if (!snap.exists() && placeId && geoData.location && geoData.label) {
        Firebase.database().ref(Constants.GEOS_PATH + '/' + placeId).update(geoData);
      }
      dispatch({
        type: ActionTypes.UNIVERSAL_GEO_SEARCH,
        placeId: placeId
      })
    })
  }
}