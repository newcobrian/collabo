import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit, debounce } from 'lodash'

export function onCreateOrg(auth, org, userData, imageFile) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else if (org) {
      let lowercaseURL = org.url.toLowerCase()
      Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowercaseURL).once('value', nameSnapshot => {
        if (nameSnapshot.exists() || Constants.INVALID_ORG_NAMES.indexOf(lowercaseURL) > -1) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'An organization with the url "' + org.url + '" already exists. Please choose another URL',
            source: Constants.CREATE_ORG_PAGE
          })
        }
        else {
          let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
          Object.assign(org, { lastModified: serverTimestamp }, { primaryOwner: auth })
          let updates = {};

          let orgId = Firebase.database().ref(Constants.ORGS_PATH).push(org).key;

          updates[`/${Constants.ORGS_BY_URL_PATH}/${lowercaseURL}/`] = Object.assign({}, {orgId: orgId}, omit(org, ['url']));
          updates[`/${Constants.ORGS_BY_NAME_PATH}/${lowercaseURL}/`] = Object.assign({}, {orgId: orgId}, omit(org, ['name']));
          updates[`/${Constants.ORGS_BY_USER_PATH}/${auth}/${orgId}/`] = true;

          // save to usernames by org
          updates[`/${Constants.USERNAMES_BY_ORG_PATH}/${orgId}/${userData.username.toLowerCase()}/`] = auth

          // save user's last username to users-path
          updates[`/${Constants.USERS_PATH}/${auth}/username`] = userData.username

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
            updates[`/${Constants.PROJECT_NAMES_BY_ORG_PATH}/${orgId}/${lowerCaseProject}/`] = projectId
            updates[`/${Constants.PROJECTS_BY_ORG_PATH}/${orgId}/${projectId}/`] = Object.assign({}, {name: project.name}, {isPublic: true})

            // add the project to the creators Project List
            updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${orgId}/${auth}/${projectId}/`] = Object.assign({}, {isPublic: true});
            updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectId}/${auth}/`] = Constants.PRIMARY_OWNER_ROLE
          })

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

              userData.image = downloadURL

              // save the user's username, etc to users-by-org
              updates[`/${Constants.USERS_BY_ORG_PATH}/${orgId}/${auth}/`] = 
                Object.assign({}, userData, {role: Constants.PRIMARY_OWNER_ROLE}, {status: Constants.ACTIVE_STATUS})

              // save pic to global user table
              updates[`/${Constants.USERS_PATH}/${auth}/image`] = downloadURL


              Firebase.database().ref().update(updates);

              dispatch({
                type: ActionTypes.ORG_CREATED,
                org: Object.assign({}, org, {id: orgId}),
                meta: {
                  mixpanel: {
                    event: 'Create new org',
                    source: Constants.CREATE_ORG_PAGE,
                    orgId: orgId
                  }
                }
              })
            })
          }
          else {
            // no image, just save the user
            updates[`/${Constants.USERS_BY_ORG_PATH}/${orgId}/${auth}/`] = 
              Object.assign({}, userData, {role: Constants.OWNER_ROLE})

            Firebase.database().ref().update(updates);

            dispatch({
              type: ActionTypes.ORG_CREATED,
              org: Object.assign({}, org, {id: orgId}),
              meta: {
                mixpanel: {
                  event: 'Create new org',
                  source: Constants.CREATE_ORG_PAGE,
                  orgId: orgId
                }
              }
            })
          }
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

export function loadOrg(auth, orgId, orgURL, orgName, source) {
  return dispatch => {
    if (auth) {
      let lowercaseOrgURL = orgURL ? orgURL.toLowerCase() : ''
      Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + orgId).on('value', userSnap => {
        if (!userSnap.exists()) {
          dispatch({
            type: ActionTypes.NOT_AN_ORG_USER,
            source: source
          })
        }
        else {
          dispatch({
            type: ActionTypes.LOAD_ORG,
            org: Object.assign({}, {id: orgId}, {name: orgName}, {url: lowercaseOrgURL}),
            source: source
          })
        }
      })
    }
  }
}

export function unloadOrg(auth, orgId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + orgId).off()

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

export function loadNewOrgUserInfo(auth, source) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', snap => {
      if (snap.exists()) {
        dispatch(Object.assign({}, 
          { type: ActionTypes.LOAD_NEW_ORG_USER_INFO },
          { source: source },
          snap.val()))
      }
    })
  }
}

export function changeUserRole(auth, orgId, user, role) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth).once('value', authSnap => {
      Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + user.id).once('value', userSnap => {
        // auth can edit other users if:
        // 1) auth is at least an admin, they aren't looking at themselves, teammate is not a primary owner
        // 2) AND either: auth is a higher level than teammate and at least an admin
        // 3) OR they are both owners
        if (authSnap.exists() && userSnap.exists() && auth !== user.userId && user.role !== Constants.PRIMARY_OWNER_ROLE) {
          if (!userSnap.val().role || 
            (authSnap.val().role < userSnap.val().role && authSnap.val().role <= Constants.ADMIN_ROLE) || 
            ((authSnap.val().role == Constants.OWNER_ROLE || authSnap.val().role == Constants.ADMIN_ROLE) && authSnap.val().role == userSnap.val().role)) {
            let updates = {}
            updates[Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + user.id + '/role'] = role

            Firebase.database().ref().update(updates)

            dispatch({
              type: ActionTypes.USER_ROLE_UPDATED,
              message: user.username + '\'s role changed to ' + Constants.USER_ROLES_MAP[role]
            })
          }
        }
      })
    })
  }
}

export function changeUserStatus(auth, orgId, user, status) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth).once('value', authSnap => {
      Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + user.id).once('value', userSnap => {
        // Firebase.database().ref(Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + orgId + '/' + user.id).once('value', projectsSnap => {
          // auth can edit other users if:
          // 1) auth is at least an admin, they aren't looking at themselves, teammate is not a primary owner
          // 2) AND either: auth is a higher level than teammate and at least an admin
          // 3) OR they are both owners
          if (authSnap.exists() && userSnap.exists() && auth !== user.userId && user.role !== Constants.PRIMARY_OWNER_ROLE) {
            if (!userSnap.val().status || 
              (authSnap.val().role < userSnap.val().role && authSnap.val().role <= Constants.ADMIN_ROLE) || 
              ((authSnap.val().role == Constants.OWNER_ROLE || authSnap.val().role == Constants.ADMIN_ROLE) && authSnap.val().role == userSnap.val().role)) {
              let updates = {}
              updates[Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + user.id + '/status'] = status

              if (status === Constants.DEACTIVE_STATUS) {
                // users-by-email-time-by-org
                if (userSnap.val().emailDigestHour) {
                  updates[Constants.USERS_BY_EMAIL_TIME_BY_ORG_PATH + '/' + userSnap.val().emailDigestHour + '/' + orgId + '/' + user.id] = null
                }

                // projects-by-org-by-user
                // updates[Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + orgId + '/' + user.id] = null

                // users-by-project
                // if (projectsSnap.exists()) {
                //   projectsSnap.forEach(function(project) {
                //     updates[Constants.USERS_BY_PROJECT_PATH + '/' + project.key + '/' + user.id] = null
                //   })
                // }

                // orgs-by-user
                updates[Constants.ORGS_BY_USER_PATH + '/' + user.id + '/' + orgId] = null

                // usernames-by-org
                // let lowercaseName = user.username ? user.username.toLowerCase() : ''
                // updates[Constants.USERNAMES_BY_ORG_PATH + '/' + orgId + '/' + lowercaseName] = null
              }
              else if (status === Constants.ACTIVE_STATUS) {
                if (userSnap.val().emailDigestHour) {
                  updates[Constants.USERS_BY_EMAIL_TIME_BY_ORG_PATH + '/' + userSnap.val().emailDigestHour + '/' + orgId + '/' + user.id] = true
                }
              }

              Firebase.database().ref().update(updates)

              dispatch({
                type: ActionTypes.USER_STATUS_UPDATED,
                message: user.username + '\'s status changed to ' + status
              })
            }
          }
        // })
      })
    })
  }
}