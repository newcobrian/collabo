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
              commentId={commentId}
              deleteComment={props.deleteComment}
              itineraryId={props.itineraryId}
              type={props.type} />
          );
        })
      }
    </div>
  );
};

export default CommentList;