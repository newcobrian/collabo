import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ItineraryList from './ItineraryList'; 
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from './FirebaseSearchInput';
import UniversalSearchBar from './UniversalSearchBar';
import LoadingSpinner from './LoadingSpinner';
import ProfilePic from './ProfilePic';
import DisplayTimestamp from './DisplayTimestamp';
import RenderDebounceInput from './RenderDebounceInput';
import CommentContainer from './Review/CommentContainer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  ...state.thread,
  userInfo: state.common.userInfo,
  authenticated: state.common.authenticated,
  organization: state.common.organization,
  invalidOrgUser: state.common.invalidOrgUser
})

const BodySection = props => {
  if (props.isEditMode && props.canModify) {
    return (
      <div>
        <ReactQuill 
            value={props.body || ''}
            onChange={props.updateText} />
      <div><Link onClick={props.onEditClick(false)}>Cancel</Link></div>
      <div><Link onClick={props.saveBody(props.thread)}>Save</Link></div>
      </div>
      )
  }
  else if (props.canModify) {
    return (
      <div>
        <div>
          <div dangerouslySetInnerHTML={{ __html: props.body || '' }}>
          
          </div>
          <Link onClick={props.onEditClick(true)}>Edit Post</Link>
        </div>
        {/*<RenderDebounceInput
          type="textarea"
          className="w-100 show-border"
          cols="10"
          wrap="hard"
          value={props.body}
          placeholder="Add notes here"
          debounceFunction={props.changeBody(props.thread)} />*/}
      </div>
    )
  }
  else {
    return (
      <div dangerouslySetInnerHTML={{ __html: props.body || '' }}>
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
      this.props.updateThreadField(this.props.authenticated, this.props.params.tid, thread, field, value)

    this.saveBody = thread => ev => {
      ev.preventDefault()
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
  }

  componentWillMount() {
    this.props.loadOrg(this.props.authenticated, this.props.params.orgname);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated)
    this.props.loadThread(this.props.params.tid);
    this.props.watchThreadComments(this.props.params.tid);
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project'});
  }

  componentDidMount() {
    this.props.markThreadRead(this.props.authenticated, this.props.params.tid)
  }

  componentWillUnmount() {
    this.props.unloadThread(this.props.params.tid);
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.unloadOrgList(this.props.authenticated)
    this.props.unwatchThreadComments(this.props.params.tid);
    this.props.unloadOrg();
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.tid !== this.props.params.tid) {
      this.props.unloadThread(this.props.params.tid);
      this.props.unwatchThreadComments(this.props.params.tid);
      this.props.loadThread(nextProps.params.tid);
      this.props.watchThreadComments(nextProps.params.tid);
      this.props.markThreadRead(this.props.authenticated, nextProps.params.tid)
    }
  }

  render() {
    if(this.props.invalidOrgUser) {
      return (
        <div>
          You don't have permission to view this team. <Link to='/'>Go Home</Link>
        </div>
      )
    }
    if (this.props.threadNotFoundError) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this thread.</div>
        </div>
      )
    }
    if (!this.props.thread) {
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
            
            



              <div className={"page-title-wrapper left-text flx flx-col flx-align-start country-color-"}>
                 <div>
              <Link to={'/' + this.props.params.orgname + '/' + this.props.thread.projectId} activeClassName="active" className="nav-module create nav-editor flx flx-center-all">
                <div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
                    <i className="material-icons color--black md-18 opa-100 mrgn-right-xs">arrow_back_ios</i>
                    <div className="v2-type-body1 mrgn-left-xs">Back to Project</div>
                  </div>
              </Link>
            </div>
                {/*<UniversalSearchBar />*/}


                <div className="v2-type-h3 mrgn-bottom-sm">{thread.title}</div>
                <div className="flx flx-row">
                  <div className="v2-type-body1">Posted by {createdBy.username}
                    <Link
                      to={'/' + createdBy.username}
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
                  {/*showBody(canModify, thread.body)*/}
                  <BodySection 
                    body={this.props.bodyText} 
                    canModify={canModify} 
                    thread={thread} 
                    saveBody={this.saveBody}
                    updateText={this.updateText}
                    editorState={this.props.editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    onEditClick={this.onEditClick}
                    isEditMode={this.props.isEditMode} />
                </div>
              </div>

              <div className="itinerary__comments-module flx flx-col flx-align-start flx-just-start w-max-2" id='guidecommentcontainer' name='guidecommentcontainer'>
                <div className="v2-type-h4 mrgn-bottom-sm mrgn-top-sm ta-left w-100">
                  Comments
                </div>
                <CommentContainer
                  authenticated={this.props.authenticated}
                  userInfo={this.props.userInfo}
                  comments={this.props.comments || {}}
                  errors={this.props.commentErrors}
                  commentObject={thread}
                  threadId={this.props.params.tid}
                  project={this.props.project}
                  org={this.props.org}
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
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(Thread);