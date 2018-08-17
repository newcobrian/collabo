import React from 'react';
import { connect } from 'react-redux';
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

var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  ...state.thread,
  userInfo: state.common.userInfo,
  authenticated: state.common.authenticated,
  invalidOrgUser: state.common.invalidOrgUser
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
      <div>
        <Editor
            editorState={props.bodyText}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={props.updateText}
            mention={{
              separator: ' ',
              trigger: '@',
              suggestions: props.usersList,
            }}
        />
        <div><Link onClick={props.onEditClick(false)}>Cancel</Link></div>
        <div><Link onClick={props.saveBody(props.thread)}>Save</Link></div>
      </div>
    )
  }
  else if (props.canModify) {
    return (
      <div>
        <div>
          <Editor
            editorState={props.bodyText}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={props.updateText}
            toolbarHidden={true}
            ReadOnly={true}
          />
          {/*<textarea
            disabled
            value={draftToHtml(convertToRaw(props.bodyText.getCurrentContent()))}
          />>*/}
          <div>
            <Link onClick={props.onEditClick(true)}>Edit Post</Link>
          </div>
          <div>
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
          ReadOnly={true}
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
  }

  componentWillMount() {
    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
    this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.loadThread(this.props.params.tid);
    this.props.watchThreadComments(this.props.params.tid);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});
  }

  componentDidMount() {
    this.props.markThreadRead(this.props.authenticated, this.props.params.tid)
  }

  componentWillUnmount() {
    this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
    this.props.unloadOrg(Constants.THREAD_PAGE);
    this.props.unloadThread(this.props.params.tid);
    this.props.unwatchThreadComments(this.props.params.tid);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.tid !== this.props.params.tid && this.props.params.orgname === nextProps.params.orgname) {
      this.props.unloadThread(this.props.params.tid);
      this.props.unwatchThreadComments(this.props.params.tid);
      this.props.loadThread(nextProps.params.tid);
      this.props.watchThreadComments(nextProps.params.tid);
      this.props.markThreadRead(this.props.authenticated, nextProps.params.tid)
    }
    else if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unloadOrgList(this.props.authenticated, Constants.THREAD_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.THREAD_PAGE)
      this.props.unloadThread(this.props.params.tid);
      this.props.unwatchThreadComments(this.props.params.tid);

      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.THREAD_PAGE);
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, Constants.THREAD_PAGE)
      this.props.loadThreadCounts(this.props.authenticated, nextProps.params.orgname)
      this.props.loadThread(nextProps.params.tid);
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
    // if (!this.props.feed) {
    //   return (
    //     <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
    //       <div className="loader-wrapper flx flx-col flx-center-all fill--black">
    //         <div className="loader-bird"></div>
    //         <div className="loader">
    //           <div className="bar1"></div>
    //           <div className="bar2"></div>
    //           <div className="bar3"></div>
    //         </div>
    //         <div className="v2-type-body2 color--white">Loading location</div>
    //       </div>
    //     </div>
    //     )
    // }
    // else if (this.props.feed.length === 0) {
    //   return (
    //     <div> No itineraries created for {this.props.geo.label}.</div>
    //   )
    // }
    else {
      let thread = this.props.thread
      let createdBy = this.props.createdBy
      let canModify = this.props.authenticated === this.props.thread.userId ? true : false

      return (
        <div>

          <div className="page-common page-places flx flx-row flx-m-col flx-align-start">
            
            {/*<ProjectList 
              threadCounts={this.props.threadCounts}
              projectId={this.props.params.pid} />*/}


              <div className="thread-area flx flx-col w-100">

              <div className={"page-title-wrapper left-text flx flx-col flx-align-start country-color-"}>
                 <div>
              <Link to={'/' + this.props.params.orgname + '/' + this.props.thread.projectId} activeClassName="active" className="nav-module create nav-editor flx flx-center-all">
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
                <div className="v2-type-body2 opa-60 w-100 mrgn-top-sm">
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
              </div>

              <div className="itinerary__comments-module flx flx-col flx-align-start flx-just-start w-max-2" id='guidecommentcontainer' name='guidecommentcontainer'>
                <div className="co-type-h5 mrgn-bottom-sm mrgn-top-sm ta-left w-100">
                  Comment
                </div>
                <CommentContainer
                  authenticated={this.props.authenticated}
                  userInfo={this.props.userInfo}
                  comments={this.props.comments || {}}
                  errors={this.props.commentErrors}
                  commentObject={thread}
                  threadId={this.props.params.tid}
                  project={this.props.project}
                  orgName={this.props.params.orgname}
                  usersList={this.props.usersList}
                  deleteComment={this.props.onDeleteThreadComment} />
              
              {/*<div className="feed-wrapper">
                <ItineraryList
                itineraries={this.props.feed} 
                authenticated={this.props.authenticated} 
                like={this.props.likeReview} 
                unLike={this.props.unLikeReview}
                deleteItinerary={this.props.showDeleteModal} />
              </div>*/}

            </div>

            </div>

            </div>

        </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Thread);