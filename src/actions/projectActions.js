import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import { watchUser, unwatchUser, findCommentMentions } from './index'
import mixpanel from 'mixpanel-browser'
import 'whatwg-fetch';
import { pick, omit, debounce } from 'lodash'

export function onAddProject(auth, project, orgURL) {
  return dispatch => {
    if (!auth) {
      dispatch({
        type: ActionTypes.ASK_FOR_AUTH
      })
    }
    else {

      let lowerCaseProject = project.name.toLowerCase()
      let lowerCaseOrgURL = orgURL.toLowerCase()
      Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
        Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + orgSnap.val().orgId + '/' + lowerCaseProject).once('value', nameSnapshot => {
          if (nameSnapshot.exists()) {
            dispatch({
              type: ActionTypes.CREATE_SUBMIT_ERROR,
              error: 'A project called "' + project.name + '" already exists. Please choose another name',
              source: Constants.ADD_PROJECT_PAGE
            })
          }
          else {
            Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgSnap.val().orgId).once('value', orgUsersSnap => {
              let serverTimestamp = Firebase.database.ServerValue.TIMESTAMP;
              let projectObject = {
                lastModified: serverTimestamp,
                createdOn: serverTimestamp,
                orgId: orgSnap.val().orgId
              }
              let updates = {};
              Object.assign(projectObject, project)

              let projectId = Firebase.database().ref(Constants.PROJECTS_PATH).push(projectObject).key;

              updates[`/${Constants.PROJECT_NAMES_BY_ORG_PATH}/${orgSnap.val().orgId}/${project.name}/`] = projectId
              updates[`/${Constants.PROJECTS_BY_ORG_PATH}/${orgSnap.val().orgId}/${projectId}/`] = Object.assign({}, {name: project.name}, {isPublic: project.isPublic})
              // updates[`/${Constants.PROJECTS_BY_USER_PATH}/${auth}/${projectId}/`] = { name: project.name };

              // add the project to the creators Project List
              updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${orgSnap.val().orgId}/${auth}/${projectId}/`] = Object.assign({}, {isPublic: project.isPublic});
              updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectId}/${auth}/`] = true

              let usersList = []
              let projectMemberCheck = {}
              projectMemberCheck[auth] = true

              // if project is public, add it to everyone's project list
              if (project.isPublic) {
                orgUsersSnap.forEach(function(user) {
                  updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${orgSnap.val().orgId}/${user.key}/${projectId}/`] = Object.assign({}, {isPublic: project.isPublic});
                  updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectId}/${user.key}/`] = true
                })
              }
              // else if private, create usersList to pass to ProjectInvite modal
              else {
                orgUsersSnap.forEach(function(user) {
                usersList = usersList.concat(Object.assign({}, { userId: user.key }, user.val()))
                })
                usersList.sort(Helpers.byUsername)
              }

              Firebase.database().ref().update(updates);

              dispatch({
                type: ActionTypes.PROJECT_CREATED,
                project: projectObject,
                projectId: projectId,
                orgURL: orgURL,
                orgId: orgSnap.val().orgId,
                usersList: usersList,
                projectMemberCheck: projectMemberCheck,
                isPublic: project.isPublic,
                meta: {
                  mixpanel: {
                    event: 'Created new project',
                    source: Constants.ADD_PROJECT_PAGE,
                    projectId: projectId,
                    orgId: orgSnap.val().orgId,
                    isPublic: project.isPublic ? 'public' : 'private'
                  }
                }
              })
            })
          }
        })
      })
    }
  }
}

export function loadProject(projectId, orgId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).on('value', projectSnapshot => {
      if (projectSnapshot.exists()) {
        // make sure project's org matches whats in the url
        if (orgId === projectSnapshot.val().orgId) {
          dispatch({
            type: ActionTypes.LOAD_PROJECT,
            project: projectSnapshot.val(),
            projectId: projectId,
            source: source
          })
        }
        else {
          Firebase.database().ref(Constants.ORGS_PATH + '/' + projectSnapshot.val().orgId).once('value', correctOrgSnap => {
            if (correctOrgSnap.exists()) {
              // if not, then redirect to correct org
              dispatch({
                type: ActionTypes.ORG_PROJECT_MISMATCH,
                projectId: projectId,
                orgURL: correctOrgSnap.val().url
              })
            }
            // if we cant find the correct org, give an error
            else {
              dispatch({
                type: ActionTypes.PROJECT_NOT_FOUND_ERROR,
                source: source
              })
            }
          }) 
        }
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

export function unloadProject(projectId, orgId, source) {
  return dispatch => {
    if (projectId) {
      Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).off()
    }
    else {
      Firebase.database().ref(Constants.ORGS_PATH + '/' + orgId).off()
    }
  }
}

function threadAddedAction(threadId, thread, source) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.THREAD_ADDED_ACTION,
    threadId,
    thread,
    source
  }
}

function threadChangedAction(threadId, thread, source) {
  // delete thread.lastModified;
  return {
    type: ActionTypes.THREAD_CHANGED_ACTION,
    threadId,
    thread,
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

export function loadProjectList(auth, orgId, projectId, source) {
  return dispatch => {
    dispatch({
      type: ActionTypes.LOAD_PROJECT_LIST,
      projectId: projectId,
      source: source
    })

    Firebase.database().ref(Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + orgId + '/' + auth).on('child_added', snap => {
      dispatch({ 
        type: ActionTypes.LIST_ADDED_ACTION,
        id: snap.key,
        data: snap.val(),
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })

    Firebase.database().ref(Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + orgId + '/' + auth).on('child_changed', snap => {
      dispatch({
        type: ActionTypes.LIST_CHANGED_ACTION,
        id: snap.key,
        data: snap.val(),
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })

    Firebase.database().ref(Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + orgId + '/' + auth).on('child_removed', snap => {
      dispatch({
        type: ActionTypes.LIST_REMOVED_ACTION,
        id: snap.key,
        listType: Constants.PROJECT_LIST_TYPE,
        source: source
      })
    })
  }
}

export function loadProjectNames(orgId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + orgId).on('value', projectsSnap => {
      if (projectsSnap.exists()) {
        let projectNames = {}
        projectsSnap.forEach(function(project) {
          projectNames[project.key] = Object.assign({}, project.val())
        })
        dispatch({
          type: ActionTypes.LOAD_PROJECT_NAMES,
          projectNames: projectNames,
          source
        })
      }
    })
  }
}

export function unloadProjectNames(orgId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + orgId).off()
  }
}

export function unloadProjectList(auth, orgId, source) {
  return dispatch => {
     Firebase.database().ref(Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + orgId + '/' + auth).off()
     dispatch({
      type: ActionTypes.UNLOAD_PROJECT_LIST,
      source
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

export function watchThreadFeed(auth, orgURL, projectId, endValue, source) {
  return dispatch => {
    if (auth) {
      dispatch(setIsFeedLoading(source));
      Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + orgURL.toLowerCase()).once('value', orgSnap => {
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

          // if this is the first load, there's no endValue
          if (endValue === null) {
            Firebase.database().ref(path)
              .orderByChild('lastModified')
              .limitToLast(Constants.TIPS_TO_LOAD)
              .on('child_added', threadSnapshot => {
              if (threadSnapshot.val().lastUpdater) {
                let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : Object.assign({}, threadSnapshot.val(), {orgId: orgId})
                dispatch(threadAddedAction(threadSnapshot.key, thread, source));  
                dispatch(updateEndValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : endValue, source));
                debounceSetFeedNotLoading(dispatch, source);
              }
            })
          }
          else {
            Firebase.database().ref(path)
              .orderByChild('lastModified')
              .limitToLast(Constants.TIPS_TO_LOAD)
              .endAt(endValue)
              .on('child_added', threadSnapshot => {
              if (threadSnapshot.val().lastUpdater) {
                let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : Object.assign({}, threadSnapshot.val(), {orgId: orgId})
                dispatch(threadAddedAction(threadSnapshot.key, thread, source));  
                dispatch(updateEndValue(threadSnapshot.val().lastModified ? threadSnapshot.val().lastModified : endValue, source));
                debounceSetFeedNotLoading(dispatch, source);
              }
            })
          }

          // on child changed, how do we unwatch old refs?
          Firebase.database().ref(path)
            .orderByChild('lastModified')
            .on('child_changed', threadSnapshot => {
            if (threadSnapshot.val().lastUpdater) {
              let thread = projectId ? Object.assign({}, threadSnapshot.val(), {projectId: projectId}) : Object.assign({}, threadSnapshot.val(), {orgId: orgId})
              dispatch(threadChangedAction(threadSnapshot.key, thread, source));
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

export function unwatchThreadFeed(auth, orgId, projectId, source) {
  return dispatch => {
    let path = projectId ? (Constants.THREADS_BY_PROJECT_PATH + '/' + projectId) : 
      (Constants.THREADS_BY_ORG_PATH + '/' + orgId)

    Firebase.database().ref(path).off()

    dispatch({
      type: ActionTypes.UNWATCH_THREAD_FEED,
      source: source
    })
  }
}

export function setEditMode(mode, source) {
  return dispatch => {
    dispatch({
      type:ActionTypes.SET_EDIT_MODE,
      editMode: mode,
      source
    })
  }
}

export function markProjectRead(auth, projectId) {
  return dispatch => {
    if (projectId) {
      let updates = {}
      Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).once('value', snap => {
        if (snap.exists()) {
          updates[Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + auth + '/' + snap.val().orgId + '/' + projectId] = null
          Firebase.database().ref().update(updates);
        }
      })
    }
  }
}

export function watchActivityFeed(auth, orgId, endValue, source) {
  return dispatch => {
    if (auth) {
      dispatch(setIsFeedLoading(source));
      Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth).once('value', userSnap => {
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
  }
}

export function unwatchActivityFeed(auth, orgId, source) {
  return dispatch => {
    Firebase.database().ref(Constants.ACTIVITY_BY_USER_BY_ORG_PATH + '/' + auth + '/' + orgId).off()

    dispatch({
      type: ActionTypes.UNWATCH_ACTIVITY_FEED,
      source: source
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

export function onAllProjectsClick(orgURL) {
  return dispatch => {
    dispatch ({
      type: ActionTypes.ON_ALL_PROJECTS_CLICK,
      orgURL: orgURL
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

export function loadProjectMembers(projectId, source) {
  return dispatch => {
    // load members of the project
    Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('child_added', addedSnap => {
      // Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + addedSnap.key).once('value', userSnap => {
        dispatch({
          type: ActionTypes.PROJECT_MEMBER_ADDED,
          userId: addedSnap.key,
          // userData: userSnap.val(),
          // membersList: Constants.PROJECT_MEMBERS_LIST,
          source: source
        })
      // })
    })

    // Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('child_changed', changedSnap => {
    //   dispatch({
    //     type: ActionTypes.PROJECT_MEMBER_CHANGED,
    //     userId: changedSnap.key,
    //     userData: changedSnap.val(),
    //     source: source
    //   })
    // })

    Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('child_removed', removedSnap => {
      dispatch({
        type: ActionTypes.PROJECT_MEMBER_REMOVED,
        userId: removedSnap.key,
        // membersList: Constants.PROJECT_MEMBERS_LIST,
        source: source
      })  
    })
  }
}

export function loadOrgMembers(orgId, source) {
  return dispatch => {
    // load all org members
    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).on('child_added', addedSnap => {
      dispatch({
        type: ActionTypes.ORG_MEMBER_ADDED,
        userId: addedSnap.key,
        userData: addedSnap.val(),
        // membersList: Constants.ORG_MEMBERS_LIST,
        source: source
      })
    })

    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).on('child_changed', changedSnap => {
      dispatch({
        type: ActionTypes.ORG_MEMBER_CHANGED,
        userId: changedSnap.key,
        userData: changedSnap.val(),
        source: source
      })  
    })

    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).on('child_removed', removedSnap => {
      dispatch({
        type: ActionTypes.ORG_MEMBER_REMOVED,
        userId: removedSnap.key,
        // membersList: Constants.ORG_MEMBERS_LIST,
        source: source
      })  
    })
  }
}

export function unloadProjectMembers(projectId, source) {
  return dispatch => {
    // load members of the project
    Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).off()

    dispatch({
      type: ActionTypes.UNLOAD_PROJECT_MEMBERS,
      source
    })
  }
}

export function unloadOrgMembers(orgId, source) {
  return dispatch => {
      // unload all org members
      Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).off()

      dispatch({
        type: ActionTypes.UNLOAD_ORG_MEMBERS,
        source
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

export function changeOrgSettingsTab(tab, orgId) {
  return dispatch => {
    if (orgId) {
      if (tab === Constants.MEMBERS_TAB) {
        // stop watching previous paths
        Firebase.database().ref(Constants.INVITED_USERS_BY_ORG_PATH + '/' + orgId).off()
        Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + orgId).off()

        // then watch the members in this org
        // Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' +orgId).on('value', usersSnap => {
          // let usersList = []
          // usersSnap.forEach(function(user) {
          //   usersList = usersList.concat(Object.assign({}, { userId: user.key }, user.val()))
          // })
          dispatch({
            type: ActionTypes.CHANGE_ORG_SETTINGS_TAB,
            tab: Constants.MEMBERS_TAB,
            payload: []
          })
        // })
      }
      // else get the invited users
      else if (tab === Constants.PENDING_TAB) {
        // stop watching projects list
        Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + orgId).off()

        // then watch the invited users
        Firebase.database().ref(Constants.INVITED_USERS_BY_ORG_PATH + '/' + orgId).on('value', usersSnap => {
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
      else if (tab === Constants.LISTS_TAB) {
        // stop watching invites list
        Firebase.database().ref(Constants.INVITED_USERS_BY_ORG_PATH + '/' + orgId).off()

        // then watch the members in this org
        Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + orgId).on('value', projectSnap => {
          let payload = []
          projectSnap.forEach(function(project) {
            payload = payload.concat(Object.assign({}, {projectId: project.key}, project.val()))
          })
          dispatch({
            type: ActionTypes.CHANGE_ORG_SETTINGS_TAB,
            tab: Constants.LISTS_TAB,
            payload: payload
          })
        })
      }
      else if (tab === Constants.MANAGE_TAB) {
        dispatch({
          type: ActionTypes.CHANGE_ORG_SETTINGS_TAB,
          tab: Constants.MANAGE_TAB,
        })
      }
    }
  }
}

export function changeProjectSettingsTab(tab, projectId) {
  return dispatch => {
    dispatch({
      type: ActionTypes.CHANGE_PROJECT_SETTINGS_TAB,
      tab: tab
    })

    // if (tab === Constants.MEMBERS_TAB) {
    //   // stop watching previous path
    //   Firebase.database().ref(Constants.INVITES_BY_PROJECT_PATH + '/' + projectId).off()

    //   // then watch the members in this org
    //   Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).on('value', usersSnap => {
    //     let usersList = []
    //     usersSnap.forEach(function(user) {
    //       usersList = usersList.concat(Object.assign({}, { userId: user.key }, user.val()))
    //     })
    //     dispatch({
    //       type: ActionTypes.CHANGE_PROJECT_SETTINGS_TAB,
    //       tab: Constants.MEMBERS_TAB,
    //       usersList: usersList
    //     })
    //   })
    // }
    // // else get the invited users
    // else {
    //   // stop watching members list
    //   Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).off()

    //   // then watch the members in this org
    //   Firebase.database().ref(Constants.INVITED_USERS_BY_PROJECT_PATH + '/' + projectId).on('value', usersSnap => {
    //     let usersList = []
    //     usersSnap.forEach(function(user) {
    //       usersList = usersList.concat(Object.assign({}, { email: Helpers.cleanEmailFromFirebase(user.key) }, user.val()))
    //     })
    //     dispatch({
    //       type: ActionTypes.CHANGE_PROJECT_SETTINGS_TAB,
    //       tab: Constants.PENDING_TAB,
    //       usersList: usersList
    //     })
    //   })
    // }
  }
}

export function showProjectSettingsModal(projectId, project, projectMembers, orgURL, tab) {
  return dispatch => {
    changeProjectSettingsTab(tab)

    dispatch({
      type: ActionTypes.SHOW_PROJECT_SETTINGS_MODAL,
      projectId,
      project,
      projectMembers,
      orgURL
    })
  }
}

export function leaveProject(auth, userInfo, orgId, project) {
  return dispatch => {
    let updates = {}
    updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${orgId}/${auth}/${project.projectId}/`] = null
    updates[`/${Constants.USERS_BY_PROJECT_PATH}/${project.projectId}/${auth}/`] = null

    // remove unread thread counts for the project
    updates[`/${Constants.UNREAD_THREAD_COUNTERS_PATH}/${auth}/${orgId}/${project.projectId}/`] = null
    
    Firebase.database().ref().update(updates)
  }
}

export function joinProject(auth, userInfo, orgId, project) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).once('value', orgSnap => {
      if (!orgSnap.exists()) {
        // user isn't in org so they can't join
      }
      else {
        let updates = {}
        updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${orgId}/${auth}/${project.projectId}/`] = Object.assign({}, pick(project, ['name', 'isPublic']));
        updates[`/${Constants.USERS_BY_PROJECT_PATH}/${project.projectId}/${auth}/`] = true
        // updates[`/${Constants.USERS_BY_PROJECT_PATH}/${project.projectId}/${auth}/`] = Object.assign({}, userInfo);

        // also remove them from pending invites list
        updates[`/${Constants.INVITED_USERS_BY_PROJECT_PATH}/${project.projectId}/${auth}/`] = null
        
        Firebase.database().ref().update(updates)
      }
    })
  }
}

export function resetVerificationPage() {
  return dispatch => {
    dispatch({
      type: ActionTypes.RESET_VERIFICATION_PAGE
    })
  }
}

export function updateProjectName(auth, projectId, project, newName) {
  return dispatch => {
    let lowercaseName = newName.toLowerCase()
    Firebase.database().ref(Constants.PROJECTS_PATH + '/' + projectId).once('value', projectSnap => {
      Firebase.database().ref(Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + project.orgId + '/' + lowercaseName).once('value', nameSnap => {
        if (!projectSnap.exists()) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'Sorry, we couldn\'t find this project',
            source: Constants.PROJECT_SETTINGS_MODAL
          })
        }
        else if (newName === project.name) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'You entered the same project name',
            source: Constants.PROJECT_SETTINGS_MODAL
          })
        }
        else if (nameSnap.exists()) {
          dispatch({
            type: ActionTypes.CREATE_SUBMIT_ERROR,
            error: 'Sorry, the project name ' + newName + ' already exists. Please choose another project name.',
            source: Constants.PROJECT_SETTINGS_MODAL
          })
        }
        else {
          let updates = {}
          let oldName = project.name.toLowerCase()

          updates[Constants.PROJECTS_PATH + '/' + projectId + '/name'] = newName
          updates[Constants.PROJECTS_BY_ORG_PATH + '/' + project.orgId + '/' + projectId + '/name'] = newName
          updates[Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + project.orgId + '/' + oldName] = null
          updates[Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + project.orgId + '/' + lowercaseName] = projectId

          Firebase.database().ref().update(updates)

          dispatch({
            type: ActionTypes.PROJECT_SETTINGS_UPDATED
          })
        }
      })
    })
  }
}

export function onToggleDeleteProjectMode(key) {
  return dispatch => {
    dispatch({
      type: ActionTypes.TOGGLE_DELETE_PROJECT_MODE,
      key
    })
  }
}

export function deleteProject(auth, projectId, project, orgURL) {
  return dispatch => {
    Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + project.orgId + '/' + auth).once('value', orgSnap => {
      Firebase.database().ref(Constants.USERS_BY_PROJECT_PATH + '/' + projectId).once('value', usersSnap => {
        Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + projectId).once('value', threadsSnap => {
          // make sure user is at least an admin of the org and a member of the project
          if (orgSnap.exists() && orgSnap.val().role <= Constants.ADMIN_ROLE && usersSnap.exists() && usersSnap.val()[auth]) {
            let updates = {}
            updates[Constants.PROJECTS_PATH + '/' + projectId] = null
            updates[Constants.PROJECTS_BY_ORG_PATH + '/' + project.orgId + '/' + projectId] = null
            updates[Constants.PROJECT_NAMES_BY_ORG_PATH + '/' + project.orgId + '/' + project.name.toLowerCase()] = null
            updates[Constants.USERS_BY_PROJECT_PATH + '/' + projectId] = null
            updates[Constants.THREADS_BY_PROJECT_PATH + '/' + projectId] = null

            // remove all threads
            if (threadsSnap.exists()) {
              Helpers.deleteThreadData(threadsSnap.val())
            }
            
            let itemsProcessed = 0
            // loop through users by project, delete projects_by_org_by_user
            usersSnap.forEach(function(user) {
              updates[Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + project.orgId + '/' + user.key + '/' + projectId] = null
              itemsProcessed++;

              if (itemsProcessed === usersSnap.numChildren()) {
                Firebase.database().ref().update(updates)

                dispatch({
                  type: ActionTypes.PROJECT_DELETED,
                  orgURL: orgURL,
                  projectName: project.name
                })
              }
            })
          }
        })
      })
    })
  }
}

export function toggleListView(showListView) {
  return dispatch => {
    dispatch({
      type: ActionTypes.TOGGLE_LIST_VIEW,
      showListView
    })
  }
}