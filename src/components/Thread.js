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
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, convertFromRaw } from 'draft-js';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import LoggedOutMessage from './LoggedOutMessage';
import OrgHeader from './OrgHeader';
import Sidebar from 'react-sidebar';
import LikeReviewButton from './LikeReviewButton';

const mql = window.matchMedia(`(min-width: 800px)`);

var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  ...state.thread,
  changes: state.review.changes,
  googleDocs: state.review.googleDocs,
  userInfo: state.common.userInfo,
  updates: state.firebase.data.updates,
  authenticated: state.common.authenticated,
  invalidOrgUser: state.common.invalidOrgUser,
  sidebarOpen: state.common.sidebarOpen
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
          <Editor
              editorState={props.bodyText}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor pdding-all-md brdr-all brdr--primary"
              onEditorStateChange={props.updateText}
              mention={{
                separator: ' ',
                trigger: '@',
                suggestions: props.usersList,
              }}
          />
        </div>
        <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
          <div className="w-auto co-type-label color--black mrgn-right-md">
            <Link onClick={props.onEditClick(false)}>Cancel</Link>
          </div>
          <div className="w-auto co-type-label color--black">
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
          <Editor
            editorState={props.bodyText}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={props.updateText}
            toolbarHidden={true}
            readOnly={true}
          />
        </div>
          {/*<textarea
            disabled
            value={draftToHtml(convertToRaw(props.bodyText.getCurrentContent()))}
          />>*/}
          <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
            <div className="w-auto co-type-label color--black mrgn-right-md">
              <Link onClick={props.onEditClick(true)}>Edit Post</Link>
            </div>
            <div className="w-auto co-type-label color--black">
              <Link onClick={props.onDeleteClick}>Delete Post</Link>
            </div>
          </div>

      </div>
    )
  }
  else {
    return (
      <div>
        <Editor
          editorState={props.bodyText}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          onEditorStateChange={props.updateText}
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
      this.props.updateThreadField(this.props.authenticated, this.props.params.tid, thread, this.props.params.orgname, field, value)

    this.saveBody = thread => ev => {
      ev.preventDefault()
      let storableBody = Helpers.convertEditorStateToStorable(this.props.bodyText)
      updateThreadFieldEvent('body', storableBody, thread)
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
        message = "The permission of the file has been changed";
      } else {
        if (state === "add") {
          message = "The file was created or shared";
        } else if (state === "remove") {
          message = "The file was deleted or unshared";
        } else if (state === "update") {
          message = "One or more properties (metadata) of the file have been updated";
        } else if (state === "trash") {
          message = "The file has been moved to the trash";
        } else if (state === "untrash") {
          message = "The file has been removed from the trash";
        } else if (state === "change") {
          message = "Content of the file has been changed";
        }
      }
      return message ? <span> ({message})</span> : null;
    }

    this.renderChanges = (changes, docs, updates) => {
      if (changes && changes.length > 0) {
        return changes
          .filter((c) => docs && docs[c.fileId])
          .map((c, i) => (
            <div key={i}>
              <img src={c.file.iconLink} /> '{c.file.name}' was modified at <DisplayTimestamp timestamp={c.file.modifiedTime} /> by {c.file.lastModifyingUser ? c.file.lastModifyingUser.displayName : "Anonymous user"}
              {updates && this.renderState(updates[c.fileId])}
            </div>
          ))
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
    this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.loadThread(this.props.params.tid);
    this.props.loadThreadLikes(this.props.params.tid);
    this.props.watchThreadComments(this.props.params.tid);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});
    
    this.props.markThreadRead(this.props.authenticated, this.props.params.tid)
  }

  componentWillUnmount() {
    this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.unloadOrg(Constants.THREAD_PAGE);
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
      this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
      this.props.unloadThread(this.props.params.tid);
      this.props.unloadThreadLikes(this.props.params.tid);
      this.props.unwatchThreadComments(this.props.params.tid);

      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.THREAD_PAGE);
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, this.props.params.pid, Constants.THREAD_PAGE)
      this.props.loadThreadCounts(this.props.authenticated, nextProps.params.orgname)
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
        <div className="mrgn-bottom-md">You don't have permission to view this thread</div>
          
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

                <div className="page-common page-places flx flx-row flx-m-col flx-align-start">
                  <div className="project-header text-left flx flx-col flx-align-start w-100">
                    <OrgHeader />
                  </div>

                    <div className="thread-area header-push-mini flx flx-col w-100">

                    <div className={"thread-body left-text flx flx-col flx-align-start country-color-"}>
                       <div>
                    <Link onClick={this.onGoBackClick} activeClassName="active" className="nav-module create nav-editor flx flx-center-all">
                      <div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
                          <i className="material-icons color--black md-18 opa-100 mrgn-right-xs">arrow_back_ios</i>
                          <div className="co-type-body mrgn-left-xs">Back to group</div>
                        </div>
                    </Link>
                  </div>
                      {/*<UniversalSearchBar />*/}


                      <div className="v2-type-h3 mrgn-bottom-sm">{thread.title}</div>
                      <div className="flx flx-row">
                        <div className="v2-type-body1">Posted by {createdBy.username}
                          <Link
                            to={'/' + this.props.params.orgname + '/user/' + createdBy.username}
                            className="show-in-list">
                          <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                              <div className="tip__author-photo flx-hold mrgn-right-sm">
                                <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                              </div> 
                              <div className="color--black v2-type-body">
                                {createdBy.username}
                              </div>
                          </div>
                        </Link> 
                        </div>
                        <div className="v2-type-body1 opa-30 mrgn-left-md">Last updated: 
                          <DisplayTimestamp timestamp={thread.lastModified} />
                        </div>
                      </div>
                      <div className="v2-type-body2 opa-90 w-100 mrgn-top-sm">
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
                      { this.renderChanges(this.props.changes, this.props.googleDocs, this.props.updates) }
                    </div>
                    <div className="cta-wrapper vb vb--tip vb--outline--none flx flx-row flx-align-center v2-type-body2">
                      <LikeReviewButton
                        authenticated={this.props.authenticated}
                        isLiked={this.props.likes && this.props.likes[this.props.authenticated] ? true : false}
                        likesCount={Object.keys(this.props.likes || {}).length}
                        objectId={this.props.params.tid}
                        likeObject={thread}
                        type={Constants.THREAD_TYPE}
                        orgName={this.props.params.orgname} />
                    </div>
                    
                    <div className="comments-area flx flx-col flx-align-start flx-just-start w-max-2" id='guidecommentcontainer' name='guidecommentcontainer'>
                      <div className="co-thread-reply-wrapper">
                        <CommentContainer
                          authenticated={this.props.authenticated}
                          userInfo={this.props.userInfo}
                          comments={this.props.comments || {}}
                          placeHolder={"Hello"}
                          errors={this.props.commentErrors}
                          commentObject={thread}
                          threadId={this.props.params.tid}
                          project={this.props.project}
                          orgName={this.props.params.orgname}
                          usersList={this.props.usersList}
                          deleteComment={this.props.onDeleteThreadComment} />
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