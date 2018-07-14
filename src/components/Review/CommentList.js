import Comment from './Comment';
import React from 'react';

const CommentList = props => {
  return (
    <div>
      {
        Object.keys(props.comments || {}).map(function (commentId) {
          return (
            <Comment
              comment={props.comments[commentId]}
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              commentObject={props.commentObject}
              key={commentId}
              deleteComment={props.deleteComment}
              threadId={props.threadId} />
          );
        })
      }
    </div>
  );
};

export default CommentList;