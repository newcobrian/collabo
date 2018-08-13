import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import { watchUser, unwatchUser, findCommentMentions } from './index'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit, debounce } from 'lodash'

export function onAddProject(auth, project, orgName) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else {
      let projectName = project.name;
      Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + orgName + '/' + projectName.toLowerCase()).once('value', nameSnapshot => {
        if (nameSnapshot.exists()) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'A project called "' + project.name + '" already exists. Please choose another name',
            source: Constants.ADD_PROJECT_PAGE
          })
        }
        else {
          Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
            let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
            let projectObject = {
              lastModified: serverTimestamp,
              createdOn: serverTimestamp,
              orgName: orgName,
              orgId: orgSnap.val().orgId
            }
            let updates = {};
            Object.assign(projectObject, project)

            let projectId = Firebase.database().ref(Constants.PROJECTS_PATH).push(projectObject).key;

            updates[`/${Constants.PROJECT_NAMES_BY_ORG_PATH}/${orgName}/${projectName.toLowerCase()}/`] = projectId;
            // updates[`/${Constants.PROJECTS_BY_USER_PATH}/${auth}/${projectId}/`] = { name: project.name };

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
              orgName: orgName
              // meta: {
              //   mixpanel: {
              //     event: 'Itinerary created',
              //     source: 'create page',
              //     itineraryId: itineraryId,
              //     geo: itinerary.geo.placeId
              //   }
              // }
            })
          })
        }
      })
    }
  }
}

export function onAddThread(auth, projectId, thread, orgName) {
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
            orgId: projectSnapshot.val().orgId,
            userId: auth,
            projectId: projectId,
            lastUpdate: Constants.NEW_THREAD_TYPE
          }
          let updates = {};
          Object.assign(threadObject, thread)

          let threadId = Firebase.database().ref(Constants.THREADS_PATH).push(threadObject).key;

          updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${projectId}/${threadId}/`] = omit(threadObject, ['projectId']);
          updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${auth}/${projectSnapshot.val().orgId}/${threadId}/`] = omit(threadObject, ['userId'], ['orgId']);
          updates[`/${Constants.THREADS_BY_ORG_PATH}/${projectSnapshot.val().orgId}/${threadId}/`] = omit(threadObject, ['orgId']);

          // also update user's activity feed
          let activityObject = Object.assign({}, omit(threadObject, ['userId'], ['orgId']), { threadId: threadId }, { type: Constants.NEW_THREAD_TYPE })
          Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + projectSnapshot.val().orgId).push(activityObject)

          Firebase.database().ref().update(updates);

          Helpers.incrementThreadSeenCounts(auth, projectSnapshot.val().orgId, projectId, threadId)

          let org = Object.assign({}, {name: orgName}, {orgId: projectSnapshot.val().orgId})
          let project = Object.assign({},  projectSnapshot.val(), {projectId: projectId})
          Helpers.findThreadMentions(auth, thread.body, org, project, Object.assign({}, thread, {threadId: threadId}))
          // Helpers.sendCollaboUpdateNotifs(auth, Constants.NEW_THREAD_MESSAGE, org ,project, Object.assign({}, thread, {threadId: threadId}, null))

          // // update Algolia index
          // Helpers.updateAlgloiaGeosIndex(itinerary.geo)

          // mixpanel.people.increment("total itineraries");
          // mixpanel.people.set({ "last itinerary created": (new Date()).toISOString() });
          // mixpanel.identify(auth);

          dispatch({
            type: ActionTypes.THREAD_CREATED,
            threadId: threadId,
            orgName: orgName,
            projectId: projectId
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

export function onDeleteThread(auth, threadId, thread, orgName) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else if (thread.userId !== auth) {
      dispatch({
        type: ActionTypes.NO_USER_PERMISSION
      })
    }
    else {
      Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + thread.orgId).once('value', orgSnap => {
        let updates = {}
        updates[`/${Constants.THREADS_PATH}/${threadId}/`] = null
        updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/`] = null
        updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${thread.userId}/${thread.orgId}/${threadId}/`] = null
        updates[`/${Constants.THREADS_BY_ORG_PATH}/${thread.orgId}/${threadId}/`] = null
      
        if (orgSnap.exists()) {
          orgSnap.forEach(function(user) {
            updates[Constants.THREAD_SEEN_COUNTERS_PATH + '/' + user.key + '/' + thread.orgId + '/' + thread.projectId + '/' + threadId] = null  
          })
        }

        Firebase.database().ref().update(updates);

        dispatch({
          type: ActionTypes.THREAD_DELETED,
          redirect: '/' + orgName + '/' + thread.projectId,
          message: 'Thread deleted'
          // meta: {
          //   mixpanel: {
          //     event: 'Itinerary created',
          //     source: 'create page',
          //     itineraryId: itineraryId,
          //     geo: itinerary.geo.placeId
          //   }
          // }
        })
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

// export function watchProjectThreads(projectId) {
//   return dispatch=> {
//     Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).orderByChild('lastModified').on('child_added', threadSnapshot => {
//       if (threadSnapshot.val().userId) {
//         // watchUser(dispatch, threadSnapshot.val().userId, Constants.PROJECTS_PAGE)
//         Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).once('value', userSnap => {
//           let thread = Object.assign({}, threadSnapshot.val(), {projectId: projectId})
//           dispatch(threadAddedAction(threadSnapshot.key, thread, userSnap.val()));   
//         })
//       }
//     })

//     // on child changed, how do we unwatch old refs?
//     Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).orderByChild('lastModified').on('child_changed', threadSnapshot => {
//       if (threadSnapshot.val().userId) {
//         // watchUser(dispatch, threadSnapshot.val().userId, Constants.PROJECTS_PAGE)
//         Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).once('value', userSnap => {
//           let thread = Object.assign({}, threadSnapshot.val(), {projectId: projectId})
//           dispatch(threadChangedAction(threadSnapshot.key, thread, userSnap.val()));   
//         })
//       }
//     })

//     Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).orderByChild('lastModified').on('child_removed', threadSnapshot => {
//       dispatch(threadRemovedAction(threadSnapshot.key));
//     })
//   }
// }

function threadAddedAction(threadId, thread, user, source) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.THREAD_ADDED_ACTION,
    threadId,
    thread,
    user,
    source
  }
}

function threadChangedAction(threadId, thread, userId, source) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.THREAD_CHANGED_ACTION,
    threadId,
    thread,
    userId,
    source
  }
}

function threadRemovedAction(threadId, source) {
  return {
    type: ActionTypes.THREAD_REMOVED_ACTION,
    threadId,
    source
  }
}

// export function getProjectThreads(auth, projectId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).on('value', threadsSnapshot => {
//       let feedArray = [];
//       if (threadsSnapshot.exists()) {
//         threadsSnapshot.forEach(function(itin) {
//           Firebase.database().ref(Constants.USERS_PATH + '/' + itin.val().userId).on('value', userSnapshot => {
//             Firebase.database().ref(Constants.LIKES_BY_USER_PATH + '/' + auth + '/' + itin.key).on('value', likesSnapshot => {
//               const itineraryObject = {};
//               const key = { id: itin.key };
//               const createdBy = { createdBy: Object.assign({}, userSnapshot.val(), {userId: itin.val().userId}) };
//               let likes = {
//                 isLiked: likesSnapshot.exists()
//               }
              
//               Object.assign(itineraryObject, itin.val(), key, createdBy, likes);

//               feedArray = [itineraryObject].concat(feedArray);
//               feedArray.sort(Helpers.byPopularity);
//               dispatch({
//                 type: ActionTypes.GET_PLACES_FEED,
//                 payload: feedArray
//               })
//             })
//           })
//         })
//       }
//       else {
//         dispatch({
//           type: ActionTypes.GET_PLACES_FEED,
//           payload: []
//         })
//       }
//     })
//   }
// }

export function loadProjectList(auth, orgName, source) {
  let lowercaseName = orgName.toLowerCase()
  return dispatch => {
    // Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_added', snap => {
    Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + lowercaseName).on('child_added', snap => {
      dispatch({
        type: ActionTypes.LIST_ADDED_ACTION,
        id: snap.val(),
        name: snap.key,
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })

    // Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_changed', snap => {
    Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + lowercaseName).on('child_changed', snap => {
      dispatch({
        type: ActionTypes.LIST_CHANGED_ACTION,
        id: snap.val(),
        name: snap.key,
        listType: Constants.LIST_TYPE,
        source: source
      })
    })

    // Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_removed', snap => {
    Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + lowercaseName).on('child_removed', snap => {
      dispatch({
        type: ActionTypes.LIST_REMOVED_ACTION,
        id: snap.val(),
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })
  }
}

export function loadThreadCounts(auth, orgName) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
      Firebase.database().ref(Constants.THREAD_SEEN_COUNTERS_PATH + '/' + auth + '/' + orgSnap.val().orgId).on('value', countSnap => {
        let countObject = {}
        countSnap.forEach(function(project) {
          countObject[project.key] = project.numChildren()
        })

        dispatch({
          type: ActionTypes.THREAD_COUNTS_LOADED,
          threadCounts: countObject
        })
      })
    })
  }
}

export function unloadThreadCounts(auth, orgName) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
      Firebase.database().ref(Constants.THREAD_SEEN_COUNTERS_PATH + '/' + auth + '/' + orgSnap.val().orgId).off()

      dispatch({
        type: ActionTypes.THREAD_COUNTS_UNLOADED
      })
    })
  }
}

export function unloadProjectList(auth, orgName) {
  return dispatch => {
     Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + orgName).off();
     dispatch({
      type: ActionTypes.UNLOAD_PROJECT_LIST
     })
  }
}

export function loadThread(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId).on('value', threadSnapshot => {
      if (threadSnapshot.exists()) {
        Firebase.database().ref(Constants.PROJECTS_PATH + '/' + threadSnapshot.val().projectId).on('value', projectSnapshot => {
          Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).on('value', userSnapshot => {
            dispatch({
              type: ActionTypes.LOAD_THREAD,
              thread: threadSnapshot.val(),
              createdBy: userSnapshot.val(),
              project: Object.assign({}, projectSnapshot.val(), {projectId: threadSnapshot.val().projectId})
            })
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

export function changeEditorState(editorState) {
  return dispatch => {
    dispatch({
      type: ActionTypes.CHANGE_EDITOR_STATE,
      editorState: editorState
    })
  }
}

export function updateThreadField(auth, threadId, thread, orgName, field, value) {
  return dispatch => {
    if (thread && threadId && thread.userId && thread.orgId) {
      let updates = {}

      // update all thread tables
      updates[`/${Constants.THREADS_PATH}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${thread.userId}/${thread.orgId}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_ORG_PATH}/${thread.orgId}/${threadId}/${field}/`] = value

      // update lastModified timestamps
      let timestamp = Firebase.database.ServerValue.TIMESTAMP;
      updates[`/${Constants.THREADS_PATH}/${threadId}/lastModified/`] = timestamp
      updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/lastModified/`] = timestamp
      updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${thread.userId}/${thread.orgId}/${threadId}/lastModified/`] = timestamp

      // if body was updated, make this the lastUpdate
      if (field === 'body') {
        Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdate', Constants.EDIT_THREAD_TYPE));
      }

      Firebase.database().ref().update(updates);

      Helpers.incrementThreadSeenCounts(auth, thread.orgId, thread.projectId, threadId)

      if (field === 'body') {
        let org = Object.assign({}, {name: orgName})
        let project = Object.assign({}, {projectId: thread.projectId})
        Helpers.findThreadMentions(auth, value, org, project, Object.assign({}, thread, {threadId: threadId}))
      }

      dispatch({
        type: ActionTypes.THREAD_UPDATED,
        message: 'Your changes have been saved'
      })
    }
  }
}

function threadCommentAddedAction(threadId, commentId, comment) {
  return {
    type: ActionTypes.COMMENT_ADDED_ACTION,
    threadId,
    commentId,
    comment
  }
}

function threadCommentChangedAction(threadId, commentId, comment) {
  return {
    type: ActionTypes.COMMENT_CHANGED_ACTION,
    threadId,
    commentId,
    comment
  }
}

function threadCommentRemovedAction(threadId, commentId) {
  return {
    type: ActionTypes.COMMENT_REMOVED_ACTION,
    threadId,
    commentId
  }
}

export function watchThreadComments(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_added', commentSnap => {
      dispatch(threadCommentAddedAction(threadId, commentSnap.key, commentSnap.val()));
    })

    // Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_changed', commentSnap => {
    //   dispatch(threadCommentChangedAction(threadId, commentSnap.key, commentSnap.val()));
    // })

    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_removed', commentSnap => {
      dispatch(threadCommentRemovedAction(threadId, commentSnap.key));
    })
  }
}

export function unwatchThreadComments(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).off();
  }
}

export function getThreadFieldUpdates(threadId, thread, field, value) {
  let updates = {}
  updates[Constants.THREADS_PATH + '/' + threadId + '/' + field] = value
  updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/' + field] = value
  updates[Constants.THREADS_BY_USER_BY_ORG_PATH + '/' + thread.userId + '/' + thread.orgId + '/' + threadId + '/' + field] = value
  updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/' + field] = value

  return updates;
}

export function onThreadCommentSubmit(authenticated, userInfo, type, thread, body, threadId, project, orgName) {
  return dispatch => {
    if(!authenticated) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    const comment = {
      userId: authenticated,
      username: userInfo.username,
      body: body ? body : '',
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    }
    if (userInfo.image) comment.image = userInfo.image;

    if (threadId) {
      let org = Object.assign({}, {orgId: thread.orgId}, {name: orgName})
      let commentId = Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).push(comment).key;

      Helpers.incrementThreadCount(Constants.COMMENTS_COUNT, threadId, thread, thread.userId);
      
      let updates = getThreadFieldUpdates(threadId, thread, 'lastModified', Firebase.database.ServerValue.TIMESTAMP)
      // last update is a comment
      Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdate', Constants.COMMENT_TYPE));

      // update the last comment
      Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastComment', Object.assign({}, comment, { commentId: commentId })))

      Firebase.database().ref().update(updates);

      // also update user's activity feed
      let activityObject = Object.assign({}, pick(thread, ['title', 'projectId', 'createdOn']), pick(comment, ['body', 'lastModified']), { threadId: threadId }, { type: Constants.COMMENT_TYPE })
      Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + authenticated + '/' + thread.orgId).push(activityObject)

      Helpers.incrementThreadSeenCounts(authenticated, thread.orgId, thread.projectId, threadId)

      // send message to original review poster if they are not the commentor
      const sentArray = [];
      let threadObject = Object.assign({}, thread, { threadId: threadId })
      if (authenticated !== thread.userId) {
        Helpers.sendCollaboInboxMessage(authenticated, thread.userId, Constants.COMMENT_IN_THREAD_MESSAGE, 
          org, project, threadObject, Object.assign({commentId: commentId, message: body}));
        sentArray.push(thread.userId);
        // dispatch({
        //   type: MIXPANEL_EVENT,
        //   mixpanel: {
        //     event: SEND_INBOX_MESSAGE,
        //     props: {
        //       type: Constants.inboxMessageType
        //     }
        //   }
        // })
      }

      Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).once('value', commentsSnapshot => {
        commentsSnapshot.forEach(function(comment) {
          let commenterId = comment.val().userId;
          // if not commentor or in sent array, then send a message
          if (commenterId !== authenticated && (sentArray.indexOf(commenterId) === -1)) {
            Helpers.sendCollaboInboxMessage(authenticated, commenterId, Constants.COMMENT_IN_THREAD_MESSAGE, org, project, threadObject, Object.assign({}, {commentId: commentId}, {message: body}));
            sentArray.push(commenterId);
            // dispatch({
            //   type: MIXPANEL_EVENT,
            //   mixpanel: {
            //     event: SEND_INBOX_MESSAGE,
            //     props: {
            //       type: commentOnCommentType
            //     }
            //   }
            // })
          }
        })
      })

      // send inbox messages to any usernames mentioned in the comment
      findCommentMentions(dispatch, authenticated, body, org, project, threadObject, sentArray, commentId);

      // const mixpanelProps = ( (type === Constants.TIPS_TYPE ||  type === Constants.RECOMMENDATIONS_TYPE) ? {subjectId: commentObject.subjectId} : {itineraryId: commentObject.id});
      dispatch({
        type: ActionTypes.ADD_COMMENT,
        // meta: {
        //   mixpanel: {
        //     event: 'Comment added',
        //     dataType: type,
        //     props: mixpanelProps
        //   }
        // }
      })

      // mixpanel.people.increment("total comments");
      // mixpanel.people.set({ "last comment date": (new Date()).toISOString() });
      // mixpanel.identify(authenticated);
    }
  }
}

export function onDeleteThreadComment(thread, commentId, threadId) {
  return dispatch => {
    // delete the comment
    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId).remove().then(response => {

      Helpers.decrementThreadCount(Constants.COMMENTS_COUNT, threadId, thread, thread.userId);

      Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId).once('value', threadSnap => {
        if (threadSnap.exists() && threadSnap.val().lastComment && threadSnap.val().lastComment.commentId === commentId) {
          if (threadSnap.val().commentsCount >= 2) {
            Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).orderByKey().limitToLast(1).once('value', limitedSnap => {
              let saveObject = {};
              if (limitedSnap.exists()) {
                saveObject = Object.assign({}, limitedSnap.val(), { commentId: limitedSnap.key });
                let updates = getThreadFieldUpdates(threadId, thread, 'lastComment', saveObject)
                Firebase.database().ref().update(updates);
              }
            })
          }
          else {
            // only 1 comment so just remove lastComment
            let updates = getThreadFieldUpdates(threadId, thread, 'lastComment', null)
            Firebase.database().ref().update(updates);
          }
        }
      })

    // mixpanel.people.increment("total comments", -1);

      dispatch({
        type: ActionTypes.DELETE_COMMENT
      })
    })
  }
}

export function inviteUsersToOrg(auth, orgId, orgName, invites) {
  return dispatch => {
    let updates = {}
    Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', authSnap => {
      Firebase.database().ref(Constants.USERS_BY_EMAIL_PATH).once('value', emailHashSnap => {
        Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).once('value', usersByOrgSnap => {

          let emailArray = invites.match(/([a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

          let emailSeen = {}
          emailSeen[authSnap.val().email] = true

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
                updates[Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail + '/' + orgId + '/' + inviteId] = auth

                // add to invited list for the org
                // updates[Constants.INVITES_BY_ORG_PATH + '/' + orgId + '/emails/' + cleanedEmail + '/' + inviteId] = true

                // send the email
                Helpers.sendInviteEmail(auth, email, orgName, inviteId);
              }

              // save to seen emails so we don't duplicate
              emailSeen[email] = true;
            }
          })

          Firebase.database().ref().update(updates);

          dispatch({
            type: ActionTypes.USERS_INVITED_TO_ORG,
            orgName: orgName
            // meta: {
            //   mixpanel: {
            //     event: 'Itinerary created',
            //     source: 'create page',
            //     itineraryId: itineraryId,
            //     geo: itinerary.geo.placeId
            //   }
            // }
          })
        })
      })
    })
  }
}

export function onCreateOrg(auth, org) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else if (org) {
      let lowercaseName = org.name.toLowerCase()
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowercaseName).once('value', nameSnapshot => {
        if (nameSnapshot.exists()) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'An organization with the name "' + org.name + '" already exists. Please choose another name',
            source: Constants.CREATE_ORG_PAGE
          })
        }
        else {
          let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
          Object.assign(org, { lastModified: serverTimestamp })
          let updates = {};

          let orgId = Firebase.database().ref(Constants.ORGS_PATH).push(org).key;

          updates[`/${Constants.ORGS_BY_NAME_PATH}/${lowercaseName}/`] = Object.assign({}, {orgId: orgId}, omit(org, ['name']));
          updates[`/${Constants.ORGS_BY_USER_PATH}/${auth}/${orgId}/`] = { name: org.name };
          updates[`/${Constants.USERS_BY_ORG_PATH}/${orgId}/${auth}/`] = true

          Firebase.database().ref().update(updates);

          dispatch({
            type: ActionTypes.ORG_CREATED,
            orgName: org.name,
            orgId: orgId,
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

export function loadOrgInvitePage(auth, orgName) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).on('value', orgSnap => {
      dispatch({
        type: ActionTypes.ORG_INVITE_PAGE_LOADED,
        org: orgSnap.val()
      })
    })
  }
}

export function unloadOrgInvitePage(orgName) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).off();
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
              orgName: lowercaseName,
              orgId: orgSnap.val().orgId,
              source: source
            })
          }
        })
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

export function loadInvite(auth, inviteId) {
  return dispatch => {
    Firebase.database().ref(Constants.INVITES_PATH + '/' + inviteId).on('value', inviteSnap => {
      Firebase.database().ref(Constants.USERS_PATH + '/' + inviteSnap.val().senderId).once('value', senderSnap => {
        dispatch({
          type: ActionTypes.INVITE_LOADED,
          invite: inviteSnap.val(),
          sender: senderSnap.val()
        })
      })
    })
  }
}

export function unloadInvite(inviteId) {
  return dispatch => {
    Firebase.database().ref(Constants.INVITES_PATH + '/' + inviteId).off();
  }
}

export function acceptInvite(auth, email, inviteId) {
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
        let cleanedEmail = Helpers.cleanEmailToFirebase(email)
        // Firebase.database().ref(Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail).once('value', nonappInviteSnap => {
          let updates = {}
          // add user to the org and orgs-by-user
          updates[Constants.USERS_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + auth] = true
          updates[Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + inviteSnap.val().orgId] = { name: inviteSnap.val().orgName }

          // remove the invites
          updates[Constants.INVITES_PATH + '/' + inviteId + '/status/'] = Constants.ACCEPTED_STATUS
          // updates[Constants.INVITES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/users/' + auth] = null
          // updates[Constants.INVITES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/emails/' + email] = null

          // remove the inbox item?

          Firebase.database().ref().update(updates)

          dispatch({
            type: ActionTypes.INVITE_ACCEPTED,
            orgName: inviteSnap.val().orgName
          })
        // })
      }
    })
  }
}

// function updateStartValue(startValue) {
//   return {
//     type: ActionTypes.UPDATE_START_VALUE,
//     startValue: startValue + .000001
//   }
// }

// function setIsTipsLoading() {
//   return {
//     type: ActionTypes.SET_IS_TIPS_LOADING,
//     isTipsLoading: true
//   }
// }

// const debounceSetTipsNotLoading = debounce(tipsIsNotLoading, 3000);

// export function tipsIsNotLoading(dispatch) {
//   dispatch({
//     type: ActionTypes.SET_IS_TIPS_LOADING,
//     isTipsLoading: false
//   })
// }

export function watchThreadFeed(auth, orgName, projectId, startValue, source) {
  return dispatch => {
    if (auth) {
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
        if (orgSnap.exists()) {
          let orgId = orgSnap.val().orgId
          let path = projectId ? (Constants.THREADS_BY_PROJECT_PATH + '/' + projectId) : 
            (Constants.THREADS_BY_ORG_PATH + '/' + orgId)

          Firebase.database().ref(path).once('value', emptySnap => {
            if (!emptySnap.exists()) {
              dispatch({
                type: ActionTypes.EMPTY_THREAD,
                source: source
              })
            }
          })

          Firebase.database().ref(path)
            .orderByChild('lastModified')
            // .limitToFirst(2)
            .startAt(startValue)
            .on('child_added', threadSnapshot => {
            if (threadSnapshot.val().userId) {
              Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).once('value', userSnap => {
                let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : threadSnapshot.val()
                dispatch(threadAddedAction(threadSnapshot.key, thread, userSnap.val(), source));  
                // dispatch(updateStartValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : startValue));
              })
            }
          })

          // on child changed, how do we unwatch old refs?
          Firebase.database().ref(path)
            .orderByChild('lastModified')
            .on('child_changed', threadSnapshot => {
            if (threadSnapshot.val().userId) {
              // watchUser(dispatch, threadSnapshot.val().userId, Constants.PROJECTS_PAGE)
              Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).once('value', userSnap => {
                let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : threadSnapshot.val()
                dispatch(threadChangedAction(threadSnapshot.key, thread, userSnap.val(), source));
                // dispatch(updateStartValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : startValue));
              })
            }
          })

          Firebase.database().ref(path)
            .orderByChild('lastModified')
            .on('child_removed', threadSnapshot => {
            dispatch(threadRemovedAction(threadSnapshot.key, source));
          })
        }
      })
    }
  }
}

export function unwatchThreadFeed(auth, orgName, projectId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
      if (orgSnap.exists()) {
        let orgId = orgSnap.val().orgId
        let path = projectId ? (Constants.THREADS_BY_PROJECT_PATH + '/' + projectId) : 
          (Constants.THREADS_BY_ORG_PATH + '/' + orgId)

        Firebase.database().ref(path).off()

        dispatch({
          type: ActionTypes.UNWATCH_THREAD_FEED,
          source: source
        })
      }
    })
  }
}

export function loadOrgList(auth, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_added', snap => {
      dispatch({
        type: ActionTypes.LIST_ADDED_ACTION,
        name: snap.val().name,
        id: snap.key,
        listType: Constants.ORG_LIST_TYPE,
        source: source
      })
    })
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_changed', snap => {
      dispatch({
        type: ActionTypes.LIST_CHANGED_ACTION,
        name: snap.val().name,
        id: snap.key,
        listType: Constants.ORG_LIST_TYPE,
        source: source
      })
    })
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_removed', snap => {
      dispatch({
        type: ActionTypes.LIST_REMOVED_ACTION,
        name: snap.val().name,
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

export function setEditMode(mode) {
  return dispatch => {
    dispatch({
      type:ActionTypes.SET_EDIT_MODE,
      editMode: mode
    })
  }
}

export function markProjectRead(auth, projectId) {
  return dispatch => {
    let updates = {}
    Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).once('value', snap => {
      if (snap.exists()) {
        updates[Constants.THREAD_SEEN_COUNTERS_PATH + '/' + auth + '/' + snap.val().orgId + '/' + projectId] = null
        Firebase.database().ref().update(updates);
      }
    })
  }
}

export function markThreadRead(auth, threadId) {
  return dispatch => {
    let updates = {}
    Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId).once('value', snap => {
      if (snap.exists()) {
        updates[Constants.THREAD_SEEN_COUNTERS_PATH + '/' + auth + '/' + snap.val().orgId + '/' + snap.val().projectId + '/' + threadId] = null
        Firebase.database().ref().update(updates);
      }
    })
  }
}

export function loadOrgUsers(auth, orgName, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', nameSnap => {
      Firebase.database().ref(Constants.USERS_PATH).once('value', usersSnap => {
        if (nameSnap.exists()) {
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).once('value', usersByOrgSnap => {
            usersByOrgSnap.forEach(function(user) {
              if (usersSnap.exists() && usersSnap.val()[user.key]) {
                dispatch({
                  type: ActionTypes.USERNAME_LOADED,
                  username: usersSnap.val()[user.key].username,
                  firstName: usersSnap.val()[user.key].firstName,
                  lastName: usersSnap.val()[user.key].lastName,
                  email: usersSnap.val()[user.key].email,
                  id: user.key,
                  orgName: orgName,
                  source: source,
                })
              }
            })
          })
        }
      })
    })
  }
}

export function watchActivityFeed(auth, orgName, startValue, source) {
  return dispatch => {
    if (auth) {
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
        if (!orgSnap.exists()) {
          dispatch({
            type: ActionTypes.NOT_AN_ORG_USER
          })
        }
        else {
          Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', userSnap => {
            let orgId = orgSnap.val().orgId

            Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId).once('value', emptySnap => {
              if (!emptySnap.exists()) {
                dispatch({
                  type: ActionTypes.EMPTY_ACTIVITY_FEED,
                  source: source
                })
              }
            })

            Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId)
              .orderByChild('lastModified')
              // .limitToFirst(2)
              .startAt(startValue)
              .on('child_added', activitySnap => {
                dispatch(activityAddedAction(activitySnap.key, activitySnap.val(), userSnap.val(), source));
                // dispatch(updateStartValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : startValue));
            })

            // on child changed, how do we unwatch old refs?
            Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId)
              .orderByChild('lastModified')
              .on('child_changed', activitySnap => {
                dispatch(activityChangedAction(activitySnap.key, activitySnap.val(), userSnap.val(), source));
                // dispatch(updateStartValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : startValue));
            })

            Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId)
              .orderByChild('lastModified')
              .on('child_removed', activitySnap => {
              dispatch(activityRemovedAction(activitySnap.key, source));
            })
          })
        }
      })
    }
  }
}

export function unwatchActivityFeed(auth, orgName, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
      if (orgSnap.exists()) {
        let orgId = orgSnap.val().orgId

        Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId).off()

        dispatch({
          type: ActionTypes.UNWATCH_ACTIVITY_FEED,
          source: source
        })
      }
    })
  }
}

function activityAddedAction(activityId, activity, user, source) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.ACTIVITY_ADDED_ACTION,
    activityId,
    activity,
    user,
    source
  }
}

function activityChangedAction(activityId, activity, userId, source) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.ACTIVITY_CHANGED_ACTION,
    activityId,
    activity,
    userId,
    source
  }
}

function activityRemovedAction(activityId, source) {
  return {
    type: ActionTypes.ACTIVITY_REMOVED_ACTION,
    activityId,
    source
  }
}