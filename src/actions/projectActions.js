import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import { watchUser, unwatchUser, findCommentMentions } from './index'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit, debounce } from 'lodash'

export function onAddProject(auth, project, orgName, userInfo) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else {

      let lowerCaseProject = project.name.toLowerCase()
      let lowerCaseOrgName = orgName.toLowerCase()
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowerCaseOrgName).once('value', orgSnap => {
        Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + orgSnap.val().orgId + '/' + lowerCaseProject).once('value', nameSnapshot => {
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
              orgName: orgName,
              orgId: orgSnap.val().orgId
            }
            let updates = {};
            Object.assign(projectObject, project)

            let projectId = Firebase.database().ref(Constants.PROJECTS_PATH).push(projectObject).key;

            updates[`/${Constants.PROJECT_NAMES_BY_ORG_PATH}/${orgSnap.val().orgId}/${lowerCaseProject}/`] = Object.assign({}, {projectId: projectId}, {isPublic: project.isPublic})
            // updates[`/${Constants.PROJECTS_BY_USER_PATH}/${auth}/${projectId}/`] = { name: project.name };

            // add the project to the creators Project List
            updates[`/${Constants.PROJECTS_BY_USER_BY_ORG_NAME_PATH}/${auth}/${lowerCaseOrgName}/${projectId}/`] = Object.assign({}, {name: lowerCaseProject}, {isPublic: project.isPublic});
            updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectId}/${auth}/`] = Object.assign({}, userInfo);

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
          }
        })
      })
    }
  }
}

export function onAddThread(auth, projectId, thread, orgName, userInfo) {
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
            lastUpdate: Constants.NEW_THREAD_TYPE,
            lastUpdater: pick(userInfo, ['username', 'userId', 'fullName', 'image'])
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
          Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', userSnap => {
            let algoliaObject = Object.assign({}, 
              { orgName: orgName },
              { title: thread.title },
              { body: Helpers.stripImageTags(thread.body) },
              { projectName: projectSnapshot.val().name },
              { username: userSnap.val().username },
              { userId: auth },
              { comments: [] },
              { createdOn: new Date().getTime() },
              { projectId: projectId }
              )

            Helpers.updateAlgoliaIndex(threadId, algoliaObject);
          })

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

        Helpers.deleteAlgoliaObject(threadId)

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

export function loadProject(projectId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).once('value', projectSnapshot => {
      if (projectSnapshot.exists()) {
        dispatch({
          type: ActionTypes.LOAD_PROJECT,
          project: projectSnapshot.val(),
          projectId: projectId,
          source: source
        })
      }
      else {
        dispatch({
          type: ActionTypes.PROJECT_NOT_FOUND_ERROR,
          source: source
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

export function loadProjectList(auth, orgName, projectId, source) {
  return dispatch => {
    let lowercaseName = orgName.toLowerCase()

    dispatch({
      type: ActionTypes.LOAD_PROJECT_LIST,
      projectId: projectId,
      source: source
    })

    // Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_added', snap => {
    Firebase.database().ref(Constants.PROJECTS_BY_USER_BY_ORG_NAME_PATH + '/' + auth + '/' + lowercaseName).on('child_added', snap => {
      dispatch({ 
        type: ActionTypes.LIST_ADDED_ACTION,
        id: snap.key,
        data: snap.val(),
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })

    // Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_changed', snap => {
    Firebase.database().ref(Constants.PROJECTS_BY_USER_BY_ORG_NAME_PATH + '/' + auth + '/' + lowercaseName).on('child_changed', snap => {
      dispatch({
        type: ActionTypes.LIST_CHANGED_ACTION,
        id: snap.key,
        data: snap.val(),
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })

    // Firebase.database().ref(Constants.PROJECTS_BY_USER_PATH + '/' + auth).on('child_removed', snap => {
    Firebase.database().ref(Constants.PROJECTS_BY_USER_BY_ORG_NAME_PATH + '/' + auth + '/' + lowercaseName).on('child_removed', snap => {
      dispatch({
        type: ActionTypes.LIST_REMOVED_ACTION,
        id: snap.key,
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })
  }
}

export function loadThreadCounts(auth, orgName) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
      if (orgSnap.exists()) {
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
      }
    })
  }
}

export function unloadThreadCounts(auth, orgName) {
  return dispatch => {
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
      if (orgSnap.exists()) {
        Firebase.database().ref(Constants.THREAD_SEEN_COUNTERS_PATH + '/' + auth + '/' + orgSnap.val().orgId).off()

        dispatch({
          type: ActionTypes.THREAD_COUNTS_UNLOADED
        })
      }
    })
  }
}

export function unloadProjectList(auth, orgName) {
  return dispatch => {
     Firebase.database().ref(Constants.PROJECTS_BY_USER_BY_ORG_NAME_PATH + '/' + auth + '/' + orgName.toLowerCase()).off()
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

export function loadThreadLikes(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.LIKES_PATH + '/' + threadId).on('child_added', addedSnap => {
      dispatch({
        type: ActionTypes.THREAD_LIKES_ADDED_ACTION,
        userId: addedSnap.key,
        userData: addedSnap.val()
      })
    })

    Firebase.database().ref(Constants.LIKES_PATH + '/' + threadId).on('child_removed', removedSnap => {
      dispatch({
        type: ActionTypes.THREAD_LIKES_REMOVED_ACTION,
        userId: removedSnap.key
      })
    })
  }
}

export function unloadThreadLikes(threadId) {
  return dispatch => {
    Firebase.database().ref(Constants.LIKES_PATH + '/' + threadId).off()
    dispatch({
      type: ActionTypes.UNLOAD_THREAD_LIKES,
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

export function updateThreadField(auth, threadId, thread, orgName, field, value, userInfo) {
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
        Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdater', pick(userInfo, ['username', 'userId', 'fullName', 'image'])));
      }

      Firebase.database().ref().update(updates);

      Helpers.incrementThreadSeenCounts(auth, thread.orgId, thread.projectId, threadId)

      if (field === 'body') {
        let org = Object.assign({}, {name: orgName})
        let project = Object.assign({}, {projectId: thread.projectId})
        Helpers.findThreadMentions(auth, value, org, project, Object.assign({}, thread, {threadId: threadId}))

        let algoliaObject = Object.assign({}, {body: Helpers.stripImageTags(value) })
        Helpers.updateAlgoliaIndex(threadId, algoliaObject);
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

    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_changed', commentSnap => {
      dispatch(threadCommentChangedAction(threadId, commentSnap.key, commentSnap.val()));
    })

    Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).on('child_removed', commentSnap => {
      dispatch(threadCommentRemovedAction(threadId, commentSnap.key));
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

export function onThreadCommentSubmit(authenticated, userInfo, type, thread, body, threadId, project, orgName, parentId) {
  return dispatch => {
    if(!authenticated) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    const comment = {
      userId: authenticated,
      username: userInfo.username,
      fullName: userInfo.fullName,
      body: body ? body : '',
      lastModified: Firebase.database.ServerValue.TIMESTAMP
    }
    if (userInfo.image) comment.image = userInfo.image;

    if (threadId) {
      let org = Object.assign({}, {orgId: thread.orgId}, {name: orgName})

      let commentObject = Object.assign({}, comment, {threadId: threadId}, { type: type })
      // let commentId = Firebase.database().ref(Constants.COMMENTS_BY_THREAD_PATH + '/' + threadId).push(comment).key;
      let commentId = Firebase.database().ref(Constants.COMMENTS_PATH).push(commentObject).key;

      Helpers.incrementThreadCount(Constants.COMMENTS_COUNT, threadId, thread, thread.userId);
      
      let updates = getThreadFieldUpdates(threadId, thread, 'lastModified', Firebase.database.ServerValue.TIMESTAMP)

      // last update is a comment
      Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdate', Constants.COMMENT_TYPE));

      // update lastUpdater as the commenter
      Object.assign(updates, getThreadFieldUpdates(threadId, thread, 'lastUpdater', pick(userInfo, ['username', 'userId', 'fullName', 'image'])));

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

      Helpers.incrementThreadSeenCounts(authenticated, thread.orgId, thread.projectId, threadId)

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
          // console.log('delete this ' + nestedComment.key)
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
    
    // Helpers.decrementThreadCount(Constants.COMMENTS_COUNT, threadId, thread, thread.userId);

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

export function inviteUsersToOrg(auth, orgName, invites) {
  return dispatch => {
    let updates = {}
    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
      let orgId = orgSnap.val().orgId
      
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
                orgName: lowercaseName,
                orgId: orgSnap.val().orgId,
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

export function loadInvite(auth, inviteId) {
  return dispatch => {
    Firebase.database().ref(Constants.INVITES_PATH + '/' + inviteId).on('value', inviteSnap => {
      if (inviteSnap.exists()) {
        Firebase.database().ref(Constants.USERS_PATH + '/' + inviteSnap.val().senderId).once('value', senderSnap => {
          dispatch({
            type: ActionTypes.INVITE_LOADED,
            invite: inviteSnap.val(),
            sender: senderSnap.val()
          })
        })
      }
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
        Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', userSnap => {
          let cleanedEmail = Helpers.cleanEmailToFirebase(email)
        
          let updates = {}
          // add user to the org and orgs-by-user
          updates[Constants.USERS_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + auth] = Object.assign({}, userSnap.val())
          updates[Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + inviteSnap.val().orgId] = { name: inviteSnap.val().orgName }

          // remove the invites
          updates[Constants.INVITES_PATH + '/' + inviteId + '/status/'] = Constants.ACCEPTED_STATUS
          updates[Constants.INVITED_USERS_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/' + Helpers.cleanEmailToFirebase(email)] = null
          // updates[Constants.INVITES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/users/' + auth] = null
          // updates[Constants.INVITES_BY_ORG_PATH + '/' + inviteSnap.val().orgId + '/emails/' + email] = null

          // remove the inbox item?

          Firebase.database().ref().update(updates)

          dispatch({
            type: ActionTypes.INVITE_ACCEPTED,
            orgName: inviteSnap.val().orgName
          })
        })
      }
    })
  }
}

function updateEndValue(endValue, source) {
  return {
    type: ActionTypes.UPDATE_END_VALUE,
    endValue: endValue ? endValue - 1 : new Date().getTime(),
    source: source
  }
}

function setIsFeedLoading(source) {
  return {
    type: ActionTypes.SET_IS_FEED_LOADING,
    isFeedLoading: true,
    source: source
  }
}

const debounceSetFeedNotLoading = debounce(feedIsNotLoading, 3000);

export function feedIsNotLoading(dispatch, source) {
  dispatch({
    type: ActionTypes.SET_IS_FEED_LOADING,
    isFeedLoading: false,
    source: source
  })
}

export function watchThreadFeed(auth, orgName, projectId, endValue, source) {
  return dispatch => {
    if (auth) {
      dispatch(setIsFeedLoading(source));
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

          if (endValue === null) {
            Firebase.database().ref(path)
              .orderByChild('lastModified')
              .limitToLast(Constants.TIPS_TO_LOAD)
              .on('child_added', threadSnapshot => {
              if (threadSnapshot.val().userId) {
                Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).once('value', userSnap => {
                  let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : Object.assign({}, threadSnapshot.val(), {orgId: orgId})
                  dispatch(threadAddedAction(threadSnapshot.key, thread, userSnap.val(), source));  
                  dispatch(updateEndValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : endValue, source));
                  debounceSetFeedNotLoading(dispatch, source);
                })
              }
            })
          }
          else {
            Firebase.database().ref(path)
              .orderByChild('lastModified')
              .limitToLast(Constants.TIPS_TO_LOAD)
              .endAt(endValue)
              .on('child_added', threadSnapshot => {
              if (threadSnapshot.val().userId) {
                Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).once('value', userSnap => {
                  let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : Object.assign({}, threadSnapshot.val(), {orgId: orgId})
                  dispatch(threadAddedAction(threadSnapshot.key, thread, userSnap.val(), source));  
                  dispatch(updateEndValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : endValue, source));
                  debounceSetFeedNotLoading(dispatch, source);
                })
              }
            })
          }

          // on child changed, how do we unwatch old refs?
          Firebase.database().ref(path)
            .orderByChild('lastModified')
            .on('child_changed', threadSnapshot => {
            if (threadSnapshot.val().userId) {
              // watchUser(dispatch, threadSnapshot.val().userId, Constants.PROJECTS_PAGE)
              Firebase.database().ref(Constants.USERS_PATH + '/' + threadSnapshot.val().userId).once('value', userSnap => {
                let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : Object.assign({}, threadSnapshot.val(), {orgId: orgId})
                dispatch(threadChangedAction(threadSnapshot.key, thread, userSnap.val(), source));
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
        data: snap.val(),
        id: snap.key,
        listType: Constants.ORG_LIST_TYPE,
        source: source
      })
    })
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_changed', snap => {
      dispatch({
        type: ActionTypes.LIST_CHANGED_ACTION,
        data: snap.val(),
        id: snap.key,
        listType: Constants.ORG_LIST_TYPE,
        source: source
      })
    })
    Firebase.database().ref(Constants.ORGS_BY_USER_PATH + '/' + auth).on('child_removed', snap => {
      dispatch({
        type: ActionTypes.LIST_REMOVED_ACTION,
        data: snap.val(),
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
    if (projectId) {
      let updates = {}
      Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).once('value', snap => {
        if (snap.exists()) {
          updates[Constants.THREAD_SEEN_COUNTERS_PATH + '/' + auth + '/' + snap.val().orgId + '/' + projectId] = null
          Firebase.database().ref().update(updates);
        }
      })
    }
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
      if (nameSnap.exists()) {
        Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).on('value', usersSnap => {
          let usersList = []
          usersSnap.forEach(function(user) {
            usersList = usersList.concat(Object.assign({}, { userId: user.key }, user.val()))
          })
          usersList.sort(Helpers.byUsername)

          dispatch({
            type: ActionTypes.ORG_USERS_LOADED,
            usersList: usersList,
            source: source
          })
        })
        // Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).on('child_added', addedSnap => {
        //   dispatch({
        //     type: ActionTypes.USERNAME_ADDED_ACTION,
        //     userId: addedSnap.key,
        //     orgName: orgName,
        //     source: source,
        //     userData: addedSnap.val()
        //   })
        // })

        // Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).on('child_changed', changedSnap => {
        //   dispatch({
        //     type: ActionTypes.USERNAME_CHANGED_ACTION,
        //     userId: changedSnap.key,
        //     orgName: orgName,
        //     source: source,
        //     userData: changedSnap.val()
        //   })
        // })

        // Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).on('child_removed', removedSnap => {
        //   dispatch({
        //     type: ActionTypes.USERNAME_REMOVED_ACTION,
        //     userId: removedSnap.key,
        //     orgName: orgName,
        //     source: source
        //   })
        // })
      }
    })
  }
}

export function unloadOrgUsers(orgName, source) {
  return dispatch => {
    if (orgName) {
      Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgName.toLowerCase()).off()
      Firebase.database().ref(Constants.INVITES_BY_ORG_PATH + '/' + orgName.toLowerCase()).off()

      dispatch({
        type: ActionTypes.UNLOAD_ORG_USERS,
        source
      })
    }
  }
}

export function watchActivityFeed(auth, orgName, endValue, source) {
  return dispatch => {
    if (auth) {
      dispatch(setIsFeedLoading(source));
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

            if (endValue === null) {
              Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId)
                .orderByChild('lastModified')
                .limitToLast(Constants.TIPS_TO_LOAD)
                .on('child_added', activitySnap => {
                  dispatch(activityAddedAction(activitySnap.key, activitySnap.val(), userSnap.val(), source));
                  dispatch(updateEndValue(activitySnap.val().lastModified ? activitySnap.val().lastModified : endValue, source));
                  debounceSetFeedNotLoading(dispatch, source);
              })
            }
            else {
              Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId)
                .orderByChild('lastModified')
                .limitToLast(Constants.TIPS_TO_LOAD)
                .endAt(endValue)
                .on('child_added', activitySnap => {
                  dispatch(activityAddedAction(activitySnap.key, activitySnap.val(), userSnap.val(), source));
                  dispatch(updateEndValue(activitySnap.val().lastModified ? activitySnap.val().lastModified : endValue, source));
                  debounceSetFeedNotLoading(dispatch, source);
              })
            }

            // on child changed, how do we unwatch old refs?
            Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId)
              .orderByChild('lastModified')
              .on('child_changed', activitySnap => {
                dispatch(activityChangedAction(activitySnap.key, activitySnap.val(), userSnap.val(), source));
                dispatch(updateEndValue(activitySnap.val().lastModified ? activitySnap.val().lastModified : endValue, source));
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

export function loadSidebar(mql) {
  return dispatch => {
    dispatch({
      type: ActionTypes.LOAD_SIDEBAR,
      mql: mql
    })
  }
}

export function setSidebarOpen() {
  return dispatch => {
    dispatch({
      type: ActionTypes.SET_SIDEBAR_OPEN,
      open: true,
    })
  }
}

export function setSidebar(mql) {
  return dispatch => {
    dispatch({
      type: ActionTypes.SET_SIDEBAR,
      sidebarOpen: mql
    })
  }
}

export function onAllProjectsClick(orgName) {
  return dispatch => {
    dispatch ({
      type: ActionTypes.ON_ALL_PROJECTS_CLICK,
      orgName: orgName
    })
  }
}

export function loadAddThreadProject(pid) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECTS_PATH + '/' + pid).once('value', snap => {
      dispatch({
        type: ActionTypes.LOAD_ADD_THREAD_PROJECT,
        projectId: pid,
        projectName: snap.exists() ? snap.val().name : 'Click to select'
      })
    })
  }
}

export function changeAddThreadProject(projectId, projectName) {
  return dispatch => {
    dispatch({
      type: ActionTypes.CHANGE_ADD_THREAD_PROJECT,
      projectId: projectId,
      projectName: projectName
    })
  }
}

export function loadProjectMembers(projectId, orgName, source) {
  return dispatch => {
    if (!projectId) {
      // load all org members
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
        Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgSnap.val().orgId).on('child_added', addedSnap => {
          dispatch({
            type: ActionTypes.PROJECT_MEMBER_ADDED,
            userId: addedSnap.key,
            userData: addedSnap.val(),
            source: source
          })  
        })

        Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgSnap.val().orgId).on('child_changed', changedSnap => {
          dispatch({
            type: ActionTypes.PROJECT_MEMBER_CHANGED,
            userId: changedSnap.key,
            userData: changedSnap.val(),
            source: source
          })  
        })

        Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgSnap.val().orgId).on('child_removed', removedSnap => {
          dispatch({
            type: ActionTypes.PROJECT_MEMBER_REMOVED,
            userId: removedSnap.key,
            source: source
          })  
        })
      })
    }
    else {
      // load members of the project
      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('child_added', addedSnap => {
        dispatch({
          type: ActionTypes.PROJECT_MEMBER_ADDED,
          userId: addedSnap.key,
          userData: addedSnap.val(),
          source: source
        })  
      })

      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('child_changed', changedSnap => {
        dispatch({
          type: ActionTypes.PROJECT_MEMBER_CHANGED,
          userId: changedSnap.key,
          userData: changedSnap.val(),
          source: source
        })  
      })

      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('child_removed', removedSnap => {
        dispatch({
          type: ActionTypes.PROJECT_MEMBER_REMOVED,
          userId: removedSnap.key,
          source: source
        })  
      })
    }
  }
}

export function unloadProjectMembers(projectId, orgName, source) {
  return dispatch => {
    if (!projectId) {
      // load all org members
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
        Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgSnap.val().orgId).off()
      })
    }
    else {
      // load members of the project
      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).off()
    }

    dispatch({
      type: ActionTypes.UNLOAD_PROJECT_MEMBERS
    })
  }
}

export function loadProjectMemberCheck(projectId) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('value', snap => {
      dispatch({
        type: ActionTypes.LOAD_PROJECT_MEMBER_CHECK,
        payload: snap.val(),
      })  
    })
  }
}

export function unloadProjectMemberCheck(projectId) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).off();
    dispatch({
      type: ActionTypes.UNLOAD_PROJECT_MEMBER_CHECK,
    })  
  }
}

export function changeOrgSettingsTab(tab, orgName) {
  return dispatch => {
    if (tab === Constants.MEMBERS_TAB) {
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', nameSnap => {
        if (nameSnap.exists()) {
          // stop watching previous paths
          Firebase.database().ref(Constants.INVITES_BY_ORG_PATH + '/' + nameSnap.val().orgId).off()
          Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + nameSnap.val().orgId).off()

          // then watch the members in this org
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).on('value', usersSnap => {
            let usersList = []
            usersSnap.forEach(function(user) {
              usersList = usersList.concat(Object.assign({}, { userId: user.key }, user.val()))
            })
            dispatch({
              type: ActionTypes.CHANGE_ORG_SETTINGS_TAB,
              tab: Constants.MEMBERS_TAB,
              payload: usersList
            })
          })
        }
      })
    }
    // else get the invited users
    else if (tab === Constants.PENDING_TAB) {
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', nameSnap => {
        if (nameSnap.exists()) {
          // stop watching members list and projects list
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).off()
          Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + nameSnap.val().orgId).off()

          // then watch the members in this org
          Firebase.database().ref(Constants.INVITED_USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).on('value', usersSnap => {
            let usersList = []
            usersSnap.forEach(function(user) {
              usersList = usersList.concat(Object.assign({}, { email: Helpers.cleanEmailFromFirebase(user.key) }, user.val()))
            })
            dispatch({
              type: ActionTypes.CHANGE_ORG_SETTINGS_TAB,
              tab: Constants.PENDING_TAB,
              payload: usersList
            })
          })
        }
      })
    }
    else if (tab === Constants.LISTS_TAB) {
      Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', nameSnap => {
        if (nameSnap.exists()) {
          // stop watching members list and invites list
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).off()
          Firebase.database().ref(Constants.INVITES_BY_ORG_PATH + '/' + nameSnap.val().orgId).off()

          // then watch the members in this org
          Firebase.database().ref(Constants.INVITED_USERS_BY_ORG_PATH + '/' + nameSnap.val().orgId).on('value', usersSnap => {
            let usersList = []
            usersSnap.forEach(function(user) {
              usersList = usersList.concat(Object.assign({}, { email: Helpers.cleanEmailFromFirebase(user.key) }, user.val()))
            })
            dispatch({
              type: ActionTypes.CHANGE_ORG_SETTINGS_TAB,
              tab: Constants.LISTS_TAB,
              payload: usersList
            })
          })
        }
      })
    }
  }
}

export function changeProjectSettingsTab(tab, projectId) {
  return dispatch => {
    if (tab === Constants.MEMBERS_TAB) {
      // stop watching previous path
      Firebase.database().ref(Constants.INVITES_BY_PROJECT_PATH + '/' + projectId).off()

      // then watch the members in this org
      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('value', usersSnap => {
        let usersList = []
        usersSnap.forEach(function(user) {
          usersList = usersList.concat(Object.assign({}, { userId: user.key }, user.val()))
        })
        dispatch({
          type: ActionTypes.CHANGE_PROJECT_SETTINGS_TAB,
          tab: Constants.MEMBERS_TAB,
          usersList: usersList
        })
      })
    }
    // else get the invited users
    else {
      // stop watching members list
      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).off()

      // then watch the members in this org
      Firebase.database().ref(Constants.INVITED_USERS_BY_PROJECT_PATH + '/' + projectId).on('value', usersSnap => {
        let usersList = []
        usersSnap.forEach(function(user) {
          usersList = usersList.concat(Object.assign({}, { email: Helpers.cleanEmailFromFirebase(user.key) }, user.val()))
        })
        dispatch({
          type: ActionTypes.CHANGE_PROJECT_SETTINGS_TAB,
          tab: Constants.PENDING_TAB,
          usersList: usersList
        })
      })
    }
  }
}

export function inviteOrgUsersToProject(auth, orgName, projectId, invites) {
  return dispatch => {
    if (invites && invites.length > 0) {
      Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', authSnap => {
        Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName).once('value', orgSnap => {
          Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgSnap.val().orgId).once('value', orgUsersSnap => {
            Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).once('value', projectUsersSnap => {
              let orgUsers = orgUsersSnap.val()
              let projectUsers = projectUsersSnap.val()
              let updates = {}
              for (let i = 0; i < invites.length; i++) {
                // if user is an org member but not in the project, invite them
                if ((orgUsers && orgUsers[invites[i]]) && (!projectUsers || !projectUsers[invites[i]])) {
                  // create the project invite
                  let inviteObject = {
                    senderId: auth,
                    recipientId: invites[i],
                    timestamp: Firebase.database.ServerValue.TIMESTAMP,
                    orgId: orgSnap.val().orgId,
                    orgName: orgName
                  }

                  let inviteId = Firebase.database().ref(Constants.PROJECT_INVITES_PATH).push(inviteObject).key

                  // add to project invites by user
                  updates[Constants.PROJECT_INVITES_BY_USER_PATH + '/' + invites[i] + '/' + inviteId] = 
                    Object.assign({}, omit(inviteObject, ['recipientId']))

                  // add to pending invite list for the project
                  updates[Constants.INVITED_USERS_BY_PROJECT_PATH + '/' + projectId + '/' + invites[i]] = 
                    Object.assign({}, 
                      { senderId: auth }, 
                      { senderUsername:  authSnap.val().username },
                      { timestamp: Firebase.database.ServerValue.TIMESTAMP })
                }
              }
              Firebase.database().ref().update(updates)

              // send invites to users

              dispatch({
                type: ActionTypes.INVITED_USERS_TO_PROJECT,
                orgName,
                projectId
              })
            })
          })
        })
      })
    }
  }
}

// export function loadLikesByUser(auth, orgName) {
//   return dispatch => {
//     Firebase.database()).ref(Constants.ORGS_BY_NAME_PATH + '/' + orgName.toLowerCase()).once('value', orgSnap => {
//       if (orgSnap.exists()) {
//         Firebase.database().ref(Constants.LIKES_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgSnap.val().orgId).on('child_added', likesSnap => {
//           dispatch({
//             type: ActionTypes.LIKES_BY_USER_ADDED_ACTION,
//             id: likesSnap.key
//           })
//         })

//         Firebase.database().ref(Constants.LIKES_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgSnap.val().orgId).on('child_removed', likesSnap => {
//           dispatch({
//             type: ActionTypes.LIEKS_BY_USER_REMOVED_ACTION,
//             id: likesSnap.key
//           })
//         })
//       }
//     })
//   }
// }