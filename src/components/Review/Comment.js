import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import ProxyImage from './../ProxyImage';
import DisplayTimestamp from './../DisplayTimestamp';

const Comment = props => {
  const comment = props.comment;
  const show = props.authenticated &&
    props.authenticated === comment.userId;

  return (
    <div className="card comment-wrapper">
      <div className="">
        <div className="flx flx-row-top">
          <Link
            to={`${comment.username}`}
            className="comment-author">
            <ProxyImage src={comment.image} className="comment-author-img center-img" />
          </Link>
          &nbsp;
          <div className="comment-data flx flx-col flx-just-start">
            <div className="comment-row">
              <Link
                to={`/${comment.username}`}
                className="comment-author">
                {comment.username}
              </Link>
              {comment.body}
            </div>
            <div className="comment-data-wrapper flx flx-row flx-just-start">
              <span className="date-posted">
                <DisplayTimestamp timestamp={comment.lastModified} />
              </span>
              <DeleteButton show={show} commentObject={props.commentObject} commentId={comment.id} deleteComment={props.deleteComment} />
            </div>
          </div>
        </div>
      </div>
     
        
    </div>
  );
};

export default Comment;