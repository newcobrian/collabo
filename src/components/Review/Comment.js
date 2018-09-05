import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import * as Constants from '../../constants';
import ProfilePic from './../ProfilePic';
import GoogleDriveLink from './GoogleDriveLink';
import ProxyImage from './../ProxyImage';
import DisplayTimestamp from './../DisplayTimestamp';
import LikeReviewButton from './../LikeReviewButton';
var linkify = require('linkify-it')();

const processString = require('react-process-string');

class Comment extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isOpenNotification: true
    };
  }

  closeNotification = () => {
    this.setState({
      isOpenNotification: false
    });
  }

  render () {
    const { isOpenNotification } = this.state;
    const { comment, authenticated, orgName, commentObject, deleteComment, threadId, type, likes, thread } = this.props;
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
      <div className="card comment-wrapper flx flx-align-center" id={'comment' + comment.id}>
        <div className="w-100">
          <div className="flx flx-row flx-just-start w-100">
            <Link
              to={`/user/${comment.username}`}
              className="mrgn-right-sm">
              <ProfilePic src={comment.image} className="user-image user-image-sm center-img" />
            </Link>
            <div className="comment-data flx flx-col flx-just-start">
              <Link
                to={`/user/${comment.username}`}
                className="comment-author color--primary">
                {comment.username}
              </Link>

              <div className="comment-row co-type-body font--beta">
              <span className="opa-70">
                {processed(comment.body)}
              </span>

                <div className="flx flx-row flx-just-start flx-align-center">
                  <div className="date-posted inline-block font--alpha">
                    <DisplayTimestamp timestamp={comment.lastModified} />
                  </div>
                  <DeleteButton
                    show={show}
                    commentObject={commentObject}
                    commentId={comment.id}
                    deleteComment={deleteComment}
                    threadId={threadId}
                    type={type} />
                </div>
              </div>
            </div>
            <div className="cta-wrapper vb--outline--none flx flx-row flx-item-right flx-align-center v2-type-body2">

            <LikeReviewButton
              authenticated={authenticated}
              isLiked={comment.likes && comment.likes[authenticated] ? true : false}
              likesCount={Object.keys(comment.likes || {}).length}
              objectId={comment.id}
              thread={Object.assign({}, thread, {threadId: threadId})}
              likeObject={comment}
              type={Constants.COMMENT_TYPE}
              orgName={orgName} />
              </div>
          </div>
          {
            isOpenNotification &&
            <GoogleDriveLink content={comment.body} onClose={this.closeNotification}/>
          }
        </div>
      </div>
    );
  }

};

export default Comment;