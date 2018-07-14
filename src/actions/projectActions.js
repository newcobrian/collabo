import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
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
      // if (threadSnapshot.val().userId) {
      //   watchThreadUser(dispatch, threadSnapshot.val().userId)
      // }
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

// export function watchThreadUser(dispatch, userId) {

// }

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