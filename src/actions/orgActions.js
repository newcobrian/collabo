import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit, debounce } from 'lodash'

export function onCreateOrg(auth, org, userData) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else if (org) {
      let lowercaseName = org.name.toLowerCase()
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowercaseName).once('value', nameSnapshot => {
        if (nameSnapshot.exists() || Constants.INVALID_ORG_NAMES.indexOf(lowercaseName) > -1) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'An organization with the name "' + org.name + '" already exists. Please choose another name',
            source: Constants.CREATE_ORG_PAGE
          })
        }
        else {
          let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
          Object.assign(org, { lastModified: serverTimestamp }, { owner: auth })
          let updates = {};

          let orgId = Firebase.database().ref(Constants.ORGS_PATH).push(org).key;

          updates[`/${Constants.ORGS_BY_NAME_PATH}/${lowercaseName}/`] = Object.assign({}, {orgId: orgId}, omit(org, ['name']));
          updates[`/${Constants.ORGS_BY_USER_PATH}/${auth}/${orgId}/`] = true;

          // save the user's username, etc to users-by-org
          updates[`/${Constants.USERS_BY_ORG_PATH}/${orgId}/${auth}/`] = 
            Object.assign({}, userData, {role: Constants.OWNER_ROLE})

          // save to usernames by org
          updates[`/${Constants.USERNAMES_BY_ORG_PATH}/${orgId}/${userData.username.toLowerCase()}/`] = auth

          // save user's last username to users-path
          updates[`/${Constants.USERS_PATH}/${auth}/`] = userData.username

          // create dummy data
          Constants.DUMMY_PROJECTS.forEach(function(project) {
            let projectObject = {
              name: project.name,
              isPublic: true,
              lastModified: serverTimestamp,
              createdOn: serverTimestamp,
              orgId: orgId
            }

            let projectId = Firebase.database().ref(Constants.PROJECTS_PATH).push(projectObject).key;
            let lowerCaseProject = project.name.toLowerCase()

            // put projects in org
            updates[`/${Constants.PROJECT_NAMES_BY_ORG_PATH}/${orgId}/${lowerCaseProject}/`] = Object.assign({}, {projectId: projectId}, {isPublic: true})

            // add the project to the creators Project List
            updates[`/${Constants.PROJECTS_BY_USER_BY_ORG_PATH}/${auth}/${orgId}/${projectId}/`] = Object.assign({}, {isPublic: true});
            updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectId}/${auth}/`] = true
          })

          Firebase.database().ref().update(updates);

          dispatch({
            type: ActionTypes.ORG_CREATED,
            orgName: org.name,
            orgId: orgId,
            meta: {
              mixpanel: {
                event: 'Create new org',
                source: Constants.CREATE_ORG_PAGE,
                orgId: orgId
              }
            }
          })
        }
      })
    }
  }
}

export function loadOrgList(auth, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_added', snap => {
      Firebase.database().ref(Constants.ORGS_PATH + '/' + snap.key).once('value', orgSnap => {
        dispatch({
          type: ActionTypes.LIST_ADDED_ACTION,
          data: orgSnap.val(),
          id: snap.key,
          listType: Constants.ORG_LIST_TYPE,
          source: source
        })
      })
    })
    // Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_changed', snap => {
    //   dispatch({
    //     type: ActionTypes.LIST_CHANGED_ACTION,
    //     data: snap.val(),
    //     id: snap.key,
    //     listType: Constants.ORG_LIST_TYPE,
    //     source: source
    //   })
    // })
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_removed', snap => {
      dispatch({
        type: ActionTypes.LIST_REMOVED_ACTION,
        id: snap.key,
        listType: Constants.ORG_LIST_TYPE,
        source: source
      })
    })
  }
}

export function unloadOrgList(auth, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).off();

    dispatch ({
      type: ActionTypes.UNLOAD_ORG_LIST,
      source: source
    })
  }
}

export function notAnOrgUserError(source) {
  return dispatch => {
    dispatch({
      type: ActionTypes.NOT_AN_ORG_USER,
      source: source
    })
  }
}

export function loadOrg(auth, orgId, orgName, source) {
  return dispatch => {
    if (auth) {
      let lowercaseName = orgName.toLowerCase()

      Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + orgId).once('value', userSnap => {
        if (!userSnap.exists()) {
          dispatch({
            type: ActionTypes.NOT_AN_ORG_USER,
            source: source
          })
        }
        else {
          dispatch({
            type: ActionTypes.LOAD_ORG,
            orgId: orgId,
            orgName: lowercaseName,
            source: source
          })
        }
      })
    }
  }
}

export function unloadOrg(source) {
  return dispatch => {
    dispatch({
      type: ActionTypes.UNLOAD_ORG,
      source: source
    })
  }
}

export function loadOrgUser(auth, orgId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth).on('value', snap => {
      dispatch({
        type: ActionTypes.LOAD_ORG_USER,
        orgUser: snap.val(),
        source
      })
    })
  }
}

export function unloadOrgUser(auth, orgId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth).off()
    dispatch({
      type: ActionTypes.UNLOAD_ORG_USER,
      source
    })
  }
}

export function loadNewOrgUserInfo(userInfo, source) {
  return dispatch => {
    // Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', snap => {
      // if (snap.exists()) {
        dispatch(Object.assign({}, 
          { type: ActionTypes.LOAD_NEW_ORG_USER_INFO },
          { source: source },
          userInfo))
      // }
    // })
  }
}