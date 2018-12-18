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
import AttachmentsList from './AttachmentsList'

const DiscussionTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.changeTab(Constants.DISCUSSION_TAB, Constants.THREAD_PAGE);
  }

  return (
    <div className="nav-item">
      <a  href=""
          className={ props.tab === Constants.DISCUSSION_TAB ? 'koi-type-h2b mrgn-right-md opa-100 color--utsuri active' : 'koi-type-h2b color--utsuri mrgn-right-md opa-50' }
          onClick={clickHandler}>
        {props.count > 0 ? + props.count : ''} Replies
      </a>
    </div>
  );
};

const FilesTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.changeTab(Constants.FILES_TAB, Constants.THREAD_PAGE);
  }

  return (
    <div className="nav-item">
      <a  href=""
          className={ props.tab === Constants.FILES_TAB ? 'koi-type-h2b color--utsuri mrgn-bottom-md opa-100 active' : 'koi-type-h2b color--utsuri mrgn-bottom-md opa-50' }
          onClick={clickHandler}>
        {props.count > 0 ?  + props.count : ''} Files
      </a>
    </div>
  );
};

const SubSection = props => {
  if (props.tab === Constants.DISCUSSION_TAB) {
    return (
      <CommentContainer
        authenticated={props.authenticated}
        comments={props.comments || {}}
        errors={props.commentErrors}
        commentObject={props.thread}
        threadId={props.threadId}
        thread={props.thread}
        project={props.project}
        org={props.org}
        usersList={props.orgMembers}
        orgUserData={props.orgUserData}
        type={Constants.THREAD_TYPE}
        deleteComment={props.deleteComment} />
    )
  }
  else if (props.tab === Constants.FILES_TAB) {
    return (
      <AttachmentsList 
        authenticated={props.authenticated}
        attachments={props.attachments} 
        orgUserData={props.orgUserData} 
        onDeleteFile={props.onDeleteFile} />
    )
  }
  else return null
}

const BodySection = props => {
  if (props.isEditMode && props.canModify) {
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
          <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
            <div className="w-auto thread-timestamp color--black mrgn-right-md">
              <Link onClick={props.onDeleteClick}>Delete</Link>
            </div>
            <div className="w-auto thread-timestamp color--secondary">
              <Link onClick={props.onEditClick(true)}>Edit</Link>
            </div>
          </div>
      {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(props.bodyText) || '' }}>
          </div>*/}
      </div>
    )
  }
}

const AttachmentsPreview = props => {
  const DeleteButton = props => {
    const handleClick = attachmentId => ev => {
      props.onDeleteFile(attachmentId)
    }

    if (props.file && props.authenticated === props.file.userId) {
      return (
        <Link onClick={handleClick(props.attachmentId)}>Delete</Link>
      )
    }
    else return false
  }

  if (props.attachments) {
    return (
      <ul>
        <h3>Attachments</h3>
        {
          Object.keys(props.attachments || {}).map(function (attachmentId) {
            return  (
            <li key={attachmentId}>
              <div>{props.attachments[attachmentId].name}</div>
              <div><a href={props.attachments[attachmentId].link}>Link</a></div>
              <DeleteButton attachmentId={attachmentId} file={props.attachments[attachmentId]} onDeleteFile={props.onDeleteFile} />
            </li>
            )
          })
        }
      </ul>
    
    )
  }
  else return null
}


const ThreadBody = props => {
  if (!props.thread) {
    return null
  }
  else {
    const { authenticated, threadId, thread, project, comments, commentErrors, createdBy, canModify, org, 
      orgMembers, orgUserData, bodyText, likes, attachments, tab } = props

    const onDeleteFile = (attachmentId) => {
      props.deleteAttachmentFile(authenticated, attachmentId)
    }

    return (
      <div className={"thread-body fill--mist left-text flx flx-col flx-align-center"}>
          <div className="thread-view w-100">
            <div className={"tp-wrapper flx flx-row flx-m-col"}>   
              <div className="tp-container b--primary--10 flx flx-col flx-align-start mrgn-top-sm">   
                <div className="thread-row-wrapper flx flx-row">
                  <div className="thread-content-wrapper w-100">
                    <div className="co-type-thread-title color--black mrgn-bottom-xs">{thread.title}</div>
                    <div className="flx flx-row w-100 flx-align-center mrgn-bottom-xs">
                      <span className="thread-timestamp">Posted by {createdBy.username}
                        <Link
                          to={'/' + org.url + '/user/' + createdBy.username}
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
                    <div className="cta-wrapper vb--outline--none flx flx-row flx-align-center brdr-bottom pdding-bottom-sm">
                      <LikeReviewButton
                        authenticated={authenticated}
                        isLiked={likes && likes[authenticated] ? true : false}
                        likesCount={Object.keys(likes || {}).length}
                        objectId={threadId}
                        thread={thread}
                        likeObject={thread}
                        type={Constants.THREAD_TYPE}
                        org={org} />
                    </div>
                    <div className="co-type-body color--black w-100 mrgn-top-sm opa-90">
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
                    
                    {/* this.renderChanges(this.props.updates, this.props.userId, this.props.comments, this.props.params.tid, this.props.googleDocs) */}
                    <AttachmentsPreview authenticated={authenticated} attachments={thread.attachments} onDeleteFile={onDeleteFile} />
                  </div>
                </div>
            </div>


              <div className="comment-row-wrapper flx flx-col">
                <div className="flx flx-row flx-align-center flx-just-start w-100 mrgn-bottom-sm mrgn-top-lg">
                  <DiscussionTab tab={tab} changeTab={props.changeTab} count={thread.commentsCount} />
                  <FilesTab tab={tab} changeTab={props.changeTab} count={props.attachmentCount} />
                </div>

                <div className="co-thread-reply-wrapper">
                  
                    <SubSection
                      tab={tab}
                      authenticated={authenticated}
                      comments={comments || {}}
                      errors={commentErrors}
                      commentObject={thread}
                      threadId={threadId}
                      thread={thread}
                      project={project}
                      org={org}
                      usersList={orgMembers}
                      orgUserData={orgUserData}
                      deleteComment={props.onDeleteThreadComment}
                      attachments={attachments}
                      onDeleteFile={onDeleteFile} />

                </div>
              </div>
            </div>

         
          </div>
      </div>
    )
  }
}

export default ThreadBody