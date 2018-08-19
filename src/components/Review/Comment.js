import DeleteButton from './DeleteButton';
import { Link } from 'react-router';
import React from 'react';
import ProfilePic from './../ProfilePic';
import GoogleDriveLink from './GoogleDriveLink';
import ProxyImage from './../ProxyImage';
import DisplayTimestamp from './../DisplayTimestamp';
var linkify = require('linkify-it')();

const processString = require('react-process-string');

class Comment extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      isOpenNotification: true
    };
  }

  closeNotification = () => {
    this.setState({
      isOpenNotification: false
    });
  }
  render () {
    const { comment, authenticated, commentObject, deleteComment, threadId, type, orgName } = this.props;
    const { isOpenNotification } = this.state;
    const show = authenticated && authenticated === comment.userId;
    let users = ['jordan', 'brian', '@jordan', '@brian']
    const processed = processString([{
      regex: /\@([a-z0-9_\-]+?)( |\,|$|\.|\!|\:|\'|\"|\?)/gim, //regex to match a username 
      fn: (key, result) => {
        return (
          <span>
            <Link className="color--primary" key={key} to={`/${orgName}/user/${result[1]}`}>@{result[1]}</Link>{result[2]}
          </span>
        );
      }
    }, {
      regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
      fn: (key, result) => {
        return (
          <span key={key}>
            <a target="_blank" href={result[0]}>{result[0]}</a>
          </span>
        );
      }
    }, {
      regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
      fn: (key, result) => {
        return (
          <span key={key}>
            <a target="_blank" href={`http://${result[0]}`}>{result[0]}</a>
          </span>
        );
      }
    }]);
  
    return (
      <div className="card comment-wrapper flx flx-align-center" id={'comment' + comment.id}>
        <div className="">
          <div className="flx flx-row flx-just-start">
            <Link
              to={`/user/${comment.username}`}
              className="mrgn-right-sm">
              <ProfilePic src={comment.image} className="user-image user-image-sm center-img" />
            </Link>
            <div className="comment-data flx flx-row flx-just-start">
              <div className="comment-row co-type-body font--beta">
                <Link
                  to={`/user/${comment.username}`}
                  className="comment-author color--primary">
                  {comment.username}
                </Link>
                <span className="opa-70">
                  {processed(comment.body)}
                  {
                    isOpenNotification &&
                    <GoogleDriveLink content={comment.body} onClose={this.closeNotification}/>
                  }
                </span>
  
                <div className="flx flx-row flx-just-start flx-align-center">
                  <div className="date-posted inline-block font--alpha">
                    <DisplayTimestamp timestamp={comment.lastModified} />
                  </div>
                  <DeleteButton 
                    show={show} 
                    commentObject={commentObject} 
                    commentId={comment.id} 
                    deleteComment={deleteComment} 
                    threadId={threadId} 
                    type={type} />
                </div>
              </div>
              
            </div>
          </div>
        </div>
       
          
      </div>
    );
  }
}
  
export default Comment;