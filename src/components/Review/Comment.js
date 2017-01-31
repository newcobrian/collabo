import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';

const Comment = props => {
  const comment = props.comment;
  const show = props.currentUser &&
    props.currentUser.uid === comment.userId;
  return (
    <div className="card comment-wrapper">
      <div className="card-footer">
        <div className="roow roow-row">
          <Link
            to={`@${comment.username}`}
            className="comment-author">
            <img src={comment.image} className="comment-author-img center-img" />
          </Link>
          &nbsp;
          <div className="comment-data roow roow-col-left">
            <div className="comment-row">
              <Link
                to={`@${comment.username}`}
                className="comment-author">
                {comment.username}
              </Link>
              {comment.body}
            </div>
            <span className="date-posted">
              {new Date(comment.lastModified).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        </div>
        <DeleteButton show={show} reviewId={props.reviewId} commentId={comment.id} />
      </div>
     
      
    </div>
  );
};

export default Comment;