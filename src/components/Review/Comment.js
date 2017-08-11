import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import ProxyImage from './../ProxyImage';
import DisplayTimestamp from './../DisplayTimestamp';

const Comment = props => {
  const comment = props.comment;
  const show = props.authenticated &&
    props.authenticated === comment.userId;

  return (
    <div className="card comment-wrapper">
      <div className="">
        <div className="flx flx-row flx-just-start">
          <Link
            to={`${comment.username}`}
            className="">
            <ProxyImage src={comment.image} className="comment-author-img center-img mrgn-right-md" />
          </Link>
          &nbsp;
          <div className="comment-data flx flx-row flx-just-start">
            <div className="comment-row">
              <Link
                to={`/${comment.username}`}
                className="comment-author">
                {comment.username}
              </Link>
              {comment.body}

             
                <div className="date-posted inline-block">
                  <DisplayTimestamp timestamp={comment.lastModified} />
                </div>
                <DeleteButton show={show} commentObject={props.commentObject} commentId={comment.id} deleteComment={props.deleteComment} />

            </div>
            
          </div>
        </div>
      </div>
     
        
    </div>
  );
};

export default Comment;