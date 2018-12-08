import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'
import { pick, omit, debounce } from 'lodash'

export function loadProjectInvite(auth, inviteId) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECT_INVITES_PATH + '/' + inviteId).on('value', projectInviteSnap => {
      if (!projectInviteSnap.exists()) {
        dispatch({
          type: ActionTypes.LOAD_INVITE_ERROR,
          errorMessage: "Sorry, we couldn't find this invite"
        })
      }
      else if (projectInviteSnap.val().status === Constants.ACCEPTED_STATUS) {
        dispatch({
          type: ActionTypes.LOAD_INVITE_ERROR,
          errorMessage: "Sorry, this invite has already been accepted"
        })
      }
      else {
        if (auth === projectInviteSnap.val().recipientId) {
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + projectInviteSnap.val().orgId).once('value', usersByOrgSnap => {
            if (!usersByOrgSnap.exists()) {
              // if user isnt in org, tell them they must join first
              // v2 - let user ask for invite
              dispatch({
                type: ActionTypes.LOAD_INVITE_ERROR,
                errorMessage: "Sorry, you need to be a team member to join this list."
              })
            }
            else {
              /// add user to project
              Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectInviteSnap.val().projectId).once('value', projectSnap => {
                Firebase.database().ref(Constants.ORGS_PATH + '/' + projectInviteSnap.val().orgId).once('value', orgSnap => {
                  let updates = {}
                  updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${projectInviteSnap.val().orgId}/${auth}/${projectInviteSnap.val().projectId}/`] = Object.assign({}, pick(projectSnap.val(), ['name', 'isPublic']));
                  updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectInviteSnap.val().projectId}/${auth}/`] = true

                  // also remove them from pending invites list
                  updates[`/${Constants.INVITED_USERS_BY_PROJECT_PATH}/${projectInviteSnap.val().projectId}/${auth}/`] = null

                  // mark invite as accepted
                  updates[`/${Constants.PROJECT_INVITES_PATH}/${inviteId}/status/`] = Constants.ACCEPTED_STATUS
                  
                  Firebase.database().ref().update(updates)

                  let org = Object.assign({}, {id: projectInviteSnap.val().orgId}, orgSnap.val())
                  let project = Object.assign({}, {projectId: projectInviteSnap.val().projectId}, projectSnap.val())
                  Helpers.sendCollaboInboxMessage(auth, projectInviteSnap.val().senderId, Constants.ACCEPT_PROJECT_INVITE_MESSAGE, org, project, null, null)

                  dispatch({
                    type: ActionTypes.PROJECT_INVITE_ACCEPTED,
                    orgURL: orgSnap.val().url,
                    projectId: projectInviteSnap.val().projectId
                  })
                })
              })
            }
          })
        }
        else {
          // otherwise this invite was for a different user
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + projectInviteSnap.val().orgId + '/' + projectInviteSnap.val().senderId).once('value', senderSnap => {
            dispatch({
              type: ActionTypes.INVITE_LOADED,
              invite: projectInviteSnap.val(),
              sender: senderSnap.val(),
              inviteType: Constants.PROJECT_TYPE
            })
          })
        }
      }
    })
  }
}

export function unloadProjectInvite(inviteId) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECT_INVITES_PATH + '/' + inviteId).off()
  }
}

export function loadOrgInvite(auth, inviteId) {
  return dispatch => {
    Firebase.database().ref(Constants.INVITES_PATH + '/' + inviteId).on('value', orgInviteSnap => {
      if (!orgInviteSnap.exists()) {
        dispatch({
          type: ActionTypes.LOAD_INVITE_ERROR,
          errorMessage: "Sorry, we couldn't find this invite"
        })
      }
      else if (orgInviteSnap.val().status === Constants.ACCEPTED_STATUS) {
        dispatch({
          type: ActionTypes.LOAD_INVITE_ERROR,
          errorMessage: "Sorry, this invite has already been accepted"
        })
      }
      else {
        let cleanedEmail = Helpers.cleanEmailToFirebase(orgInviteSnap.val().recipientEmail)
        Firebase.database().ref(Constants.ORGS_PATH + '/' + orgInviteSnap.val().orgId).once('value', orgSnap => {
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgInviteSnap.val().orgId + '/' + orgInviteSnap.val().senderId).once('value', senderSnap => {
            Firebase.database().ref(Constants.USERS_BY_EMAIL_PATH + '/' + cleanedEmail).once('value', emailSnap => {
              dispatch({
                type: ActionTypes.INVITE_LOADED,
                invite: Object.assign({}, orgInviteSnap.val(), { orgName: orgSnap.val().name }),
                sender: senderSnap.val(),
                inviteType: Constants.ORG_TYPE,
                emailRegistered: emailSnap.exists()
              })
            })
          })
        })
      }
    })
  }
}

export function unloadOrgInvite(inviteId) {
  return dispatch => {
    Firebase.database().ref(Constants.INVITES_PATH + '/' + inviteId).off();
  }
}

export function inviteUsersToOrg(auth, org, invites, role, projects) {
  return dispatch => {
    let updates = {}
    let lowerCaseOrgURL = org.url ? org.url.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
      let orgId = orgSnap.val().orgId
      
      Firebase.database().ref(Constants.USERS_BY_EMAIL_PATH).once('value', emailHashSnap => {
        Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).once('value', usersByOrgSnap => {
          let emailArray = invites.match(/([a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

          let authUser = usersByOrgSnap.val()[auth]
          let emailSeen = {}
          emailSeen[authUser.email] = true
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
                  orgId: org.id,
                  orgName: org.name,
                  orgURL: org.url,
                  role: role,
                  projects: projects
                }

              // if email address already belongs to a user
              if (emailHashSnap.val()[cleanedEmail]) {
                inviteObject.recipientId = emailHashSnap.val()[cleanedEmail].userId;
                
                let inviteId = Firebase.database().ref(Constants.INVITES_PATH).push(inviteObject).key

                 // just send an invite to the user
                Helpers.sendCollaboInboxMessage(auth, emailHashSnap.val()[cleanedEmail].userId, Constants.ORG_INVITE_MESSAGE, 
                    org, null, null, inviteId);

                // add to pending invites list
                updates[Constants.INVITED_USERS_BY_ORG_PATH + '/' + orgId + '/' + cleanedEmail] = 
                  Object.assign({}, 
                    { senderId: auth }, 
                    { senderUsername:  authUser.username },
                    { timestamp: Firebase.database.ServerValue.TIMESTAMP })

                // add to users invites
                updates[Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail + '/' + orgId + '/' + inviteId] = omit(inviteObject, ['recipientEmail'])
              }
              else {
                let inviteId = Firebase.database().ref(Constants.INVITES_PATH).push(inviteObject).key

                // otherwise add invite for this email address and send it
                // let nonAppInvite = Object.assign({}, { senderId: auth }, { senderName: authSnap.val().username })
                // updates[Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail + '/' + orgId + '/' + inviteId] = auth
                updates[Constants.INVITED_USERS_BY_ORG_PATH + '/' + orgId + '/' + cleanedEmail] = 
                  Object.assign({}, 
                    { senderId: auth }, 
                    { senderUsername:  authUser.username },
                    { timestamp: Firebase.database.ServerValue.TIMESTAMP })

                // add to users invites
                updates[Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail + '/' + orgId + '/' + inviteId] = omit(inviteObject, ['recipientEmail'])
                
                // send the email
                Helpers.sendInviteEmail(auth, email, org, inviteId);
              }

              // save to seen emails so we don't duplicate
              emailSeen[email] = true;
              invitesSent++
            }
          })

          Firebase.database().ref().update(updates);

          dispatch({
            type: ActionTypes.USERS_INVITED_TO_ORG,
            orgURL: org.url,
            orgName: org.name,
            invitesSent: invitesSent,
            meta: {
              mixpanel: {
                event: 'Invite to org',
                source: Constants.ORG_INVITE_MODAL,
                orgId: orgSnap.val().orgId,
                numInvites: invitesSent
              }
            }
          })
        })
      })
    })
  }
}

export function inviteOrgUsersToProject(auth, org, project, invites) {
  return dispatch => {
    if (invites && invites.length > 0) {
      Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + org.id).once('value', orgUsersSnap => {
        Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + project.projectId).once('value', projectUsersSnap => {
          let orgUsers = orgUsersSnap.val()
          let projectUsers = projectUsersSnap.val()
          let updates = {}
          let sendList = []
          for (let i = 0; i < invites.length; i++) {
            // if user is an org member but not in the project, invite them
            if ((orgUsers && orgUsers[invites[i]]) && (!projectUsers || !projectUsers[invites[i]])) {
              // create the project invite
              let inviteObject = {
                senderId: auth,
                recipientId: invites[i],
                timestamp: Firebase.database.ServerValue.TIMESTAMP,
                orgId: org.id,
                projectId: project.projectId
              }

              let inviteId = Firebase.database().ref(Constants.PROJECT_INVITES_PATH).push(inviteObject).key

              // add to project invites by user
              updates[Constants.PROJECT_INVITES_BY_USER_PATH + '/' + invites[i] + '/' + inviteId] = 
                Object.assign({}, omit(inviteObject, ['recipientId']))

              // add to pending invite list for the project
              updates[Constants.INVITED_USERS_BY_PROJECT_PATH + '/' + project.projectId + '/' + invites[i]] = 
                Object.assign({}, 
                  { senderId: auth }, 
                  { senderUsername:  orgUsersSnap.val()[auth] ? orgUsersSnap.val()[auth].username : '' },
                  { timestamp: Firebase.database.ServerValue.TIMESTAMP })

              sendList = sendList.concat(Object.assign({}, {recipientId: invites[i]}, {inviteId: inviteId}));
            }
          }
          Firebase.database().ref().update(updates)

          // send invites to users
          for (let i = 0; i < sendList.length; i++) {
            Helpers.sendCollaboInboxMessage(auth, sendList[i].recipientId, Constants.PROJECT_INVITE_MESSAGE, org, project, null, sendList[i].inviteId)
          }

          dispatch({
            type: ActionTypes.INVITED_USERS_TO_PROJECT,
            projectId: project.projectId,
            meta: {
              mixpanel: {
                event: 'Invite users to project',
                projectId: project.projectId,
                orgId: org.id,
                numInvites: sendList.length
              }
            }
          })
        })
      })
    }
  }
}

export function showProjectInviteModal(projectId, project, org, orgMembers) {
  return dispatch => {
    if (projectId && org) {
      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).once('value', projectSnap => {
      //   Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).once('value', orgSnap => {
          // let usersList = []
          // orgSnap.forEach(function(user) {
          //   usersList = usersList.concat(Object.assign({}, { userId: user.key }, user.val()))
          // })
          // usersList.sort(Helpers.byUsername)

          dispatch({
            type: ActionTypes.SHOW_PROJECT_INVITE_MODAL,
            projectMemberCheck: projectSnap.val(),
            project: project,
            projectId: projectId,
            usersList: orgMembers,
            org: org
          })  
      //   })
      })
    }
  }
}

export function showOrgInviteModal(org) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SHOW_ORG_INVITE_MODAL,
      org
    })
  }
}

export function enterEmail(email) {
  return dispatch => {
    let cleanedEmail = Helpers.cleanEmailToFirebase(email)
    Firebase.database().ref(Constants.USERS_BY_EMAIL_PATH + '/' + cleanedEmail).once('value', snap => {
      // if email address already belongs to a user tell them
      if (snap.exists()) {
        dispatch({
          type: ActionTypes.EMAIL_ADDRESS_TAKEN
        })
      }
      else {
        Firebase.database().ref(Constants.VERIFICATION_BY_EMAIL_PATH + '/' + cleanedEmail).once('value', emailSnap => {
          let updates = {}
          let verifyObject = {
            email: email,
            timeSent: Firebase.database.ServerValue.TIMESTAMP
          }

          let verifyId = Firebase.database().ref(Constants.EMAIL_VERIFICATION_PATH).push(verifyObject).key

          // if we already sent the user a code, clear out the old one
          if (emailSnap.exists()) {
            updates[Constants.EMAIL_VERIFICATION_PATH + '/' + emailSnap.val().verifyId] = null
          }
          
          // save new verification code in verification-by-email
          updates[Constants.VERIFICATION_BY_EMAIL_PATH + '/' + cleanedEmail] = Object.assign({}, omit(verifyObject, ['email']), {verifyId: verifyId})

          Firebase.database().ref().update(updates)

          // send verification email
          Helpers.sendVerifyEmail(email, verifyId);

          dispatch({
            type: ActionTypes.EMAIL_VERIFICATION_SENT
          })
        })
      }
    })
  }
}

export function acceptOrgInvite(auth, email, inviteId, userData, imageFile) {
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
          type: ActionTypes.WRONG_EMAIL_ORG_INVITE,
          invite: inviteSnap.val()
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
            Helpers.addUserToOrg(auth, email, inviteSnap.val(), inviteId, userData, imageFile);

            Firebase.database().ref(Constants.ORGS_PATH + '/' + inviteSnap.val().orgId).once('value', orgSnap => {
              Helpers.sendCollaboInboxMessage(auth, inviteSnap.val().senderId, Constants.ACCEPT_ORG_INVITE_MESSAGE, orgSnap.val(), null, null, null)

              dispatch({
                type: ActionTypes.ORG_INVITE_ACCEPTED,
                orgName: inviteSnap.val().orgName,
                orgURL: orgSnap.val().url,
                meta: {
                  mixpanel: {
                    event: 'Org invite accepted',
                    orgId: inviteSnap.val().orgId,
                    senderId: inviteSnap.val().senderId
                  }
                }
              })
            })
          }
        })
      }
    })
  }
}

export function loadEmailCode(verifyId) {
	return dispatch => {
		Firebase.database().ref(Constants.EMAIL_VERIFICATION_PATH + '/' + verifyId).once('value', snap => {
			if (snap.exists()) {
				dispatch({
					type: ActionTypes.EMAIL_CODE_LOADED,
					email: snap.val().email,
					timeSent: snap.val().timeSent
				})
			}
			else {
				dispatch({
					type: ActionTypes.EMAIL_CODE_NOT_FOUND
				})
			}
		})
	}
}

export function onRegisterWithEmailClick(email) {
  return dispatch => {
    let cleanedEmail = Helpers.cleanEmailToFirebase(email)
    Firebase.database().ref(Constants.USERS_BY_EMAIL_PATH + '/' + cleanedEmail).once('value', userSnap => {
      if (userSnap.exists()) {
        dispatch({
          type: ActionTypes.EMAIL_ADDRESS_TAKEN
        })
      }
      else {
        Firebase.database().ref(Constants.VERIFICATION_BY_EMAIL_PATH + '/' + cleanedEmail).once('value', emailSnap => {
          let updates = {}
          let verifyObject = {
            email: email,
            timeSent: Firebase.database.ServerValue.TIMESTAMP
          }

          let verifyId = Firebase.database().ref(Constants.EMAIL_VERIFICATION_PATH).push(verifyObject).key

          // if we already sent the user a code, clear out the old one
          if (emailSnap.exists()) {
            updates[Constants.EMAIL_VERIFICATION_PATH + '/' + emailSnap.val().verifyId] = null
          }
          
          // save new verification code in verification-by-email
          updates[Constants.VERIFICATION_BY_EMAIL_PATH + '/' + cleanedEmail] = Object.assign({}, omit(verifyObject, ['email']), {verifyId: verifyId})

          Firebase.database().ref().update(updates)

          dispatch({
            type: ActionTypes.LOAD_REGISTER_WITH_EMAIL,
            verifyId: verifyId
          })
        })
      }
    })
  }
}

export function pickGuestProjects() {
  return dispatch => {
    dispatch({
      type: ActionTypes.INVITE_GUEST_PROJECTS
    })
  }
}