import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import ProxyImage from './../ProxyImage'

const Comment = props => {
  const comment = props.comment;
  const show = props.authenticated &&
    props.authenticated === comment.userId;
  return (
    <div className="card comment-wrapper">
      <div className="">
        <div className="flx flx-row-top">
          <Link
            to={`@${comment.username}`}
            className="comment-author">
            <ProxyImage src={comment.image} className="comment-author-img center-img" />
          </Link>
          &nbsp;
          <div className="comment-data flx flx-col flx-just-start">
            <div className="comment-row">
              <Link
                to={`@${comment.username}`}
                className="comment-author">
                {comment.username}
              </Link>
              {comment.body}
            </div>
            <div className="comment-data-wrapper flx flx-row flx-just-start">
              <span className="date-posted">
                {new Date(comment.lastModified).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
              </span>
              <DeleteButton show={show} review={props.review} commentId={comment.id} delete={props.delete} />
            </div>
          </div>
        </div>
      </div>
     
      
    </div>
  );
};

export default Comment;