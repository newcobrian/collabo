import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit, debounce } from 'lodash'

// function uploadAttachmentsToFirebase(dispatch, auth, attachments, org, projectId, threadId, commentId, parentCommentId) {
//   Firebase.database().ref(Constants.ATTACHMENTS_NAMES_BY_THREAD_PATH + '/' + threadId).once('value', namesSnap => {
//     let takenNames = namesSnap.exists() ? namesSnap.val() : {}
//     attachments.forEach(function(file) {
//       let attachmentId = Firebase.database().ref(Constants.ATTACHMENTS_PATH).push().key
//       const storageRef = Firebase.storage().ref();
//       const metadata = {
//         contentType: file.type
//       }
//       // generate a unique file name and add to list of taken names
//       let fileName = Helpers.generateAttachmentName(file.name, takenNames)
//       let cleanedName = Helpers.cleanEmailToFirebase(fileName)
//       takenNames[cleanedName] = true;

//       const uploadTask = storageRef.child('attachments/' + attachmentId).put(file, metadata);
//       uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
//       function(snapshot) {
//         let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           dispatch({
//             type: ActionTypes.UPLOAD_FILE_PROGRESS_UPDATE,
//             progress: progress,
//             fileId: attachmentId
//           })
//         }, 
//       function(error) {
//           console.log(error.message)
//       }, function() {
//         uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
//           let attachmentObject = {
//             name: fileName,
//             link: downloadURL,
//             type: file.type,
//             size: file.size,
//             userId: auth,
//             threadId: threadId,
//             commentId: commentId ? commentId : null,
//             parentCommentId: parentCommentId ? parentCommentId : null,
//             projectId: projectId,
//             orgId: org.id,
//             lastModified: Firebase.database.ServerValue.TIMESTAMP
//           }

//           let attachmentUpdates = {}
          
//           attachmentUpdates[Constants.ATTACHMENTS_PATH + '/' + attachmentId] = attachmentObject
//           attachmentUpdates[Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + threadId + '/' + attachmentId] = omit(attachmentObject, ['threadId'])
//           attachmentUpdates[Constants.ATTACHMENTS_NAMES_BY_THREAD_PATH + '/' + threadId + '/' + cleanedName] = attachmentId
//           attachmentUpdates[Constants.ATTACHMENTS_BY_PROJECT_PATH + '/' + projectId + '/' + attachmentId] = omit(attachmentObject, ['project'])
//           attachmentUpdates[Constants.ATTACHMENTS_BY_ORG_PATH + '/' + org.id + '/' + attachmentId] = omit(attachmentObject, ['org'])

//           // if this attachment is on a comment, add to comments-by-thread
//           let commentObject = pick(attachmentObject, ['name', 'link', 'type'])
//           if (commentId) {
//             // if theres no parentCommentId, then this is an attachment on a regular comment
//             if (!parentCommentId) {
//               attachmentUpdates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId + '/attachments/' + attachmentId] = commentObject
//             }
//             // otherwise this is a nested comment
//             else {
//               attachmentUpdates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + parentCommentId + '/nestedComments/' + commentId + '/' + '/attachments/' + attachmentId] = commentObject
//             }
//           }
//           // otherwise this is an attachment on a thread
//           else {
//             attachmentUpdates[Constants.THREADS_PATH + '/' + threadId + '/attachments/' + attachmentId] = commentObject
//           }

//           Firebase.database().ref().update(attachmentUpdates)
//         });
//       })
//     })
//   })
// }

export function updateAttachmentData(auth, attachments, org, projectId, threadId, commentId, parentCommentId) {
  Firebase.database().ref(Constants.ATTACHMENTS_NAMES_BY_THREAD_PATH + '/' + threadId).once('value', namesSnap => {
    let takenNames = namesSnap.exists() ? namesSnap.val() : {}
    attachments.forEach(function(file) {
      if (file.link && file.type && file.size) {
        let attachmentId = file.attachmentId
        // generate a unique file name and add to list of taken names
        let fileName = Helpers.generateAttachmentName(file.name, takenNames)
        let cleanedName = Helpers.cleanEmailToFirebase(fileName)
        takenNames[cleanedName] = true;
        
        let attachmentObject = {
          name: fileName,
          link: file.link,
          type: file.type,
          size: file.size,
          userId: auth,
          threadId: threadId,
          commentId: commentId ? commentId : null,
          parentCommentId: parentCommentId ? parentCommentId : null,
          projectId: projectId,
          orgId: org.id,
          lastModified: Firebase.database.ServerValue.TIMESTAMP
        }

        let attachmentUpdates = {}
        
        attachmentUpdates[Constants.ATTACHMENTS_PATH + '/' + attachmentId] = attachmentObject
        attachmentUpdates[Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + threadId + '/' + attachmentId] = omit(attachmentObject, ['threadId'])
        attachmentUpdates[Constants.ATTACHMENTS_NAMES_BY_THREAD_PATH + '/' + threadId + '/' + cleanedName] = attachmentId
        attachmentUpdates[Constants.ATTACHMENTS_BY_PROJECT_PATH + '/' + projectId + '/' + attachmentId] = omit(attachmentObject, ['project'])
        attachmentUpdates[Constants.ATTACHMENTS_BY_ORG_PATH + '/' + org.id + '/' + attachmentId] = omit(attachmentObject, ['org'])

        // if this attachment is on a comment, add to comments-by-thread
        let commentObject = pick(attachmentObject, ['name', 'link', 'type'])
        if (commentId) {
          // if theres no parentCommentId, then this is an attachment on a regular comment
          if (!parentCommentId) {
            attachmentUpdates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId + '/attachments/' + attachmentId] = commentObject
            attachmentUpdates[Constants.THREADS_BY_ORG_PATH + '/' + org.id + '/' + threadId + '/comments/' + commentId + '/attachments/' + attachmentId] = commentObject
            attachmentUpdates[Constants.THREADS_BY_PROJECT_PATH + '/' + projectId + '/' + threadId + '/comments/' + commentId + '/attachments/' + attachmentId] = commentObject
          }
          // otherwise this is a nested comment
          else {
            attachmentUpdates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + parentCommentId + '/nestedComments/' + commentId + '/' + '/attachments/' + attachmentId] = commentObject
            attachmentUpdates[Constants.THREADS_BY_ORG_PATH + '/' + org.id + '/' + threadId + '/comments/' + parentCommentId + '/nestedComments/' + commentId + '/' + '/attachments/' + attachmentId] = commentObject
            attachmentUpdates[Constants.THREADS_BY_PROJECT_PATH + '/' + projectId + '/' + threadId + '/comments/' + parentCommentId + '/nestedComments/' + commentId + '/' + '/attachments/' + attachmentId] = commentObject
          }
        }
        // otherwise this is an attachment on a thread
        else {
          attachmentUpdates[Constants.THREADS_PATH + '/' + threadId + '/attachments/' + attachmentId] = commentObject
          attachmentUpdates[Constants.THREADS_BY_ORG_PATH + '/' + org.id + '/' + threadId + '/attachments/' + attachmentId] = commentObject
          attachmentUpdates[Constants.THREADS_BY_PROJECT_PATH + '/' + projectId + '/' + threadId + '/attachments/' + attachmentId] = commentObject
        }

        Firebase.database().ref().update(attachmentUpdates)
      }
    })
  })

  Helpers.updateAlgoliaAttachments(threadId)
}

export function deleteAttachmentFile(auth, attachmentId) {
  return dispatch => {
    Firebase.database().ref(Constants.ATTACHMENTS_PATH + '/' + attachmentId).once('value', snap => {
      if (snap.exists()) {
        let attachmentUpdates = {}
        let file = snap.val()
        let cleanedName = Helpers.cleanEmailToFirebase(file.name)

        attachmentUpdates[Constants.ATTACHMENTS_PATH + '/' + attachmentId] = null
        attachmentUpdates[Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + file.threadId + '/' + attachmentId] = null
        attachmentUpdates[Constants.ATTACHMENTS_NAMES_BY_THREAD_PATH + '/' + file.threadId + '/' + cleanedName] = null
        attachmentUpdates[Constants.ATTACHMENTS_BY_PROJECT_PATH + '/' + file.projectId + '/' + attachmentId] = null
        attachmentUpdates[Constants.ATTACHMENTS_BY_ORG_PATH + '/' + file.orgId + '/' + attachmentId] = null

        // also delete the comment from the thread
        if (file.commentId) {
          // if theres no parentCommentId, then this is an attachment on a regular comment
          if (!file.parentCommentId) {
            attachmentUpdates[Constants.COMMENTS_BY_THREAD_PATH + '/' + file.threadId + '/' + file.commentId + '/attachments/' + attachmentId] = null
            attachmentUpdates[Constants.THREADS_BY_ORG_PATH + '/' + file.orgId + '/' + file.threadId + '/comments/' + file.commentId + '/attachments/' + attachmentId] = null
            attachmentUpdates[Constants.THREADS_BY_PROJECT_PATH + '/' + file.projectId + '/' + file.threadId + '/comments/' + file.commentId + '/attachments/' + attachmentId] = null
          }
          // otherwise this is a nested comment
          else {
            attachmentUpdates[Constants.COMMENTS_BY_THREAD_PATH + '/' + file.threadId + '/' + file.parentCommentId + '/nestedComments/' + file.commentId + '/' + '/attachments/' + attachmentId] = null
            attachmentUpdates[Constants.THREADS_BY_ORG_PATH + '/' + file.orgId + '/' + file.threadId + '/comments/' + file.parentCommentId + '/nestedComments/' + file.commentId + '/' + '/attachments/' + attachmentId] = null
            attachmentUpdates[Constants.THREADS_BY_PROJECT_PATH + '/' + file.projectId + '/' + file.threadId + '/comments/' + file.parentCommentId + '/nestedComments/' + file.commentId + '/' + '/attachments/' + attachmentId] = null
          }
        }
        // otherwise this is an attachment on a thread
        else {
          attachmentUpdates[Constants.THREADS_PATH + '/' + file.threadId + '/attachments/' + attachmentId] = null
          attachmentUpdates[Constants.THREADS_BY_ORG_PATH + '/' + file.orgId + '/' + file.threadId + '/attachments/' + attachmentId] = null
          attachmentUpdates[Constants.THREADS_BY_PROJECT_PATH + '/' + file.projectId + '/' + file.threadId + '/attachments/' + attachmentId] = null
        }

        const storageRef = Firebase.storage().ref();
        // Create a reference to the file to delete
        var deleteRef = storageRef.child('attachments/' + attachmentId);

        // Delete the file
        deleteRef.delete().then(function() {
          // File deleted successfully
          Firebase.database().ref().update(attachmentUpdates)
        }).catch(function(error) {
          // Uh-oh, an error occurred!
        });

        Helpers.updateAlgoliaAttachments(file.threadId)
      }
    })
  }
}

export function onAddThread(auth, org, projectId, thread, attachments) {
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
            lastEdit: serverTimestamp,
            createdOn: serverTimestamp,
            orgId: projectSnapshot.val().orgId,
            userId: auth,
            projectId: projectId,
            lastUpdate: Constants.NEW_THREAD_TYPE,
            lastUpdater: auth
          }
          let updates = {};
          Object.assign(threadObject, thread)

          let threadId = Firebase.database().ref(Constants.THREADS_PATH).push(threadObject).key;

          updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${projectId}/${threadId}/`] = omit(threadObject, ['projectId']);
          updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${auth}/${projectSnapshot.val().orgId}/${threadId}/`] = omit(threadObject, ['userId'], ['orgId']);
          updates[`/${Constants.THREADS_BY_ORG_PATH}/${projectSnapshot.val().orgId}/${threadId}/`] = omit(threadObject, ['orgId']);

          // also update user's activity feed
          let activityObject = Object.assign({}, omit(threadObject, ['userId', 'orgId', 'lastUpdate', 'lastUpdater']), { threadId: threadId }, { type: Constants.NEW_THREAD_TYPE })
          Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + projectSnapshot.val().orgId).push(activityObject)

          Firebase.database().ref().update(updates);

          Helpers.incrementThreadLastUpdateTime(auth, projectSnapshot.val().orgId, projectId, threadId)

          // upload attachments
          if (attachments && attachments.length > 0) {
            updateAttachmentData(auth, attachments, org, projectId, threadId, null, null)
          }

          // notify anyone mentioned in thread body
          let project = Object.assign({},  projectSnapshot.val(), {projectId: projectId})
          Helpers.findThreadMentions(auth, thread.body, org, project, Object.assign({}, thread, {threadId: threadId}))
          // Helpers.sendCollaboUpdateNotifs(auth, Constants.NEW_THREAD_MESSAGE, org ,project, Object.assign({}, thread, {threadId: threadId}, null))

          // // update Algolia index
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + projectSnapshot.val().orgId + '/' + auth).once('value', userSnap => {
            let algoliaObject = Object.assign({}, 
              { orgName: org.url },
              { title: thread.title },
              { body: Helpers.stripHTML(thread.body) },
              { projectName: projectSnapshot.val().name },
              { username: userSnap.val().username },
              { userId: auth },
              { comments: [] },
              { createdOn: new Date().getTime() },
              { projectId: projectId }
              )

            Helpers.updateAlgoliaIndex(threadId, algoliaObject);
          })

          mixpanel.people.increment("threads created");
          mixpanel.people.set({ "last thread created": (new Date()).toISOString() });
          mixpanel.identify(auth);

          dispatch({
            type: ActionTypes.THREAD_CREATED,
            threadId: threadId,
            orgURL: org.url,
            projectId: projectId,
            meta: {
              mixpanel: {
                event: 'Created new thread',
                source: Constants.ADD_THREAD_PAGE,
                projectId: projectId,
                orgId: projectSnapshot.val().orgId
              }
            }
          })
        }
      })
    }
  }
}

export function onDeleteThread(auth, threadId, thread, orgURL) {
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
            updates[Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + user.key + '/' + thread.orgId + '/' + thread.projectId + '/' + threadId] = null  
          })
        }

        Firebase.database().ref().update(updates);

        Helpers.deleteAlgoliaObject(threadId)

        dispatch({
          type: ActionTypes.THREAD_DELETED,
          redirect: '/' + orgURL + '/' + thread.projectId,
          message: 'Thread deleted',
          meta: {
            mixpanel: {
              event: 'Thread deleted',
              source: Constants.THREAD_PAGE,
              projectId: thread.projectId,
              orgId: thread.orgId
            }
          }
        })
      })
    }
  }
}

export function loadThread(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId).on('value', threadSnapshot => {
      if (threadSnapshot.exists()) {
        Firebase.database().ref(Constants.PROJECTS_PATH + '/' + threadSnapshot.val().projectId).on('value', projectSnapshot => {
          // Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + threadSnapshot.val().orgId + '/' + threadSnapshot.val().userId).on('value', userSnapshot => {
            dispatch({
              type: ActionTypes.LOAD_THREAD,
              thread: threadSnapshot.val(),
              // createdBy: userSnapshot.val(),
              project: Object.assign({}, projectSnapshot.val(), {projectId: threadSnapshot.val().projectId})
            })
          // })
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

export function loadThreadLikes(threadId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.LIKES_PATH + '/' + threadId).on('child_added', addedSnap => {
      dispatch({
        type: ActionTypes.THREAD_LIKES_ADDED_ACTION,
        userId: addedSnap.key,
        userData: addedSnap.val(),
        source
      })
    })

    Firebase.database().ref(Constants.LIKES_PATH + '/' + threadId).on('child_removed', removedSnap => {
      dispatch({
        type: ActionTypes.THREAD_LIKES_REMOVED_ACTION,
        userId: removedSnap.key,
        source
      })
    })
  }
}

export function unloadThreadLikes(threadId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.LIKES_PATH + '/' + threadId).off()
    dispatch({
      type: ActionTypes.UNLOAD_THREAD_LIKES,
      source
    })
  }
}

// function watchThreadUnreadsByProject(dispatch, auth, orgId, projectId) {
//   // watch last update times for the thread
//   Firebase.database().ref(Constants.THREAD_LAST_UPDATED_BY_PROJECT_BY_ORG_PATH + '/' + orgId + '/' + projectId).on('child_added', updateAddedSnap => {
//     dispatch({
//       type: ActionTypes.GET_UNREADS_THREAD_ADDED,
//       objectName: Constants.THREADS_LAST_UPDATED_OBJECT,
//       orgId: orgId,
//       projectId: projectId,
//       threadId: updateAddedSnap.key,
//       lastUpdated: updateAddedSnap.val()
//     })
//   })

//   Firebase.database().ref(Constants.THREAD_LAST_UPDATED_BY_PROJECT_BY_ORG_PATH + '/' + orgId + '/' + projectId).on('child_changed', updateChangedSnap => {
//     dispatch({
//       type: ActionTypes.GET_UNREADS_THREAD_CHANGED,
//       objectName: Constants.THREADS_LAST_UPDATED_OBJECT,
//       orgId: orgId,
//       projectId: projectId,
//       threadId: updateChangedSnap.key,
//       lastUpdated: updateChangedSnap.val()
//     })
//   })

//   Firebase.database().ref(Constants.THREAD_LAST_UPDATED_BY_PROJECT_BY_ORG_PATH + '/' + orgId + '/' + projectId).on('child_removed', updateRemovedSnap => {
//     dispatch({
//       type: ActionTypes.GET_UNREADS_THREAD_REMOVED,
//       objectName: Constants.THREADS_LAST_UPDATED_OBJECT,
//       orgId: orgId,
//       projectId: projectId,
//       threadId: updateRemovedSnap.key,
//     })
//   })

//   // watch last seen times for the thread by the user
//   Firebase.database().ref(Constants.THREAD_LAST_SEEN_BY_PROJECT_PATH + '/' + auth + '/' + projectId).on('child_added', seenAddedSnap => {
//     dispatch({
//       type: ActionTypes.GET_UNREADS_THREAD_ADDED,
//       objectName: Constants.THREADS_LAST_SEEN_OBJECT,
//       orgId: orgId,
//       projectId: projectId,
//       threadId: seenAddedSnap.key,
//       lastUpdated: seenAddedSnap.val()
//     })
//   })

//   Firebase.database().ref(Constants.THREAD_LAST_SEEN_BY_PROJECT_PATH + '/' + auth + '/' + projectId).on('child_changed', seenChangedSnap => {
//     dispatch({
//       type: ActionTypes.GET_UNREADS_THREAD_CHANGED,
//       objectName: Constants.THREADS_LAST_SEEN_OBJECT,
//       orgId: orgId,
//       projectId: projectId,
//       threadId: seenChangedSnap.key,
//       lastUpdated: seenChangedSnap.val()
//     })
//   })

//   Firebase.database().ref(Constants.THREAD_LAST_SEEN_BY_PROJECT_PATH + '/' + auth + '/' + projectId).on('child_removed', seenRemovedSnap => {
//     dispatch({
//       type: ActionTypes.GET_UNREADS_THREAD_REMOVED,
//       objectName: Constants.THREADS_LAST_SEEN_OBJECT,
//       orgId: orgId,
//       projectId: projectId,
//       threadId: seenRemovedSnap.key,
//     })
//   })
// }

export function loadThreadCounts(auth, orgId) {
  return dispatch => {
    Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).on('child_added', addedSnap => {
      dispatch({
        type: ActionTypes.THREAD_COUNTS_ADDED,
        projectId: addedSnap.key,
        count: addedSnap.numChildren()
      })
    })

    Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).on('child_changed', changedSnap => {
      dispatch({
        type: ActionTypes.THREAD_COUNTS_CHANGED,
        projectId: changedSnap.key,
        count: changedSnap.numChildren()
      })
    })

    Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).on('child_removed', removedSnap => {
      dispatch({
        type: ActionTypes.THREAD_COUNTS_REMOVED,
        projectId: removedSnap.key
      })
    })


    // Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).on('value', countSnap => {
    //   let countObject = {}
    //   countSnap.forEach(function(project) {
    //     countObject[project.key] = project.numChildren()
    //   })

    //   dispatch({
    //     type: ActionTypes.THREAD_COUNTS_LOADED,
    //     unreadThreadCounts: countObject
    //   })
    // })
  }
}

export function unloadThreadCounts(auth, orgId) {
  return dispatch => {
    Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).off()

    dispatch({
      type: ActionTypes.THREAD_COUNTS_UNLOADED
    })
  }
}

export function updateThreadField(auth, threadId, thread, org, field, value) {
  return dispatch => {
    if (thread && threadId && thread.userId && thread.orgId) {
      let updates = {}

      // update all thread tables
      updates[`/${Constants.THREADS_PATH}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${thread.userId}/${thread.orgId}/${threadId}/${field}/`] = value
      updates[`/${Constants.THREADS_BY_ORG_PATH}/${thread.orgId}/${threadId}/${field}/`] = value

      // update lastModified and lastEdit timestamps
      let timestamp = Firebase.database.ServerValue.TIMESTAMP;
      updates[`/${Constants.THREADS_PATH}/${threadId}/lastModified/`] = timestamp
      updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/lastModified/`] = timestamp
      updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${thread.userId}/${thread.orgId}/${threadId}/lastModified/`] = timestamp
      updates[`/${Constants.THREADS_BY_ORG_PATH}/${thread.orgId}/${threadId}/lastModified`] = timestamp
      updates[`/${Constants.THREADS_PATH}/${threadId}/lastEdit/`] = timestamp
      updates[`/${Constants.THREADS_BY_PROJECT_PATH}/${thread.projectId}/${threadId}/lastEdit/`] = timestamp
      updates[`/${Constants.THREADS_BY_USER_BY_ORG_PATH}/${thread.userId}/${thread.orgId}/${threadId}/lastEdit/`] = timestamp
      updates[`/${Constants.THREADS_BY_ORG_PATH}/${thread.orgId}/${threadId}/lastEdit`] = timestamp

      // if body was updated, make this the lastUpdate
      if (field === 'body') {
        Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdate', Constants.EDIT_THREAD_TYPE));
        Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdater', auth));

        // also update user's activity feed
        let activityObject = Object.assign({}, omit(thread, ['userId', 'orgId', 'lastUpdate', 'lastUpdater']), { threadId: threadId }, { type: Constants.EDIT_THREAD_TYPE })
        Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + thread.orgId).push(activityObject)

        // update algolia
        let project = Object.assign({}, {projectId: thread.projectId})
        Helpers.findThreadMentions(auth, value, org, project, Object.assign({}, thread, {threadId: threadId}))

        let algoliaObject = Object.assign({}, {body: Helpers.stripHTML(value) })
        Helpers.updateAlgoliaIndex(threadId, algoliaObject);
      }

      Firebase.database().ref().update(updates);

      Helpers.incrementThreadLastUpdateTime(auth, thread.orgId, thread.projectId, threadId)

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
    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_added', addedSnap => {
      dispatch(threadCommentAddedAction(threadId, addedSnap.key, addedSnap.val()));
    })

    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_changed', changedSnap => {
      dispatch(threadCommentChangedAction(threadId, changedSnap.key, changedSnap.val()));
    })

    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_removed', removedSnap => {
      dispatch(threadCommentRemovedAction(threadId, removedSnap.key));
    })
  }
}

// export function watchThreadComments2(threadId) {
//   return dispatch => {
//     Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('value', commentSnap => {
//       let commentArr = []
//       commentSnap.forEach(function(comment) {
//         let commentObject = Object.assign({}, comment.val(), {commentId: comment.key})
//         if (!comment.val().parent) commentObject.parent = 0;
//         commentArr = commentArr.concat(commentObject)
//       })

//       let LTT = require('list-to-tree');

//       var ltt = new LTT(commentArr, {
//         key_id: 'commentId',
//         key_parent: 'parent'
//       });
//       var tree = ltt.GetTree();

//       dispatch({
//         type: 'COMMENT_THINGY',
//         comments: tree
//       })
//     })
//   }
// }

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

export function onThreadCommentUpdate(auth, thread, body, threadId, org, commentId, parentId) {
  return dispatch => {
    let updates = {}
    let lastModified = Firebase.database.ServerValue.TIMESTAMP
    // let updates = getThreadFieldUpdates(threadId, thread, 'lastModified', Firebase.database.ServerValue.TIMESTAMP)

    // // last update is a comment
    // Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdate', Constants.COMMENT_TYPE));

    // // update lastUpdater as the commenter
    // Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdater', authenticated));

    // update comment
    updates[Constants.COMMENTS_PATH + '/' + commentId + '/body'] = body
    updates[Constants.COMMENTS_PATH + '/' + commentId + '/lastModified'] = lastModified

    // if no parent ID update comment
    if (!parentId) {
      // this is a regular comment, add it under comments/
      updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + commentId + '/body'] = body
      updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + commentId + '/body'] = body
      updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + commentId + '/lastModified'] = lastModified
      updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + commentId + '/lastModified'] = lastModified

      // and update comments by thread
      updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId + '/body'] = body
      updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId + '/lastModified'] = lastModified
    }
    else {
      // this is a nested comment, so add it under the parent's nestedComments/
      updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId + '/body'] = body
      updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId + '/body'] = body
      updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId + '/lastModified'] = lastModified
      updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId + '/lastModified'] = lastModified

      // and update comments-by-thread
      updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + parentId + '/nestedComments/' + commentId + '/body'] = body
      updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + parentId + '/nestedComments/' + commentId + '/lastModified'] = lastModified
    }

    // findthreadmentions and notify people

    Firebase.database().ref().update(updates)

    // dispatch({
    //   type: ActionTypes.COMMENT_BODY_UPDATED
    // })
  }
}

export function onThreadCommentSubmit(authenticated, type, thread, body, threadId, project, org, parentId, attachments) {
  return dispatch => {
    if(!authenticated) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    const comment = {
      userId: authenticated,
      body: body ? body : '',
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    }

    if (threadId) {
      let commentObject = Object.assign({}, comment, {threadId: threadId}, { type: type })
      // let commentId = Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).push(comment).key;
      let commentId = Firebase.database().ref(Constants.COMMENTS_PATH).push(commentObject).key;

      Helpers.incrementThreadCount(Constants.COMMENTS_COUNT, threadId, thread, thread.userId);
      
      let updates = getThreadFieldUpdates(threadId, thread, 'lastModified', Firebase.database.ServerValue.TIMESTAMP)

      // last update is a comment
      Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdate', Constants.COMMENT_TYPE));

      // update lastUpdater as the commenter
      Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdater', authenticated));

      // update the last comment
      // Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastComment', Object.assign({}, comment, { commentId: commentId })))

      // add comment to threads-by-project and threads-by-org for feeds

      let commentObjectWithID = Object.assign({}, {id: commentId}, commentObject)
      if (!parentId) {
        // this is a regular comment, add it under comments/
        updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + commentId] = commentObjectWithID
        updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + commentId] = commentObjectWithID

        // and update comments-by-thread
        updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId] = Object.assign({}, comment, {id: commentId});
      }
      else {
        // this is a nested comment, so add it under the parent's nestedComments/
        updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId] = commentObjectWithID
        updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId] = commentObjectWithID

        // and update comments-by-thread
        updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + parentId + '/nestedComments/' + commentId] = Object.assign({}, comment, {id: commentId});
      }

      Firebase.database().ref().update(updates);

      // also update user's activity feed
      let activityObject = Object.assign({}, pick(thread, ['title', 'projectId', 'createdOn']), pick(comment, ['body', 'lastModified']), { threadId: threadId }, { type: Constants.COMMENT_TYPE })
      Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + authenticated + '/' + thread.orgId).push(activityObject)

      Helpers.incrementThreadLastUpdateTime(authenticated, thread.orgId, thread.projectId, threadId)

      // send message to original review poster if they are not the commentor
      let sentArray = [];
      let threadObject = Object.assign({}, thread, { threadId: threadId })

      // then notify the original poster
      if (authenticated !== thread.userId && (sentArray.indexOf(thread.userId) === -1)) {
        Helpers.sendCommentInboxMessage(authenticated, thread.userId, Constants.COMMENT_IN_THREAD_MESSAGE, 
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

      // send inbox messages to any usernames mentioned in the comment
      // findCommentMentions(dispatch, authenticated, body, org, project, threadObject, sentArray, commentId)
      let pattern = /\B@[a-z0-9_-]+/gi;
      let found = body.match(pattern);
      if (found) {
        for (let i = 0; i < found.length; i++) {
          let username = found[i].substr(1);
          Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).once('value', usernameSnap => {
            if (usernameSnap.exists()) {
              if (usernameSnap.val().userId !== authenticated && sentArray.indexOf(usernameSnap.val().userId) === -1) {
                Helpers.sendCommentInboxMessage(authenticated, usernameSnap.val().userId, Constants.COMMENT_MENTION_MESSAGE, org, project, threadObject, Object.assign({}, {commentId: commentId}, {message: body}))
                sentArray.push(usernameSnap.val().userId);
              }
            }
          })
        }
      }

      // add attachments
      if (attachments && attachments.length > 0) {
        updateAttachmentData(authenticated, attachments, org, thread.projectId, threadId, commentId, parentId)
      }

      setTimeout(function() {
        Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).once('value', commentsSnapshot => {
          commentsSnapshot.forEach(function(comment) {
            let commenterId = comment.val().userId;
            // if not commentor or in sent array, then send a message
            if (commenterId !== authenticated && (sentArray.indexOf(commenterId) === -1)) {
              Helpers.sendCommentInboxMessage(authenticated, commenterId, Constants.ALSO_COMMENTED_MESSAGE, org, project, threadObject, Object.assign({}, {commentId: commentId}, {message: body}));
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

            // send to any nested commenters too
            if (comment.val().nestedComments) {
              Object.keys(comment.val().nestedComments || {}).map(function(nestedId) {
                let nestedCommenterId = comment.val().nestedComments[nestedId].userId;

                if (nestedCommenterId !== authenticated && (sentArray.indexOf(nestedCommenterId) === -1)) {
                  Helpers.sendCommentInboxMessage(authenticated, nestedCommenterId, Constants.ALSO_COMMENTED_MESSAGE, org, project, threadObject, Object.assign({}, {commentId: commentId}, {message: body}));
                  sentArray.push(nestedCommenterId);
                }
              })
            }
          })
        })
      }, 3000);

      Helpers.addAlgoliaComment(threadId, body, commentId, authenticated)

      // let algoliaComments = Helpers.getAlgoliaObject(threadId, ['comments']) || []
      // console.log('algliacomments = ' + JSON.stringify(algoliaComments))
      // algoliaComments.push(body)
      // console.log('second = ' + JSON.stringify(algoliaComments))
      // Helpers.updateAlgoliaIndex(threadId, {comments: algoliaComments});

      // const mixpanelProps = ( (type === Constants.TIPS_TYPE ||  type === Constants.RECOMMENDATIONS_TYPE) ? {subjectId: commentObject.subjectId} : {itineraryId: commentObject.id});
      dispatch({
        type: ActionTypes.ADD_COMMENT,
        meta: {
          mixpanel: {
            event: 'Comment added',
          }
        }
      })

      // mixpanel.people.increment("total comments");
      // mixpanel.people.set({ "last comment date": (new Date()).toISOString() });
      // mixpanel.identify(authenticated);
    }
  }
}

export function onDeleteThreadComment(thread, commentId, threadId, parentId) {
  return dispatch => {
    // delete the comment
    let updates = {}

    // delete from comments path
    updates[Constants.COMMENTS_PATH + '/' + commentId] = null

    // delete from comments-by-thread
    if (parentId) {
      // this is a nested comment

      // delete from comments by thread
      updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + parentId + '/nestedComments/' + commentId] = null

      // delete from threads-by-project and threads-by-org feeds
      updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId] = null
      updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + parentId + '/nestedComments/' + commentId] = null

      Firebase.database().ref().update(updates)
    }
    else {
      // this is a regular comment
      // find nested comments and delete
      Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId + '/nestedComments').once('value', snap => {
        let nestedUpdate = {}
        snap.forEach(function(nestedComment) {
          nestedUpdate[Constants.COMMENTS_PATH + '/' + nestedComment.key] = null
          // Firebase.database().ref(Constants.COMMENTS_PATH + '/' + nestedComment.key).remove()
        })
        setTimeout(function() {
          Firebase.database().ref().update(nestedUpdate)
        },1000)

        updates[Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId + '/' + commentId] = null

        // delete from threads-by-project and threads-by-org feeds
        updates[Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/comments/' + commentId] = null
        updates[Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/comments/' + commentId] = null

        Firebase.database().ref().update(updates)
      })      
    }

    Helpers.deleteAlgoliaComment(threadId, commentId)
    
    Helpers.decrementThreadCount(Constants.COMMENTS_COUNT, threadId, thread, thread.userId);

    // change last comment to previous comment
    // Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId).once('value', threadSnap => {
    //   if (threadSnap.exists() && threadSnap.val().lastComment && threadSnap.val().lastComment.commentId === commentId) {
    //     if (threadSnap.val().commentsCount >= 2) {
    //       Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).orderByKey().limitToLast(1).once('value', limitedSnap => {
    //         let saveObject = {};
    //         if (limitedSnap.exists()) {
    //           saveObject = Object.assign({}, limitedSnap.val(), { commentId: limitedSnap.key });
    //           let updates = getThreadFieldUpdates(threadId, thread, 'lastComment', saveObject)
    //           Firebase.database().ref().update(updates);
    //         }
    //       })
    //     }
    //     else {
    //       // only 1 comment so just remove lastComment
    //       let updates = getThreadFieldUpdates(threadId, thread, 'lastComment', null)
    //       Firebase.database().ref().update(updates);
    //     }
    //   }
    // })

  // mixpanel.people.increment("total comments", -1);

    dispatch({
      type: ActionTypes.DELETE_COMMENT
    })
  }
}

export function markThreadRead(auth, orgId, projectId, threadId) {
  return dispatch => {
    let updates = {}
    updates[Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId + '/' + projectId + '/' + threadId] = null
    Firebase.database().ref().update(updates);
  }
}

export function loadThreadAttachments(threadId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + threadId).on('child_added', addedSnap => {
      dispatch({
        type: ActionTypes.LOAD_THREAD_ATTACHMENTS_ADDED,
        attachmentId: addedSnap.key,
        payload: addedSnap.val(),
        source: source
      })
    })

    Firebase.database().ref(Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + threadId).on('child_changed', changedSnap => {
      dispatch({
        type: ActionTypes.LOAD_THREAD_ATTACHMENTS_CHANGED,
        attachmentId: changedSnap.key,
        payload: changedSnap.val(),
        source: source
      })
    })

    Firebase.database().ref(Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + threadId).on('child_removed', removedSnap => {
      dispatch({
        type: ActionTypes.LOAD_THREAD_ATTACHMENTS_REMOVED,
        attachmentId: removedSnap.key,
        source: source
      })
    })
  }
}

export function unloadThreadAttachments(threadId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + threadId).off()

    dispatch({
      type: ActionTypes.UNLOAD_THREAD_ATTACHMENTS
    })
  }
}

export function sortFiles(method, source) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SORT_FILES,
      method: method,
      source: source
    })
  }
}

export function updateThreadLastSeen(auth, orgId, projectId, threadId) {
  return dispatch => {
    let updates = {}
    updates[Constants.THREAD_LAST_SEEN_BY_ORG_PATH + '/' + auth + '/' + orgId + '/' + threadId] = Firebase.database.ServerValue.TIMESTAMP
    updates[Constants.THREAD_LAST_SEEN_BY_PROJECT_PATH + '/' + auth + '/' + projectId + '/' + threadId] = Firebase.database.ServerValue.TIMESTAMP
    Firebase.database().ref().update(updates)
  }
}

export function loadThreadUnreads(auth, orgId, projectId) {
  return dispatch => {
    if (projectId) {
      Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId + '/' + projectId).on('child_added', addedSnap => {
        dispatch({
          type: ActionTypes.UNREAD_THREADS_ADDED,
          projectId: projectId,
          threadId: addedSnap.key,
        })
      })

      // Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId + '/' + projectId).on('child_changed', changedSnap => {
      //   dispatch({
      //     type: ActionTypes.UNREAD_THREADS_CHANGED,
      //     threadId: changedSnap.key,
      //   })
      // })

      Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId + '/' + projectId).on('child_removed', removedSnap => {
        dispatch({
          type: ActionTypes.UNREAD_THREADS_REMOVED,
          projectId: projectId,
          threadId: removedSnap.key
        })
      })
    }
    // else if no project id, get all threads from the org
    else {
      Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).on('child_added', addedSnap => {
        dispatch({
          type: ActionTypes.UNREAD_THREADS_ADDED,
          projectId: addedSnap.key,
          payload: addedSnap.val()
        })
      })

      Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).on('child_changed', changedSnap => {
        dispatch({
          type: ActionTypes.UNREAD_THREADS_CHANGED,
          projectId: changedSnap.key,
          payload: changedSnap.val()
        })
      })

      Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).on('child_removed', removedSnap => {
        dispatch({
          type: ActionTypes.UNREAD_THREADS_REMOVED,
          projectId: removedSnap.key
        })
      })
    }
  }
}

export function unloadThreadUnreads(auth, orgId, projectId) {
  return dispatch => {
    if (projectId) {
      Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId + '/' + projectId).off()
    }
    else {
      Firebase.database().ref(Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + orgId).off()
    }
    dispatch({
      type: ActionTypes.UNREAD_THREADS_UNLOADED
    })
  }
}