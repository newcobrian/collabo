import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import CommentContainer from './Review/CommentContainer';
import DisplayTimestamp from './DisplayTimestamp';
import MediaQuery from 'react-responsive';
import RenderDebounceInput from './RenderDebounceInput';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

var Scroll = require('react-scroll');
var Element = Scroll.Element;
var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  ...state.project,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const UpdateSection = props => {
  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="color--black">
        posted a new thread
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="color--black">
        edited
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="color--black">
        commented in
      </div>
    )
  }
  else return null;
}

const UpdateIcon = props => {
  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        {/**<img className="center-img" src="/img/icon_newthread.png"/>**/}
        <div className="feed-gem circle"></div>
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <div className="feed-gem square"></div>
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <div className="feed-gem diamond"></div>
      </div>
    )
  }
  else return (
    <div className="co-icon-wrapper flx flx-center-all">
      <div className="feed-gem"></div>
    </div>
    )
}


 
const CommentPreview = props => {
  if (!props.thread) return null
  else if (props.thread.commentsCount) {
    return (
      <Link to={`/${props.orgName}/${props.thread.projectId}/${props.thread.threadId}`}>
        <div className="cta-wrapper cta-wrapper-comment v2-type-body2 flx flx-row flx-align-center">
          <div className="material-icons color--black md-18 opa-60 mrgn-right-sm">comment</div>
          {props.thread.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return null
    // return (
    //   <Link to={`/thread/${props.thread.threadId}`}>
    //     <div className="cta-wrapper cta-wrapper-comment flx flx-col">
    //       <div className="cta-icon cta-comment comment-on"></div>
    //       Comment
    //     </div>
    //   </Link>
    // )
  }
}

const ThreadPreview = props => {
  const thread = props.thread;
  const postAuthor = thread.lastUpdate === Constants.COMMENT_TYPE ? 
    ( thread.lastComment ? thread.lastComment : { username: '', userId: null, image: '' } ) : thread.createdBy;
  // let title = tip.subject ? tip.subject.title : ''
  // let canModify = props.authenticated === tip.userId ? true : false;

  return (
    <Link to={`/${props.orgName}/${props.projectId}/${props.thread.threadId}`} className={"thread-preview-wrapper flx flx-col flx-col w-100"}>
        
        <div className="thread-preview-container flx flx-row flx-align-start w-100">
          <div className="thread-icon flx flx-center-all flx-hold mrgn-right-md">
            <UpdateIcon thread={thread} />
          </div>

          <div className="tip__content-inner flx flx-col w-100">
           
            { /** Caption **/ }
            <div className="tip__caption-module flx flx-col w-100 brdr-02-bottom w-100">
              
              <div className="flx flx-row w-100 flx-align-center">
                <Link to={'/' + props.orgName + '/user/' + postAuthor.username} className="tip__author-photo flx-hold mrgn-right-md flx flx-row">
                  <ProfilePic src={postAuthor.image} className="user-image user-image-sm center-img" />
                </Link>
                <div className="flx flx-col w-100">
                  <div className="flx flx-row w-100">
                    <div className="color--black co-post-title flx flx-row">
                      <div className="color--feed-link">{postAuthor.username || ''}</div>
                      &nbsp;<UpdateSection thread={thread} />
                      &nbsp;<Link className="color--feed-link" 
                                  to={`/${props.orgName}/${props.projectId}/${props.thread.threadId}`}>
                                  {thread.title}
                            </Link>
                    </div>
                    <div className="thread-timestamp flx-item-right">
                      <DisplayTimestamp timestamp={thread.lastModified} />
                    </div>
                  </div>
                  <div className="tip__caption co-type-sub ta-left opa-60 mrgn-top-xs">
                      <div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(Helpers.convertStoredToEditorState(thread.body)) || '' }} />
                    {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(thread.body) || '' }} />*/}
                      </div>
                  </div>
                </div>
              </div>


            {/**<CommentPreview className="DN" orgName={props.orgName} thread={thread} />**/}
          </div>
   
          </div> { /** End photo / copy row **/ }


    </Link>
  );
}

export default ThreadPreview;