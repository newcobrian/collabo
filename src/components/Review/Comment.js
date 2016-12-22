import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';

const Comment = props => {
  const comment = props.comment;
  const show = props.currentUser &&
    props.currentUser.uid === comment.userId;
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link
          to={`@${comment.username}`}
          className="comment-author">
          <img src={comment.image} className="comment-author-img" />
        </Link>
        &nbsp;
        <Link
          to={`@${comment.username}`}
          className="comment-author">
          {comment.username}
        </Link>
        <span className="date-posted">
          {new Date(comment.timestamp).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
        </span>
        <DeleteButton show={show} reviewId={props.reviewId} commentId={comment.id} />
      </div>
    </div>
  );
};

export default Comment;