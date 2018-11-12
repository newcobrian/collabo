import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import * as Constants from '../../constants';
import ProfilePic from './../ProfilePic';
import GoogleDriveLink from './GoogleDriveLink';
import DisplayTimestamp from './../DisplayTimestamp';
import LikeReviewButton from './../LikeReviewButton';
import CommentContainer from './CommentContainer'

const processString = require('react-process-string');

const NestedCommentContainer = props => {
  // if this has a parent Id already, it's nested and we don't need to go deeper
  if (props.parentId || !props.comments) {
    return null
  }
  // if this is from the feed, just show the count of nested comments
  else if (props.isFeed) {
    let numComments = Object.keys(props.comments || {}).length
    if (numComments === 0) return null
    else {
      return (
      <div className="comment-indent">
        <div className="hidden-comments flx flx-col flx-align-center fill--white koi-type-body koi-type-bold color--utsuri">
          <div className="opa-30">{ numComments + ' ' + (numComments > 1 ? ' replies' : ' reply') }</div>
        </div>
      </div>
      )
    }
  }
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
      />
    )
  }
}

class Comment extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isOpenNotification: true,
      hideCommentInput: true
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
      deleteComment, threadId, likes, thread, usersList, orgUserData, parentId, isFeed } = this.props;
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

    return (
      <div className="comment-indent inline-comments flx flx-col flx-align-center" id={'comment' + comment.id}>
        <div className="comment-bg w-100">
        <div className="comment-inner fill--white w-100 bx-shadow">
          <div className="comment-inner-inner flx flx-col flx-just-start w-100">
            <div className="flx flx-row flx-just-start flx-align-center w-100">
              <Link
                to={`/user/${commenter.username}`}
                className="mrgn-right-sm">
                <ProfilePic src={commenter.image} className="user-image user-image-sm center-img" />
              </Link>
              <div className="co-type-body flx flx-col flx-just-start mrgn-left-xs">
                <Link
                  to={`/user/${commenter.username}`}
                  className="co-type-bold color--black">
                  {commenter.username}
                </Link>
              </div>
              <div className="thread-timestamp inline-block flx flx-row flx-item-right color--utsuri">
                <DisplayTimestamp timestamp={comment.lastModified} />
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
              {!parentId && hideCommentInput && (!comment.nestedComments || comment.nestedComments.lenght > 0) &&
                <Link className="reply-ico-wrapper flx flx-row flx-center-all mrgn-left-md" onClick={this.toggleHideCommentInput}>
                  <div className="koi-ico --24 ico--reply mrgn-right-xs opa-60"></div>
                  <div className="co-type-label color--black ta-left mobile-hide">Reply</div>
                </Link>}
              <div className="thread-timestamp inline-block flx flx-row flx-item-right">
                <DeleteButton
                  show={show}
                  commentObject={commentObject}
                  commentId={comment.id}
                  deleteComment={deleteComment}
                  threadId={threadId}
                  parentId={parentId} />
              </div>
            </div>

          </div>
          {/*
            isOpenNotification &&
            <GoogleDriveLink content={comment.body} onClose={this.closeNotification}/>
          */}
        </div>
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
            isFeed={isFeed} />

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

};

export default Comment;