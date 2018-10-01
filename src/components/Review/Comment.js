import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import * as Constants from '../../constants';
import ProfilePic from './../ProfilePic';
import GoogleDriveLink from './GoogleDriveLink';
import ProxyImage from './../ProxyImage';
import DisplayTimestamp from './../DisplayTimestamp';
import LikeReviewButton from './../LikeReviewButton';
import CommentContainer from './CommentContainer'
var linkify = require('linkify-it')();

const processString = require('react-process-string');

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
    const { comment, authenticated, userInfo, orgName, project, commentObject, 
      deleteComment, threadId, type, likes, thread, usersList, parentId } = this.props;
    const show = authenticated && authenticated === comment.userId;

    const processed = processString([{
      regex: /\@([a-z0-9_\-]+?)( |\,|$|\.|\!|\:|\'|\"|\?)/gim, //regex to match a username
      fn: (key, result) => {
        return (
          <span>
          <Link className="color--primary" key={key} to={`/${orgName}/user/${result[1]}`}>@{result[1]}</Link>{result[2]}
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
        <div className="comment-inner w-100">
          <div className="flx flx-col flx-just-start w-100">
            <div className="flx flx-row flx-just-start w-100">
              <Link
                to={`/user/${comment.username}`}
                className="mrgn-right-sm">
                <ProfilePic src={comment.image} className="user-image user-image-sm center-img" />
              </Link>
              <div className="co-type-body flx flx-col flx-just-start">
                <Link
                  to={`/user/${comment.username}`}
                  className="co-type-bold color--black">
                  {comment.username}
                </Link>
                <div className="thread-timestamp inline-block flx flx-row">
                  <DisplayTimestamp timestamp={comment.lastModified} />
                </div>
              </div>
            </div>

            <div className="comment-row co-type-body">
              <span className="">
                {processed(comment.body)}
              </span>
            </div>

            <div className="cta-wrapper flx flx-row flx-align-center mrgn-top-sm w-100">
              <div className="koi-ico koi-ico-bookmark mrgn-right-md"></div>

              <LikeReviewButton
                authenticated={authenticated}
                isLiked={comment.likes && comment.likes[authenticated] ? true : false}
                likesCount={Object.keys(comment.likes || {}).length}
                objectId={comment.id}
                thread={Object.assign({}, thread, {threadId: threadId})}
                likeObject={parentId ? Object.assign({}, comment, {parentId: parentId}) : comment}
                type={parentId ? Constants.NESTED_COMMENT_TYPE : Constants.COMMENT_TYPE}
                orgName={orgName} />
              {!parentId && <Link className="flx flx-row flx-center-all mrgn-left-md" onClick={this.toggleHideCommentInput}>
                <div className="koi-ico koi-ico-reply mrgn-right-xs"></div>
                <div className="co-type-label ta-left">Reply</div>
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
          {
            isOpenNotification &&
            <GoogleDriveLink content={comment.body} onClose={this.closeNotification}/>
          }
        </div>
          { !parentId && 
            <CommentContainer
              authenticated={authenticated}
              userInfo={userInfo}
              comments={comment.nestedComments || {}}
              commentObject={thread}
              threadId={threadId}
              thread={thread}
              orgName={orgName}
              project={project}
              usersList={usersList}
              type={Constants.COMMENT_TYPE}
              parentId={comment.id}
              deleteComment={deleteComment}
              hideCommentInput={hideCommentInput}
            />
          }
      </div>
      </div>
    );
  }

};

export default Comment;