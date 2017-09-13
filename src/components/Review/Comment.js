import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import ProxyImage from './../ProxyImage';
import DisplayTimestamp from './../DisplayTimestamp';

const processString = require('react-process-string');

const Comment = props => {
  const comment = props.comment;
  const show = props.authenticated &&
    props.authenticated === comment.userId;

  let users = ['jordan', 'brian', '@jordan', '@brian']
  const processed = processString([{
    regex: /\@([a-z0-9_\-]+?)( |\,|$|\.)/gim, //regex to match a username 
    fn: (key, result) => {
        return <Link className="color--primary" key={key} to={`/${result[1]}`}>@{result[1]} </Link>;
      }
  }]);

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
              {processed(comment.body)}

              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="date-posted inline-block">
                  <DisplayTimestamp timestamp={comment.lastModified} />
                </div>
                <DeleteButton show={show} commentObject={props.commentObject} commentId={comment.id} deleteComment={props.deleteComment} itineraryId={props.itineraryId} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
     
        
    </div>
  );
};

export default Comment;