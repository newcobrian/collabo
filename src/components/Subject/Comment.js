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
          {new Date(comment.timestamp).toLocaleString()}
        </span>
        <DeleteButton show={show} reviewId={props.reviewId} commentId={comment.id} />
      </div>
    </div>
  );
};

export default Comment;