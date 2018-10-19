import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit, debounce } from 'lodash'

export function inviteUsersToOrg(auth, orgName, invites) {
  return dispatch => {
    let updates = {}
    let lowercaseOrgName = orgName ? orgName.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowercaseOrgName).once('value', orgSnap => {
      let orgId = orgSnap.val().orgId
      
      Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', authSnap => {
        Firebase.database().ref(Constants.USERS_BY_EMAIL_PATH).once('value', emailHashSnap => {
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).once('value', usersByOrgSnap => {
            let emailArray = invites.match(/([a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

            let emailSeen = {}
            emailSeen[authSnap.val().email] = true
            let invitesSent = 0

            emailArray.forEach(function(email) {
              let cleanedEmail = Helpers.cleanEmailToFirebase(email)
              // check that this user isn't already on the team
              if (!emailSeen[email] && 
                !(usersByOrgSnap.exists() && emailHashSnap.exists() && emailHashSnap.val()[cleanedEmail] &&
                  emailHashSnap.val()[cleanedEmail].userId &&
                  usersByOrgSnap.val()[emailHashSnap.val()[cleanedEmail].userId])) {
                let inviteObject = {
                    senderId: auth,
                    recipientEmail: email,
                    timestamp: Firebase.database.ServerValue.TIMESTAMP,
                    orgId: orgId,
                    orgName: orgName
                  }

                // if email address already belongs to a user
                if (emailHashSnap.val()[cleanedEmail]) {
                  inviteObject.recipientId = emailHashSnap.val()[cleanedEmail].userId;
                  
                  let inviteId = Firebase.database().ref(Constants.INVITES_PATH).push(inviteObject).key

                   // just send an invite to the user
                  Helpers.sendCollaboInboxMessage(auth, emailHashSnap.val()[cleanedEmail].userId, Constants.ORG_INVITE_MESSAGE, 
                      Object.assign({}, {name: orgName}, {orgId: orgId}), null, null, inviteId);

                  // add to invited list for the org
                  // updates[Constants.INVITES_BY_ORG_PATH + '/' + orgId + '/users/' + emailHashSnap.val()[cleanedEmail].userId + '/' + inviteId] = true;
                }
                else {
                  let inviteId = Firebase.database().ref(Constants.INVITES_PATH).push(inviteObject).key

                  // otherwise add invite for this email address and send it
                  // let nonAppInvite = Object.assign({}, { senderId: auth }, { senderName: authSnap.val().username })
                  // updates[Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail + '/' + orgId + '/' + inviteId] = auth
                  updates[Constants.INVITED_USERS_BY_ORG_PATH + '/' + orgId + '/' + cleanedEmail] = 
                    Object.assign({}, 
                      { senderId: auth }, 
                      { senderUsername:  authSnap.val().username },
                      { timestamp: Firebase.database.ServerValue.TIMESTAMP })

                  // add to invited list for the org
                  // updates[Constants.INVITES_BY_ORG_PATH + '/' + orgId + '/emails/' + cleanedEmail + '/' + inviteId] = true

                  // send the email
                  Helpers.sendInviteEmail(auth, email, orgName, inviteId);
                }

                // save to seen emails so we don't duplicate
                emailSeen[email] = true;
                invitesSent++
              }
            })

            Firebase.database().ref().update(updates);

            dispatch({
              type: ActionTypes.USERS_INVITED_TO_ORG,
              orgName: orgName,
              invitesSent: invitesSent,
              meta: {
                mixpanel: {
                  event: 'Invite to org',
                  source: Constants.ORG_INVITE_PAGE,
                  orgId: orgSnap.val().orgId,
                  numInvites: invitesSent
                }
              }
            })
          })
        })
      })
    })
  }
}

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

export function loadOrganizationList(auth) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('value', snap => {
      let orgList = []
      snap.forEach(function(orgItem) {
        orgList = orgList.concat(Object.assign({}, orgItem.val(), { orgId: orgItem.key }))
      })

      dispatch({
        type: ActionTypes.LOAD_ORGANIZATION_LIST,
        orgList: orgList
      })
    })
  }
}

export function unloadOrganizationList(auth) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).off();
  }
}

export function loadOrg(auth, org, source) {
  return dispatch => {
    if (auth) {
      let lowercaseName = org.toLowerCase()
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowercaseName).once('value', orgSnap => {
        if (orgSnap.exists()) {
          Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + orgSnap.val().orgId).once('value', userSnap => {
            if (!userSnap.exists()) {
              dispatch({
                type: ActionTypes.NOT_AN_ORG_USER,
                source: source
              })
            }
            else {
              dispatch({
                type: ActionTypes.LOAD_ORG,
                orgId: orgSnap.val().orgId,
                orgName: lowercaseName,
                source: source
              })
            }
          })
        }
        else {
          dispatch({
            type: ActionTypes.NOT_AN_ORG_USER,
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

export function acceptOrgInvite(auth, email, inviteId, userData) {
  return dispatch => {
    Firebase.database().ref(Constants.INVITES_PATH + '/' + inviteId).once('value', inviteSnap => {
      if (!inviteSnap.exists()) {
        dispatch({
          type: ActionTypes.ACCEPT_INVITE_ERROR,
          message: 'Sorry, this invite was not found'
        })
      }
      else if (email !== inviteSnap.val().recipientEmail) {
        dispatch({
          type: ActionTypes.ACCEPT_INVITE_ERROR,
          message: 'Sorry, this invite was not sent to your email address'
        })
      }
      else {
        let lowerCaseName = userData && userData.username ? userData.username.toLowerCase() : ''
        Firebase.database().ref(Constants.USERNAMES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + lowerCaseName).once('value', usernameSnap => {
          if (usernameSnap.exists()) {
            dispatch({
              type: ActionTypes.CREATE_SUBMIT_ERROR,
              source: Constants.ACCEPT_INVITE_PAGE,
              error: 'The username \'' + userData.username + '\' is already taken. Please choose another username'
            })
          }
          else {
            Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', userSnap => {
              Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + inviteSnap.val().orgId).once('value', projectNamesSnap => {
                let cleanedEmail = Helpers.cleanEmailToFirebase(email)
            
                let updates = {}
                // add user to the org and orgs-by-user
                // updates[Constants.USERS_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + auth] = Object.assign({}, userSnap.val())
                updates[Constants.USERS_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + auth] = 
                  Object.assign({}, userData, {role: Constants.USER_ROLE})
                updates[Constants.USERNAMES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + lowerCaseName] = auth
                updates[Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + inviteSnap.val().orgId] = true

                // remove the invites
                updates[Constants.INVITES_PATH + '/' + inviteId + '/status/'] = Constants.ACCEPTED_STATUS
                updates[Constants.INVITED_USERS_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + Helpers.cleanEmailToFirebase(email)] = null

                // remove the inbox item?
                // updates[Constants.INVITES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/users/' + auth] = null
                // updates[Constants.INVITES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/emails/' + email] = null

                // add all public projects for the user
                projectNamesSnap.forEach(function(projectItem) {
                  if (projectItem.val().isPublic) {
                    updates[`/${Constants.PROJECTS_BY_USER_BY_ORG_PATH}/${auth}/${inviteSnap.val().orgId}/${projectItem.val().projectId}/`] = Object.assign({}, {isPublic: projectItem.val().isPublic});
                    updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectItem.val().projectId}/${auth}/`] = true
                  }
                })

                Firebase.database().ref().update(updates)

                dispatch({
                  type: ActionTypes.ORG_INVITE_ACCEPTED,
                  orgName: inviteSnap.val().orgName,
                  meta: {
                    mixpanel: {
                      event: 'Org invite accepted',
                      orgId: inviteSnap.val().orgId,
                      senderId: inviteSnap.val().senderId
                    }
                  }
                })
              })
            })
          }
        })
      }
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