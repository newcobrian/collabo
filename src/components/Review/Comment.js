import React from 'react';
import * as Constants from '../../constants';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import ProfilePic from './../ProfilePic';
import GoogleDriveLink from './GoogleDriveLink';
import DisplayTimestamp from './../DisplayTimestamp';
import LikeReviewButton from './../LikeReviewButton';
import CommentContainer from './CommentContainer'
import CommentInput from './CommentInput'

const processString = require('react-process-string');

const NestedCommentContainer = props => {


  // if this has a parent Id already, it's nested and we don't need to go deeper
  if (props.parentId || !props.comments) {
    return null
  }
  // if this is from the feed, just show the count of nested comments
  // else if (props.isFeed) {
  //   let numComments = Object.keys(props.comments || {}).length
  //   if (numComments === 0) return null
  //   else {
  //     return (
  //       <div className="hidden-comments flx flx-col flx-align-center fill--white koi-type-body koi-type-bold color--utsuri">
  //         <div className="opa-30">{ numComments + ' ' + (numComments > 1 ? ' replies' : ' reply') }</div>
  //       </div>
  //     )
  //   }
  // }
  // else show full nested
  else {
    return (
      <CommentContainer
        authenticated={props.authenticated}
        comments={props.comments}
        commentObject={props.commentObject}
        threadId={props.threadId}
        thread={props.thread}
        org={props.org}
        project={props.project}
        usersList={props.usersList}
        orgUserData={props.orgUserData}
        type={Constants.COMMENT_TYPE}
        parentId={props.commentId}
        deleteComment={props.deleteComment}
        hideCommentInput={props.hideCommentInput}
        onDeleteFile={props.onDeleteFile}
      />
    )
  }
}

const EditButton = props => {
  if (props.show && !props.isEditMode) {
    return (
      <Link onClick={props.onEditClick}>
        Edit
      </Link>
    )
  } 
  else return null
}

const AttachmentsPreview = props => {
  const DeleteAttachment = props => {
    const handleClick = attachmentId => ev => {
      props.onDeleteFile(props.attachmentId)
    }
    if (props.uploaderId === props.authenticated) {
      return (
        <Link className="flx-item-right koi-ico --16 icon--remove color--utsuri opa-60" onClick={handleClick(props.file.attachmentId)}></Link>
      )
    }
    else return null
  }

  if (props.attachments) {
    return (
      <ul className="w-100 mrgn-top-sm">
        {
          Object.keys(props.attachments || {}).map(function (attachmentId) {
            if (props.attachments && props.attachments[attachmentId]) {
              let attachmentLink = (props.attachments && props.attachments[attachmentId] && props.attachments[attachmentId].link) ? props.attachments[attachmentId].link : null
              let attachmentName = (props.attachments && props.attachments[attachmentId] && props.attachments[attachmentId].name) ? props.attachments[attachmentId].name : ''
              return  (
                <li className="attachment-row brdr-all ta-left w-100 fill--white flx flx-row flx-align-center flx-just-start" key={attachmentId}>
                  <div className="koi-ico --24 ico--file color--utsuri opa-30 mrgn-right-xs"></div>
                  <Link to={attachmentLink} target="_blank" className="koi-type-caption color--seaweed">{attachmentName}</Link>
                  <DeleteAttachment 
                    attachmentId={attachmentId}
                    authenticated={props.authenticated} 
                    uploaderId={props.uploaderId}
                    file={props.attachments[attachmentId]} 
                    onDeleteFile={props.onDeleteFile} />
                </li>
              )
            }
          })
        }
      </ul>
    
    )
  }
  else return null
}

const mapDispatchToProps = {
  hideModal: Actions.hideModal
}

class Comment extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpenNotification: true,
      hideCommentInput: true,
      isEditMode: false
    };
  }

  closeNotification = () => {
    this.setState({
      isOpenNotification: false
    });
  }

  toggleHideCommentInput = () => {
    this.setState({
      hideCommentInput: !this.state.hideCommentInput
    })
  }

  render () {
    const { isOpenNotification, hideCommentInput } = this.state;
    const { comment, authenticated, org, project, commentObject, 
      deleteComment, threadId, likes, thread, usersList, orgUserData, parentId, isFeed, openThread } = this.props;
    const show = authenticated && authenticated === comment.userId;
    const commenter = orgUserData && orgUserData[comment.userId] ? orgUserData[comment.userId] : { username: '' }
    const orgURL = org && org.url ? org.url : ''

    const processed = processString([{
      regex: /\@([a-z0-9_\-]+?)( |\,|$|\.|\!|\:|\'|\"|\?)/gim, //regex to match a username
      fn: (key, result) => {
        return (
          <span key={key}>
          <Link className="color--seaweed" to={`/${orgURL}/user/${result[1]}`}>@{result[1]}</Link>{result[2]}
        </span>
        );
      }
    }, {
      regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
      fn: (key, result) => {
        return (
          <span key={key}>
          <a target="_blank" href={result[0]}>{result[0]}</a>
        </span>
        );
      }
    }, {
      regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
      fn: (key, result) => {
        return (
          <span key={key}>
          <a target="_blank" href={`http://${result[0]}`}>{result[0]}</a>
        </span>
        );
      }
    }]);

    const onEditClick = ev => {
      this.setState({isEditMode: !this.state.isEditMode})
    }

    if (this.state.isEditMode) {
      return (
        <div>
          <CommentInput 
            commentId={comment.id}
            comment={comment}
            commentObject={commentObject} 
            threadId={threadId}
            authenticated={authenticated} 
            project={project}
            org={org}
            type={Constants.COMMENT_TYPE}
            usersList={usersList}
            parentId={parentId}
            toggleShowEdit={onEditClick} />
            <Link onClick={onEditClick}>Cancel</Link>
        </div>

      )
    }
    else {
      return (
        <div className="comment-indent inline-comments flx flx-col flx-align-center" id={'comment' + comment.id}>
          <div className="comment-bg w-100">
          <div className="comment-inner fill--white w-100 bx-shadow">
            <div className="comment-inner-inner flx flx-col flx-just-start w-100">
              <div className="flx flx-row flx-just-start flx-align-center w-100">
                <Link
                  to={`/${orgURL}/user/${commenter.username}`}
                  onClick={this.props.hideModal}
                  className="mrgn-right-sm">
                  <ProfilePic src={commenter.image} className="user-image user-image-sm center-img" />
                </Link>
                <div className="co-type-body flx flx-col flx-just-start mrgn-left-xs">
                  <Link
                    to={`/${orgURL}/user/${commenter.username}`}
                    onClick={this.props.hideModal}
                    className="co-type-bold color--black">
                    {commenter.username}
                  </Link>
                </div>
                <div className="flx flx-row flx-align-center flx-item-right">
                  <div className="thread-timestamp inline-block">
                    <DisplayTimestamp timestamp={comment.lastModified} />
                  </div>
                  <div className="new-badge active fill--tancho mrgn-left-xs"></div>
                </div>
              </div>

              <div className="comment-row color--black opa-90 co-type-body">
                {/*<ShowMore
                  lines={3}
                  more='Show more'
                  less='Show less'
                  anchorClass=''
                >*/}
                  {processed(comment.body)}
               {/* </ShowMore>>*/}
              </div>

              <AttachmentsPreview 
                authenticated={authenticated} 
                uploaderId={comment.userId}
                attachments={comment.attachments} 
                onDeleteFile={this.props.onDeleteFile} />

              <div className="cta-wrapper flx flx-row flx-align-center mrgn-top-sm w-100">
                <div className="koi-ico ico--bookmark mrgn-right-md opa-60 DN"></div>

                <LikeReviewButton
                  authenticated={authenticated}
                  isLiked={comment.likes && comment.likes[authenticated] ? true : false}
                  likesCount={Object.keys(comment.likes || {}).length}
                  objectId={comment.id}
                  thread={Object.assign({}, thread, {threadId: threadId})}
                  likeObject={parentId ? Object.assign({}, comment, {parentId: parentId}) : comment}
                  type={parentId ? Constants.NESTED_COMMENT_TYPE : Constants.COMMENT_TYPE}
                  org={org} />
                {/*{!isFeed && !parentId && hideCommentInput && (!comment.nestedComments || comment.nestedComments.lenght > 0) &&*/}
                  <Link className="reply-ico-wrapper flx flx-row flx-center-all mrgn-left-md" onClick={this.toggleHideCommentInput}>
                    <div className="koi-ico --24 ico--reply mrgn-right-xs opa-60"></div>
                    <div className="co-type-label color--black ta-left mobile-hide">Reply</div>
                  </Link>
                <div className="comment-edit-wrapper flx flx-row flx-item-right">
                  <div className="thread-timestamp inline-block mrgn-right-sm">
                    <DeleteButton
                      show={show}
                      commentObject={commentObject}
                      commentId={comment.id}
                      deleteComment={deleteComment}
                      threadId={threadId}
                      parentId={parentId} />
                  </div>
                  <div className="thread-timestamp inline-block">
                    <EditButton
                      show={show}
                      onEditClick={onEditClick} />
                  </div>
                </div>
              </div>

            </div>
            {/*
              isOpenNotification &&
              <GoogleDriveLink content={comment.body} onClose={this.closeNotification}/>
            */}
          </div>
             {/*<Link onClick={openThread} className="comment-indent">*/}
            <NestedCommentContainer
              authenticated={authenticated}
              comments={comment.nestedComments || {}}
              commentObject={thread}
              threadId={threadId}
              thread={thread}
              org={org}
              project={project}
              usersList={usersList}
              orgUserData={orgUserData}
              type={Constants.COMMENT_TYPE}
              parentId={parentId}
              commentId={comment.id}
              deleteComment={deleteComment}
              hideCommentInput={hideCommentInput && (!comment.nestedComments || comment.nestedComments.length === 0)}
              parentId={parentId}
              isFeed={isFeed}
              onDeleteFile={this.props.onDeleteFile} />
               {/*</Link>*/}
            {/* !parentId && 
              <CommentContainer
                authenticated={authenticated}
                comments={comment.nestedComments || {}}
                commentObject={thread}
                threadId={threadId}
                thread={thread}
                org={org}
                project={project}
                usersList={usersList}
                orgUserData={orgUserData}
                type={Constants.COMMENT_TYPE}
                parentId={comment.id}
                deleteComment={deleteComment}
                hideCommentInput={hideCommentInput && (!comment.nestedComments || comment.nestedComments.length === 0)}
              />
            */}
          </div>
        </div>
      );
    }
  }

};

export default connect(null, mapDispatchToProps)(Comment);