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
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              commentObject={props.commentObject}
              key={comment.id}
              delete={props.delete} />
          );
        })
      }
    </div>
  );
};

export default CommentList;