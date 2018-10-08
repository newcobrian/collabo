import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
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

const mql = window.matchMedia(`(min-width: 800px)`);

var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  ...state.thread,
  googleDocs: state.review.googleDocs,
  updates: state.firebase.data.updates,
  userInfo: state.common.userInfo,
  authenticated: state.common.authenticated,
  invalidOrgUser: state.common.invalidOrgUser,
  sidebarOpen: state.common.sidebarOpen,
  userId: state.firebase.auth.uid
})

const BodySection = props => {
  if (!props.bodyText) return null;
  else if (props.isEditMode && props.canModify) {
    // return (
    //   <div>
    //     <ReactQuill 
    //         value={props.body || ''}
    //         onChange={props.updateText} />
    //   <div><Link onClick={props.onEditClick(false)}>Cancel</Link></div>
    //   <div><Link onClick={props.saveBody(props.thread)}>Save</Link></div>
    //   </div>
    //   )
    return (
      <div className="flx flx-col">
        <div className="w-100">
          <RichTextEditor
            editorState={props.bodyText}
            wrapperClass="demo-wrapper"
            editorClass="demo-editor pdding-all-md brdr-all brdr--primary"
            onChange={props.updateText}
            usersList={props.usersList}
          />
        </div>
        <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
          <div className="w-auto thread-timestamp color--black mrgn-right-md">
            <Link onClick={props.onEditClick(false)}>Cancel</Link>
          </div>
          <div className="w-auto thread-timestamp color--secondary">
            <Link onClick={props.saveBody(props.thread)}>Save</Link>
          </div>
        </div>
      </div>
    )
  }
  else if (props.canModify) {
    return (
      <div className="flx flx-col">
        <div className="w-100">
          <RichTextEditor
            editorState={props.bodyText}
            wrapperClass="demo-wrapper"
            editorClass="demo-editor pdding-all-md brdr-all brdr--primary"
            onChange={props.updateText}
            usersList={props.usersList}
            toolbarHidden={true}
            readOnly={true}
          />
        </div>
          {/*<textarea
            disabled
            value={draftToHtml(convertToRaw(props.bodyText.getCurrentContent()))}
          />>*/}
          <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
            <div className="w-auto thread-timestamp color--black mrgn-right-md">
              <Link onClick={props.onDeleteClick}>Delete</Link>
            </div>
            <div className="w-auto thread-timestamp color--secondary">
              <Link onClick={props.onEditClick(true)}>Edit</Link>
            </div>
          </div>

      </div>
    )
  }
  else {
    return (
      <div>
        <RichTextEditor
            editorState={props.bodyText}
            wrapperClass="demo-wrapper"
            editorClass="demo-editor pdding-all-md brdr-all brdr--primary"
            onChange={props.updateText}
            usersList={props.usersList}
            toolbarHidden={true}
            readOnly={true}
          />
      {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(props.bodyText) || '' }}>
          </div>*/}
      </div>
    )
  }
}

class Thread extends React.Component {
  constructor() {
    super();

    this.searchInputCallback = result => {
      if (result.placeId) {
        browserHistory.push('/thread/' + result.threadId);
      }
    }

    const updateThreadFieldEvent = (field, value, thread) =>
      this.props.updateThreadField(this.props.authenticated, this.props.params.tid, thread, this.props.params.orgname, field, value, this.props.userInfo)

    this.saveBody = thread => ev => {
      ev.preventDefault()
      // let storableBody = Helpers.convertEditorStateToStorable(this.props.bodyText)
      updateThreadFieldEvent('body', this.props.bodyText, thread)
      // this.props.updateThreadField(this.props.authenticated, this.props.params.tid, thread, field, value)
    }

    this.updateText = value => {
      this.props.onUpdateCreateField('bodyText', value, Constants.THREAD_PAGE)
    }

    this.onEditorStateChange = (editorState) => {
      this.props.changeEditorState(editorState)
    }

    this.onEditClick = mode => ev => {
      ev.preventDefault()
      this.props.setEditMode(mode)
    }

    this.onDeleteClick = ev => {
      ev.preventDefault()
      this.props.showDeleteModal(this.props.params.tid, this.props.thread, this.props.params.orgname, Constants.THREAD_PAGE)
    }

    this.onGoBackClick = ev => {
      ev.preventDefault();
      browserHistory.goBack()
    }

    this.renderState = (update) => {
      if (!update) {
        return null;
      }
      let message = "";
      const state = update.state;
      const changed = update.changed;
      if (changed && changed.indexOf("permissions") !== -1) {
        message = "changed permission of";
      } else {
        if (state === "add") {
          message = "created or shared";
        } else if (state === "remove") {
          message = "deleted or unshared";
        } else if (state === "update") {
          message = "updated";
        } else if (state === "trash") {
          message = "trashed";
        } else if (state === "untrash") {
          message = "untrashed";
        } else if (state === "change") {
          message = "changed";
        }
      }
      return message;
    }

    this.renderChanges = (updates, userId, comments, threadId, docs) => {
      const fileIds = Helpers.getFileIds(comments || []);
      if (updates && threadId && updates[threadId] && updates[threadId].length > 0) {
        return updates[threadId]
          .filter((update) => fileIds.indexOf(update.fileId) !== -1)
          .map((u, i) => {
            if (u.added && u.threadId === threadId) {
              return (
                <div key={i}>
                  {u.userInfo.username} added {(docs && docs[u.fileId]) ? docs[u.fileId].meta.name : "a file"}
                </div>  
              )
            }
            if (!u.added) {
              return (
                <div key={i}>
                  {u.lastModifyingUser ? u.lastModifyingUser.displayName : "Anonymous user"} {this.renderState(u)} {u.name} at <DisplayTimestamp timestamp={u.stamp}/>
                </div>
              )
            }
            return null;
          }
        )
      }
      return null;
    }

    this.mediaQueryChanged = () => {
      this.props.setSidebar(mql.matches);
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.THREAD_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
    this.props.loadProjectNames(this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.loadThread(this.props.params.tid);
    this.props.loadThreadLikes(this.props.params.tid);
    this.props.watchThreadComments(this.props.params.tid);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});
    
    this.props.markThreadRead(this.props.authenticated, this.props.params.tid)
  }

  componentWillUnmount() {
    this.props.unloadProjectNames(this.props.orgId, Constants.THREAD_PAGE)
    this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId, Constants.THREAD_PAGE)
    this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.THREAD_PAGE)
    this.props.unloadOrg(Constants.THREAD_PAGE);
    this.props.unloadOrgUsers(Constants.THREAD_PAGE)
    this.props.unloadThread(this.props.params.tid);
    this.props.unloadThreadLikes(this.props.params.tid);
    this.props.unwatchThreadComments(this.props.params.tid);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.tid !== this.props.params.tid && this.props.params.orgname === nextProps.params.orgname) {
      this.props.unloadThread(this.props.params.tid);
      this.props.unloadThreadLikes(this.props.params.tid);
      this.props.unwatchThreadComments(this.props.params.tid);
      this.props.loadThread(nextProps.params.tid);
      this.props.loadThreadLikes(nextProps.params.tid);
      this.props.watchThreadComments(nextProps.params.tid);
      this.props.markThreadRead(this.props.authenticated, nextProps.params.tid)
    }
    else if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unloadProjectNames(this.props.orgId, Constants.THREAD_PAGE)
      this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
      this.props.unloadOrgUsers(Constants.THREAD_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId, Constants.THREAD_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.THREAD_PAGE)
      this.props.unloadThread(this.props.params.tid);
      this.props.unloadThreadLikes(this.props.params.tid);
      this.props.unwatchThreadComments(this.props.params.tid);

      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.THREAD_PAGE);
      this.props.loadOrgUsers(this.props.authenticated, nextProps.params.orgname, Constants.THREAD_PAGE)
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, this.props.params.pid, Constants.THREAD_PAGE)
      this.props.loadThreadCounts(this.props.authenticated, nextProps.params.orgname)
      this.props.loadProjectNames(nextProps.params.orgname, Constants.THREAD_PAGE)
      this.props.loadThread(nextProps.params.tid);
      this.props.loadThreadLikes(nextProps.params.tid);
      this.props.watchThreadComments(nextProps.props.params.tid);
      this.props.markThreadRead(this.props.authenticated, nextProps.params.tid)
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
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, you don't have permission to view this team.</div>
        </div>
      )
    }
    else if (this.props.threadNotFoundError) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this thread.</div>
        </div>
      )
    }
    else if (!this.props.thread) {
      return (
        <LoadingSpinner message="Loading thread" />
        )
    }
    else {
      let thread = this.props.thread
      let createdBy = this.props.createdBy
      let canModify = this.props.authenticated === this.props.thread.userId ? true : false

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

                <div className="page-common page-thread flx flx-row flx-m-col flx-just-start">

                  <div className="project-header text-left brdr-bottom brdr-color--primary--10 flx flx-col flx-align-start w-100">
                    <OrgHeader />
                  </div>


                  <div className={"thread-body header-push-mini left-text flx flx-col flx-align-center"}>
                    
                    <Link onClick={this.onGoBackClick} activeClassName="active" className="nav-module create nav-editor flx flx-align-start mrgn-top-sm w-100">
                      <div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
                        <i className="material-icons color--black md-18 opa-100 mrgn-right-xs">arrow_back_ios</i>
                        <div className="co-type-body mrgn-left-xs">Back to list</div>
                      </div>
                    </Link>
                    <div className="thread-view w-100">
                      <div className={"tp-wrapper fill--secondary--20 flx flx-col flx-col"}>   
                        <div className="tp-container b--primary--10 flx flx-col flx-align-start bx-shadow">   
                          <div className="thread-row-wrapper flx flx-row fill--primary">
                            <div className="thread-content-wrapper w-100">
                              <div className="co-type-thread-title">{thread.title}</div>
                              <div className="flx flx-row w-100 flx-align-center brdr-bottom pdding-bottom-sm mrgn-bottom-md">
                                <span className="thread-timestamp">Posted by {createdBy.username}
                                  <Link
                                    to={'/' + this.props.params.orgname + '/user/' + createdBy.username}
                                    className="show-in-list">
                                  <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                                      <div className="tip__author-photo flx-hold mrgn-right-sm">
                                        <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                                      </div> 
                                      <div className="color--black">
                                        {createdBy.username}
                                      </div>
                                  </div>
                                </Link> 
                                </span>
                                <span className="thread-timestamp mrgn-left-md">Last updated:&nbsp;
                                  <DisplayTimestamp timestamp={thread.lastModified} />
                                </span>
                              </div>
                              <div className="co-type-body opa-90 w-100 mrgn-top-sm">
                                <BodySection
                                  bodyText={this.props.bodyText}
                                  updateText={this.updateText}
                                  canModify={canModify}
                                  thread={thread}
                                  saveBody={this.saveBody}
                                  onEditClick={this.onEditClick}
                                  onDeleteClick={this.onDeleteClick}
                                  isEditMode={this.props.isEditMode}
                                  usersList={this.props.usersList}
                                    />
                              </div>
                              <div className="cta-wrapper vb--outline--none flx flx-row flx-align-center mrgn-top-sm">
                                <LikeReviewButton
                                  authenticated={this.props.authenticated}
                                  isLiked={this.props.likes && this.props.likes[this.props.authenticated] ? true : false}
                                  likesCount={Object.keys(this.props.likes || {}).length}
                                  objectId={this.props.params.tid}
                                  thread={thread}
                                  likeObject={thread}
                                  type={Constants.THREAD_TYPE}
                                  orgName={this.props.params.orgname} />
                              </div>
                              { this.renderChanges(this.props.updates, this.props.userId, this.props.comments, this.props.params.tid, this.props.googleDocs) }

                            </div>
                          </div>
                      </div>


                        <div className="comment-row-wrapper flx flx-row" id='guidecommentcontainer' name='guidecommentcontainer'>
                          <div className="co-thread-reply-wrapper">
                            <CommentContainer
                              authenticated={this.props.authenticated}
                              userInfo={this.props.userInfo}
                              comments={this.props.comments || {}}
                              errors={this.props.commentErrors}
                              commentObject={thread}
                              threadId={this.props.params.tid}
                              thread={this.props.thread}
                              project={this.props.project}
                              orgName={this.props.params.orgname}
                              usersList={this.props.usersList}
                              type={Constants.THREAD_TYPE}
                              deleteComment={this.props.onDeleteThreadComment} />
                              </div>
                            </div>
                        </div>

                   
                        </div>
                    </div>

                  </div>
                  
                  
                  

            </div>

            </Sidebar>

        </div>
      );
    }
  }
}

export default compose(
  firebaseConnect([
    "updates"
  ]),
  connect(mapStateToProps, Actions)
)(Thread);