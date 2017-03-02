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
              review={props.review}
              key={comment.id}
              delete={props.delete} />
          );
        })
      }
    </div>
  );
};

export default CommentList;