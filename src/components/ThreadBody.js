import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { Link, browserHistory } from 'react-router';
import UniversalSearchBar from './UniversalSearchBar';
import LoadingSpinner from './LoadingSpinner';
import ProfilePic from './ProfilePic';
import DisplayTimestamp from './DisplayTimestamp';
import RenderDebounceInput from './RenderDebounceInput';
import CommentContainer from './Review/CommentContainer';
import ProjectList from './ProjectList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoggedOutMessage from './LoggedOutMessage';
import OrgHeader from './OrgHeader';
import LikeReviewButton from './LikeReviewButton';
import RichTextEditor from './RichTextEditor';
import InvalidOrg from './InvalidOrg'

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


const ThreadBody = props => {
  if (!props.thread) {
    return null
  }
  else {
    const { authenticated, threadId, thread, project, comments, commentErrors, createdBy, canModify, orgName, 
      orgMembers, orgUserData, bodyText, likes } = props

    const onGoBackClick = ev => {
      browserHistory.goBack()
    }

    return (
      <div className={"thread-body header-push-mini left-text flx flx-col flx-align-center"}>
                      
          <Link onClick={onGoBackClick} activeClassName="active" className="nav-module create nav-editor flx flx-align-start mrgn-top-sm w-100">
            <div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
              <i className="material-icons color--black md-18 opa-100 mrgn-right-xs">arrow_back_ios</i>
              <div className="co-type-body mrgn-left-xs">Back to list</div>
            </div>
          </Link>
          <div className="thread-view w-100">
            <div className={"tp-wrapper flx flx-row"}>   
              <div className="tp-container b--primary--10 flx flx-col flx-align-start">   
                <div className="thread-row-wrapper flx flx-row">
                  <div className="thread-content-wrapper w-100">
                    <div className="co-type-thread-title">{thread.title}</div>
                    <div className="flx flx-row w-100 flx-align-center brdr-bottom pdding-bottom-sm mrgn-bottom-md">
                      <span className="thread-timestamp">Posted by {createdBy.username}
                        <Link
                          to={'/' + orgName + '/user/' + createdBy.username}
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
                        bodyText={bodyText}
                        updateText={props.updateText}
                        canModify={canModify}
                        thread={thread}
                        saveBody={props.saveBody}
                        onEditClick={props.onEditClick}
                        onDeleteClick={props.onDeleteClick}
                        isEditMode={props.isEditMode}
                        usersList={props.orgMembers}
                          />
                    </div>
                    <div className="cta-wrapper vb--outline--none flx flx-row flx-align-center mrgn-top-sm">
                      <LikeReviewButton
                        authenticated={authenticated}
                        isLiked={likes && likes[authenticated] ? true : false}
                        likesCount={Object.keys(likes || {}).length}
                        objectId={threadId}
                        thread={thread}
                        likeObject={thread}
                        type={Constants.THREAD_TYPE}
                        orgName={orgName} />
                    </div>
                    {/* this.renderChanges(this.props.updates, this.props.userId, this.props.comments, this.props.params.tid, this.props.googleDocs) */}

                  </div>
                </div>
            </div>


              <div className="comment-row-wrapper flx flx-row" id='guidecommentcontainer' name='guidecommentcontainer'>
                <div className="co-thread-reply-wrapper">
                  <CommentContainer
                    authenticated={authenticated}
                    comments={comments || {}}
                    errors={commentErrors}
                    commentObject={thread}
                    threadId={threadId}
                    thread={thread}
                    project={project}
                    orgName={orgName}
                    usersList={orgMembers}
                    orgUserData={orgUserData}
                    type={Constants.THREAD_TYPE}
                    deleteComment={props.onDeleteThreadComment} />
                    </div>
                  </div>
              </div>

         
              </div>
          </div>
    )
  }
}

export default ThreadBody