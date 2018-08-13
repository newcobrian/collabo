import Comment from './Comment';
import React from 'react';
var linkify = require('linkify-it')();

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
              orgName={props.orgName}
              deleteComment={props.deleteComment}
              threadId={props.threadId} />
          );
        })
      }
    </div>
  );
};

export default CommentList;