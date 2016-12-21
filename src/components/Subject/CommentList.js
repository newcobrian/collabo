import Comment from './Comment';
import React from 'react';

const CommentList = props => {
  return (
    <div>
      {
        props.comments.map(comment => {
          return (
            <Comment
              comment={comment}
              currentUser={props.currentUser}
              reviewId={props.reviewId}
              key={comment.id} />
          );
        })
      }
    </div>
  );
};

export default CommentList;