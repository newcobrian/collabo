import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from './FirebaseSearchInput';
import UniversalSearchBar from './UniversalSearchBar';
import LoadingSpinner from './LoadingSpinner';
import ProfilePic from './ProfilePic';
import DisplayTimestamp from './DisplayTimestamp';
import RenderDebounceInput from './RenderDebounceInput';
import CommentContainer from './Review/CommentContainer';
import ProjectList from './ProjectList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
// import { Editor } from 'react-draft-wysiwyg';
// import { convertToRaw, convertFromRaw } from 'draft-js';
// import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import draftToHtml from 'draftjs-to-html';
import LoggedOutMessage from './LoggedOutMessage';
import OrgHeader from './OrgHeader';
import Sidebar from 'react-sidebar';
import LikeReviewButton from './LikeReviewButton';
import RichTextEditor from './RichTextEditor';
import InvalidOrg from './InvalidOrg'
import ThreadBody from './ThreadBody'
import ProjectHeader from './ProjectHeader'

const mql = window.matchMedia(`(min-width: 800px)`);

var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  ...state.thread,
  // googleDocs: state.review.googleDocs,
  // updates: state.firebase.data.updates,
  userInfo: state.common.userInfo,
  org: state.projectList.org,
  authenticated: state.common.authenticated,
  invalidOrgUser: state.common.invalidOrgUser,
  sidebarOpen: state.common.sidebarOpen,
  // userId: state.firebase.auth.uid
})

const mapDispatchToProps = {
  setSidebar: Actions.setSidebar,
  setSidebarOpen: Actions.setSidebarOpen,
  showProjectInviteModal: Actions.showProjectInviteModal,
  showOrgInviteModal: Actions.showOrgInviteModal,
  loadSidebar: Actions.loadSidebar,
  loadOrg: Actions.loadOrg,
  loadOrgUser: Actions.loadOrgUser,
  unloadOrgUser: Actions.unloadOrgUser,
  loadProjectList: Actions.loadProjectList,
  loadThreadCounts: Actions.loadThreadCounts,
  loadOrgList: Actions.loadOrgList,
  loadProjectNames: Actions.loadProjectNames,
  loadProject: Actions.loadProject,
  loadProjectMembers: Actions.loadProjectMembers,
  loadOrgMembers: Actions.loadOrgMembers,
  sendMixpanelEvent: Actions.sendMixpanelEvent,
  unloadProjectNames: Actions.unloadProjectNames,
  unloadOrgList: Actions.unloadOrgList,
  unloadThreadCounts: Actions.unloadThreadCounts,
  unloadProjectList: Actions.unloadProjectList,
  unloadOrg: Actions.unloadOrg,
  unloadProjectMembers: Actions.unloadProjectMembers,
  unloadOrgMembers: Actions.unloadOrgMembers,
  setAuthRedirect: Actions.setAuthRedirect,
  notAnOrgUserError: Actions.notAnOrgUserError,
  updateThreadField: Actions.updateThreadField,
  onUpdateCreateField: Actions.onUpdateCreateField,
  changeEditorState: Actions.changeEditorState,
  setEditMode: Actions.setEditMode,
  showDeleteModal: Actions.showDeleteModal,
  loadThread: Actions.loadThread,
  loadThreadLikes: Actions.loadThreadLikes,
  watchThreadComments: Actions.watchThreadComments,
  unloadThread: Actions.unloadThread,
  unloadThreadLikes: Actions.unloadThreadLikes,
  unwatchThreadComments: Actions.unwatchThreadComments,
  markThreadRead: Actions.markThreadRead,
  onDeleteThreadComment: Actions.onDeleteThreadComment,
  loadThreadAttachments: Actions.loadThreadAttachments,
  unloadThreadAttachments: Actions.unloadThreadAttachments,
  changeTab: Actions.changeTab,
  deleteAttachmentFile: Actions.deleteAttachmentFile,
  sortFiles: Actions.sortFiles
}

class Thread extends React.Component {
  constructor() {
    super();

    this.searchInputCallback = result => {
      if (result.placeId) {
        browserHistory.push('/thread/' + result.threadId);
      }
    }

    // const updateThreadFieldEvent = (field, value, thread) =>
    //   this.props.updateThreadField(this.props.authenticated, this.props.params.tid, thread, this.props.params.org, field, value)

    // this.saveBody = thread => ev => {
    //   ev.preventDefault()
    //   // let storableBody = Helpers.convertEditorStateToStorable(this.props.bodyText)
    //   updateThreadFieldEvent('body', this.props.bodyText, thread)
    //   // this.props.updateThreadField(this.props.authenticated, this.props.params.tid, thread, field, value)
    // }

    // this.updateText = value => {
    //   this.props.onUpdateCreateField('bodyText', value, Constants.THREAD_PAGE)
    // }

    // this.onEditorStateChange = (editorState) => {
    //   this.props.changeEditorState(editorState)
    // }

    // this.onEditClick = mode => ev => {
    //   ev.preventDefault()
    //   this.props.setEditMode(mode, Constants.THREAD_PAGE)
    // }

    // this.onDeleteClick = ev => {
    //   ev.preventDefault()
    //   this.props.showDeleteModal(this.props.params.tid, this.props.thread, this.props.params.orgurl, Constants.THREAD_PAGE)
    // }

    // this.onGoBackClick = ev => {
    //   ev.preventDefault();
    //   browserHistory.goBack()
    // }

    // this.onProjectInviteClick = (project) => {
    //   this.props.showProjectInviteModal(this.props.thread.projectId, this.props.project, this.props.orgId, this.props.org, this.props.orgMembers)
    // }

    // this.renderState = (update) => {
    //   if (!update) {
    //     return null;
    //   }
    //   let message = "";
    //   const state = update.state;
    //   const changed = update.changed;
    //   if (changed && changed.indexOf("permissions") !== -1) {
    //     message = "changed permission of";
    //   } else {
    //     if (state === "add") {
    //       message = "created or shared";
    //     } else if (state === "remove") {
    //       message = "deleted or unshared";
    //     } else if (state === "update") {
    //       message = "updated";
    //     } else if (state === "trash") {
    //       message = "trashed";
    //     } else if (state === "untrash") {
    //       message = "untrashed";
    //     } else if (state === "change") {
    //       message = "changed";
    //     }
    //   }
    //   return message;
    // }

    // this.renderChanges = (updates, userId, comments, threadId, docs) => {
    //   const fileIds = Helpers.getFileIds(comments || []);
    //   if (updates && threadId && updates[threadId] && updates[threadId].length > 0) {
    //     return updates[threadId]
    //       .filter((update) => fileIds.indexOf(update.fileId) !== -1)
    //       .map((u, i) => {
    //         if (u.added && u.threadId === threadId) {
    //           return (
    //             <div key={i}>
    //               {u.userInfo.username} added {(docs && docs[u.fileId]) ? docs[u.fileId].meta.name : "a file"}
    //             </div>  
    //           )
    //         }
    //         if (!u.added) {
    //           return (
    //             <div key={i}>
    //               {u.lastModifyingUser ? u.lastModifyingUser.displayName : "Anonymous user"} {this.renderState(u)} {u.name} at <DisplayTimestamp timestamp={u.stamp}/>
    //             </div>
    //           )
    //         }
    //         return null;
    //       }
    //     )
    //   }
    //   return null;
    // }

    this.mediaQueryChanged = () => {
      this.props.setSidebar(mql.matches);
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
      if (!orgSnap.exists()) {
        this.props.notAnOrgUserError(Constants.PROJECT_PAGE)
      }
      else {
        let orgId = orgSnap.val().orgId
        let orgName = orgSnap.val().name
        this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgurl, orgName, Constants.THREAD_PAGE);
        this.props.loadOrgUser(this.props.authenticated, orgId, Constants.THREAD_PAGE)
        this.props.loadProjectList(this.props.authenticated, orgId, this.props.params.pid, Constants.THREAD_PAGE)
        this.props.loadThreadCounts(this.props.authenticated, orgId)
        this.props.loadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
        this.props.loadProjectNames(orgId, Constants.THREAD_PAGE)
        this.props.loadOrgMembers(orgId,  Constants.THREAD_PAGE)
        this.props.loadThread(this.props.params.tid);
        this.props.loadThreadLikes(this.props.params.tid, Constants.THREAD_PAGE);
        this.props.watchThreadComments(this.props.params.tid);
        this.props.loadThreadAttachments(this.props.params.tid, Constants.THREAD_PAGE);

        this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'thread', 'orgId': orgId });
      }
    })
    
    // this.props.markThreadRead(this.props.authenticated, this.props.params.tid)
  }

  componentWillUnmount() {
    if (this.props.org && this.props.org.id) {
      this.props.unloadProjectNames(this.props.org.id, Constants.THREAD_PAGE)
      this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE)
      this.props.unloadOrgUser(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE)
      this.props.unloadOrg(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE);
      this.props.loadOrgMembers(this.props.org.id,  Constants.THREAD_PAGE)
    }
    this.props.unloadThread(this.props.params.tid);
    this.props.unloadThreadLikes(this.props.params.tid, Constants.THREAD_PAGE);
    this.props.unwatchThreadComments(this.props.params.tid);
    this.props.unloadThreadAttachments(this.props.params.tid, Constants.THREAD_PAGE);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.thread !== this.props.thread) {
      let threadId = nextProps.params.tid ? nextProps.params.tid : this.props.params.tid
      this.props.markThreadRead(this.props.authenticated, nextProps.thread.orgId, nextProps.thread.projectId, threadId);
    }
    if (nextProps.params.tid !== this.props.params.tid && this.props.params.orgurl === nextProps.params.orgurl) {
      this.props.unloadThread(this.props.params.tid);
      this.props.unloadThreadLikes(this.props.params.tid, Constants.THREAD_PAGE);
      this.props.unwatchThreadComments(this.props.params.tid);
      this.props.unloadThreadAttachments(this.props.params.tid, Constants.THREAD_PAGE);
      this.props.loadThread(nextProps.params.tid);
      this.props.loadThreadLikes(nextProps.params.tid, Constants.THREAD_PAGE);
      this.props.watchThreadComments(nextProps.params.tid);
      this.props.loadThreadAttachments(nextProps.params.tid, Constants.THREAD_PAGE);
      // this.props.markThreadRead(this.props.authenticated, nextProps.params.tid)

      this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'thread', 'orgId': this.props.org.id });

    }
    else if (nextProps.params.orgurl !== this.props.params.orgurl) {
      if (this.props.org && this.props.org.id) {
        this.props.unloadOrg(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE);
        this.props.unloadOrgUser(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE)
        this.props.unloadProjectNames(this.props.org.id, Constants.THREAD_PAGE)
        this.props.unloadThreadCounts(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE)
        this.props.unloadProjectList(this.props.authenticated, this.props.org.id, Constants.THREAD_PAGE)
        this.props.unloadOrgMembers(this.props.org.id,  Constants.THREAD_PAGE)
      }
      this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
      this.props.unloadThread(this.props.params.tid);
      this.props.unloadThreadLikes(this.props.params.tid, Constants.THREAD_PAGE);
      this.props.unwatchThreadComments(this.props.params.tid);
      this.props.unloadThreadAttachments(this.props.params.tid, Constants.THREAD_PAGE);

      let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
      Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
        if (!orgSnap.exists()) {
          this.props.notAnOrgUserError(Constants.PROJECT_PAGE)
        }
        else {
          let orgId = orgSnap.val().orgId
          let orgName = orgSnap.val().name
          this.props.loadOrg(this.props.authenticated, orgId, nextProps.params.orgurl, orgName, Constants.THREAD_PAGE);
          this.props.loadOrgUser(this.props.authenticated, orgId, Constants.THREAD_PAGE)
          this.props.loadOrgMembers(orgId,  Constants.THREAD_PAGE)
          this.props.loadProjectList(this.props.authenticated, orgId, this.props.params.pid, Constants.THREAD_PAGE)
          this.props.loadThreadCounts(this.props.authenticated, orgId)
          this.props.loadProjectNames(orgId, Constants.THREAD_PAGE)
          this.props.loadThread(nextProps.params.tid);
          this.props.loadThreadLikes(nextProps.params.tid, Constants.THREAD_PAGE);
          this.props.watchThreadComments(nextProps.props.params.tid);
          this.props.loadThreadAttachments(nextProps.params.tid, Constants.THREAD_PAGE);
          // this.props.markThreadRead(this.props.authenticated, nextProps.params.tid)

          this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'thread', 'orgId': orgId });
        }
      })
    }
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <LoggedOutMessage />
      )
    }
    else if(this.props.invalidOrgUser) {
      return (
        <InvalidOrg />
      )
    }
    // else if (this.props.threadNotFoundError) {
    //   return (
    //     <div className="error-page flx flx-col flx-center-all ta-center co-type-body">
    //       <div className="co-logo mrgn-top-md mrgn-bottom-md">
    //           <img className="center-img" src="/img/logomark.png"/>
    //         </div>
    //       <div className="mrgn-bottom-md co-type-body color--white">Sorry, we couldn't find this thread.</div>
    //     </div>
    //   )
    // }
    else if (!this.props.thread) {
      return (
        <LoadingSpinner message="Loading thread" />
        )
    }
    else {
      let thread = this.props.thread
      // let createdBy = this.props.createdBy
      // let createdBy = this.props.orgUserData && this.props.orgUserData[thread.userId] ? this.props.orgUserData[thread.userId] : { username: '', image: '', fullName: ''}
      // let canModify = this.props.authenticated === this.props.thread.userId ? true : false

      return (
        <div>

          <Sidebar
            sidebar={<ProjectList />}
            open={this.props.sidebarOpen}
            onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
            styles={{ sidebar: {
                  borderRight: "1px solid rgba(0,0,0,.1)",
                  boxShadow: "none",
                  zIndex: "100"
                },
                overlay: mql.matches ? {
                  backgroundColor: "rgba(255,255,255,1)"
                } : {
                  zIndex: 12,
                  backgroundColor: "rgba(0, 0, 0, 0.5)"
                },
              }}
            >
              <div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>

                <div className="page-common tp-page page-thread flx flx-row flx-m-col flx-just-start">

                  {/*<div className="DN project-header text-left brdr-bottom brdr-color--primary--10 flx flx-col flx-align-start w-100">
                    <OrgHeader />
                  </div>*/}
                   
                  

                  <ProjectHeader 
                      orgURL={this.props.params.orgurl}
                      projectId={thread.projectId}
                      project={this.props.project}
                      onProjectInviteClick={this.onProjectInviteClick}
                      threadId={this.props.params.tid}
                    />

                  <ThreadBody
                    // thread={thread}
                    threadId={this.props.params.tid}
                    // project={this.props.project}
                    // createdBy={createdBy}
                    // orgMembers={this.props.orgMembers}
                    // orgUserData={this.props.orgUserData}
                    // canModify={canModify}
                    // bodyText={this.props.bodyText}
                    // isEditMode={this.props.isEditMode}
                    // likes={this.props.likes}
                    // comments={this.props.comments}
                    // commentErrors={this.props.commentErrors}
                    // attachments={this.props.attachments}
                    // tab={this.props.tab}
                    // attachmentCount={this.props.attachmentCount}
                   />


                </div>

            </div>

            </Sidebar>

        </div>
      );
    }
  }
}

// export default compose(
//   firebaseConnect([
//     "updates"
//   ]),
//   connect(mapStateToProps, Actions)
// )(Thread);

export default connect(mapStateToProps, mapDispatchToProps)(Thread);