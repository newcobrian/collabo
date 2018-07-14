import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import { watchUser, unwatchUser } from './index'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit } from 'lodash'

export function onAddProject(auth, project) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else {
      let projectName = project.name;
      Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/collabo/' + projectName.toLowerCase()).once('value', nameSnapshot => {
        if (nameSnapshot.exists()) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'A project called "' + project.name + '" already exists. Please choose another name',
            source: Constants.ADD_PROJECT_PAGE
          })
        }
        else {
          let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
          let projectObject = {
            lastModified: serverTimestamp,
            createdOn: serverTimestamp,
            org: 'collabo'
          }
          let updates = {};
          Object.assign(projectObject, project)

          let projectId = Firebase.database().ref(Constants.PROJECTS_PATH).push(projectObject).key;

          updates[`/${Constants.PROJECT_NAMES_BY_ORG_PATH}/collabo/${projectName.toLowerCase()}/`] = projectId;
          updates[`/${Constants.PROJECTS_BY_USER_PATH}/${auth}/${projectId}/`] = { name: project.name };

          Firebase.database().ref().update(updates);

          // // update Algolia index
          // Helpers.updateAlgloiaGeosIndex(itinerary.geo)

          // mixpanel.people.increment("total itineraries");
          // mixpanel.people.set({ "last itinerary created": (new Date()).toISOString() });
          // mixpanel.identify(auth);

          dispatch({
            type: ActionTypes.PROJECT_CREATED,
            project: projectObject,
            projectId: projectId,
            // meta: {
            //   mixpanel: {
            //     event: 'Itinerary created',
            //     source: 'create page',
            //     itineraryId: itineraryId,
            //     geo: itinerary.geo.placeId
            //   }
            // }
          })
        }
      })
    }
  }
}

export function onAddThread(auth, projectId, thread) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else {
      Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).once('value', projectSnapshot => {
        if (!projectSnapshot.exists()) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'No project selected',
            source: Constants.ADD_THREAD_PAGE
          })
        }
        else {
          let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
          let threadObject = {
            lastModified: serverTimestamp,
            createdOn: serverTimestamp,
            org: projectSnapshot.val().org,
            userId: auth,
            projectId: projectId
          }
          let updates = {};
          Object.assign(threadObject, thread)

          let threadId = Firebase.database().ref(Constants.THREADS_PATH).push(threadObject).key;

          updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${projectId}/${threadId}/`] = omit(threadObject, ['projectId']);
          updates[`/${Constants.THREADS_BY_USER_PATH}/${auth}/${threadId}/`] = omit(threadObject, ['userId']);

          Firebase.database().ref().update(updates);

          // // update Algolia index
          // Helpers.updateAlgloiaGeosIndex(itinerary.geo)

          // mixpanel.people.increment("total itineraries");
          // mixpanel.people.set({ "last itinerary created": (new Date()).toISOString() });
          // mixpanel.identify(auth);

          dispatch({
            type: ActionTypes.THREAD_CREATED,
            threadId: threadId,
            // meta: {
            //   mixpanel: {
            //     event: 'Itinerary created',
            //     source: 'create page',
            //     itineraryId: itineraryId,
            //     geo: itinerary.geo.placeId
            //   }
            // }
          })
        }
      })
    }
  }
}

export function loadProject(projectId) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).once('value', projectSnapshot => {
      if (projectSnapshot.exists()) {
        dispatch({
          type: ActionTypes.LOAD_PROJECT,
          project: projectSnapshot.val()
        })
      }
      else {
        dispatch({
          type: ActionTypes.PROJECT_NOT_FOUND_ERROR
        })
      }
    })
  }
}

export function watchProjectThreads(projectId) {
  return dispatch=> {
    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).orderByChild('lastModified').on('child_added', threadSnapshot => {
      if (threadSnapshot.val().userId) {
        watchUser(dispatch, threadSnapshot.val().userId, Constants.PROJECTS_PAGE)
      }
      dispatch(threadAddedAction(threadSnapshot.key, threadSnapshot.val()));
    })

    // on child changed, how do we unwatch old refs?
    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).orderByChild('lastModified').on('child_changed', threadSnapshot => {
      dispatch(threadChangedAction(threadSnapshot.key, threadSnapshot.val()));
    })

    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).orderByChild('lastModified').on('child_removed', threadSnapshot => {
      dispatch(threadRemovedAction(threadSnapshot.key));
    })
  }
}

function threadAddedAction(threadId, thread) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.THREAD_ADDED_ACTION,
    threadId,
    thread
  }
}

function threadChangedAction(threadId, thread) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.THREAD_CHANGED_ACTION,
    threadId,
    thread
  }
}

function threadRemovedAction(threadId) {
  return {
    type: ActionTypes.THREAD_REMOVED_ACTION,
    threadId
  }
}

export function getProjectThreads(auth, projectId) {
  return dispatch => {
    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).on('value', threadsSnapshot => {
      let feedArray = [];
      if (threadsSnapshot.exists()) {
        threadsSnapshot.forEach(function(itin) {
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
              feedArray.sort(Helpers.byPopularity);
              dispatch({
                type: ActionTypes.GET_PLACES_FEED,
                payload: feedArray
              })
            })
          })
        })
      }
      else {
        dispatch({
          type: ActionTypes.GET_PLACES_FEED,
          payload: []
        })
      }
    })
  }
}

export function unloadProjectThreads(auth, projectId) {
  return dispatch => {
    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).orderByChild('lastModified').off();

    dispatch({
      type: ActionTypes.UNLOAD_PROJECT_THREADS
    })
  }
}

export function loadProjectList(auth) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_added', snap => {
      dispatch({
        type: ActionTypes.PROJECT_LIST_ADDED_ACTION,
        projectId: snap.key,
        project: snap.val()
      })
    })

    Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_changed', snap => {
      dispatch({
        type: ActionTypes.PROJECT_LIST_CHANGED_ACTION,
        projectId: snap.key,
        project: snap.val()
      })
    })

    Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_removed', snap => {
      dispatch({
        type: ActionTypes.PROJECT_LIST_REMOVED_ACTION,
        projectId: snap.key
      })
    })
  }
}

export function unloadProjectList(auth) {
  return dispatch => {
     Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).off();
     dispatch({
      type: ActionTypes.UNLOAD_PROJECT_LIST
     })
  }
}

export function loadThread(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId).on('value', threadSnapshot => {
      if (threadSnapshot.exists()) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).on('value', userSnapshot => {
          dispatch({
            type: ActionTypes.LOAD_THREAD,
            thread: threadSnapshot.val(),
            createdBy: userSnapshot.val()
          })
        })
      }
      else {
        dispatch({
          type: ActionTypes.THREAD_NOT_FOUND_ERROR
        })
      }
    })
  }
}

export function unloadThread(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId).off();
      dispatch({
        type: ActionTypes.UNLOAD_THREAD
      })
  }
}


export function updateThreadField(auth, threadId, thread, field, value) {
  return dispatch => {
    if (thread && threadId && thread.userId) {
      let updates = {}

      // update all thread tables
      updates[`/${Constants.THREADS_PATH}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_USER_PATH}/${thread.userId}/${threadId}/${field}/`] = value

      // update lastModified timestamps
      let timestamp = Firebase.database.ServerValue.TIMESTAMP;
      updates[`/${Constants.THREADS_PATH}/${threadId}/lastModified/`] = timestamp
      updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/lastModified/`] = timestamp
      updates[`/${Constants.THREADS_BY_USER_PATH}/${thread.userId}/${threadId}/lastModified/`] = timestamp

      Firebase.database().ref().update(updates);

      dispatch({
        type: ActionTypes.THREAD_UPDATED,
        message: 'Your changes have been saved'
      })
    }
    // if (itinerary && itinerary.id && itinerary.userId && itinerary.geo && itinerary.geo.placeId) {
    //   let updates = {};
      
    //   // update all itinerary tables
    //   updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/${field}`] = value;
    //   updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/${field}`] = value;
    //   updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/${field}`] = value;
    //   updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/${field}`] = value;

    //   // update lastModified timestamps
    //   let timestamp = Firebase.database.ServerValue.TIMESTAMP;
    //   updates[`/${Constants.ITINERARIES_BY_USER_PATH}/${itinerary.userId}/${itinerary.id}/lastModified`] = timestamp;
    //   updates[`/${Constants.ITINERARIES_BY_GEO_BY_USER_PATH}/${itinerary.geo.placeId}/${itinerary.userId}/${itinerary.id}/lastModified`] = timestamp;
    //   updates[`/${Constants.ITINERARIES_PATH}/${itinerary.id}/lastModified`] = timestamp;
    //   updates[`/${Constants.ITINERARIES_BY_GEO_PATH}/${itinerary.geo.placeId}/${itinerary.id}/lastModified`] = timestamp;

    //   if (field === 'title') {
    //     for (let i = 0; i < itinerary.tips.length; i++) {
    //       let userId = itinerary.tips[i].userId ? itinerary.tips[i].userId : itinerary.userId;
    //       updates[`/${Constants.TIPS_BY_SUBJECT_PATH}/${itinerary.tips[i].subjectId}/${userId}/${itinerary.tips[i].key}/title`] = value;
    //     }
    //   }

    //   Firebase.database().ref().update(updates);
    //   Helpers.fanOutToFollowersFeed(auth, itinerary.id, timestamp);

    //   dispatch({
    //     type: ActionTypes.ITINERARY_UPDATED,
    //     itineraryId: itinerary.id,
    //     message: itinerary.title + ' saved',
    //     meta: {
    //       mixpanel: {
    //         event: 'Itinerary updated',
    //         props: {
    //           itineraryId: itinerary.id,
    //           field: field
    //         }
    //       }
    //     }
    //   })
    // }
  }
}