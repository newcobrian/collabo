import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import ProfilePic from './../ProfilePic';
import ProxyImage from './../ProxyImage';
import DisplayTimestamp from './../DisplayTimestamp';
var linkify = require('linkify-it')();

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
    <div className="card comment-wrapper flx flx-align-center" id={'comment' + comment.id}>
      <div className="">
        <div className="flx flx-row flx-just-start">
          <Link
            to={`${comment.username}`}
            className="mrgn-right-sm">
            <ProfilePic src={comment.image} className="user-image user-image-sm center-img" />
          </Link>
          <div className="comment-data flx flx-row flx-just-start">
            <div className="comment-row v2-type-body2 font--beta">
              <Link
                to={`/${comment.username}`}
                className="comment-author">
                {comment.username}
              </Link>
              <span className="opa-70">
                {processed(comment.body)}
              </span>

              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="date-posted inline-block font--alpha">
                  <DisplayTimestamp timestamp={comment.lastModified} />
                </div>
                <DeleteButton 
                  show={show} 
                  commentObject={props.commentObject} 
                  commentId={comment.id} 
                  deleteComment={props.deleteComment} 
                  threadId={props.threadId} 
                  type={props.type} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
     
        
    </div>
  );
};

export default Comment;