import React from 'react';
import { Link } from 'react-router';
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
import ThreadList from './ThreadList';
import ProjectList from './ProjectList';
import LikeReviewButton from './LikeReviewButton';

var Scroll = require('react-scroll');
var Element = Scroll.Element;
var linkify = require('linkify-it')();





const UpdateIcon = props => {
  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <img className="center-img" src="/img/icon_post.png"/>
        {/**<div className="feed-gem circle"></div>**/}
        {/**<i className="material-icons color--primary md-24">assignment</i>**/}
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <img className="center-img" src="/img/icon_edit.png"/>
        {/**<div className="feed-gem square"></div>**/}
        {/**<i className="material-icons color--primary md-24">edit</i>**/}
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <img className="center-img" src="/img/icon_comment.png"/>
        {/**<div className="feed-gem diamond"></div>**/}
        {/**<i className="material-icons color--primary md-24">comment</i>**/}
      </div>
    )
  }
  else return (
    <div className="co-icon-wrapper flx flx-center-all">
      <div className="feed-gem"></div>
    </div>
    )
}

const ProjectLabel = props => {
  if (!props.projectId || !props.projectNames) {
    return null
  }
  else return (
    <div className="co-project-name">
      <Link className="co-type-caption text-hover flx flx-row flx-align-center" to={'/' + props.org.url + '/' + props.projectId}>
        {props.projectNames[props.projectId] ? props.projectNames[props.projectId].name : ''}
      </Link>
    </div> 
  )
}


 
const CommentPreview = props => {


  if (!props.thread) return null
  else if (props.thread.commentsCount) {
    return (
      <Link to={`/${props.org.url}/${props.thread.projectId}/${props.thread.threadId}`}>
        <div className="cta-wrapper cta-wrapper-comment v2-type-body2 flx flx-row flx-align-center w-100">
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

const UpdateSection = props => {
  
  const thread = props.thread;
  const lastUpdater = props.lastUpdater;

  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="body-preview co-type-body mrgn-right-xs opa-60 color--black w-100">
        <span className="preview-action">{lastUpdater.username} created a new thread: </span> 
        <span className="co-type-thread-body" dangerouslySetInnerHTML={{ __html: thread.body || '' }}></span>
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="body-preview co-type-body mrgn-right-xs opa-60 color--black w-100">
        <span className="preview-action">{lastUpdater.username} edited the post: </span>
        <span className="co-type-thread-body" dangerouslySetInnerHTML={{ __html: thread.body || '' }}></span>
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className=" body-preview co-type-body mrgn-right-xs opa-60 color--black w-100">
        <span className="preview-action">{lastUpdater.username} added a comment: </span>
        <span className="co-type-thread-body" dangerouslySetInnerHTML={{ __html: thread.body || '' }}></span>
      </div>
    )
  }
  else return null;
}

const ThreadPreview = props => {
  const thread = props.thread;
  const lastUpdater = props.lastUpdater;
  // const postAuthor = thread.lastUpdate === Constants.COMMENT_TYPE ? 
  //   ( thread.lastUpdater ? thread.lastUpdater : { username: '', userId: null, image: '' } ) : thread.createdBy;
  // const lastUpdater = thread.lastUpdater ? thread.lastUpdater : { username: '', userId: null, firstName: '', lastName: '', image: '' }
  // let title = tip.subject ? tip.subject.title : ''
  // let canModify = props.authenticated === tip.userId ? true : false;

  return (
    <div className={"tp-wrapper tp-small fill--secondary--10 flx flx-col flx-col"}>
        
        <div className="tp-container flx flx-col flx-align-start w-100 brdr-bottom">           
        
          <div className="thread-row-wrapper flx flx-row w-100">
            <div className="thread-content-wrapper flx flx-col w-100">

              <div className="flx flx-row flx-align-center w-100">

                <div className="updater-col flx flx-row flx-align-center flx-hold">
                  <Link to={'/' + props.org.url + '/user/' + lastUpdater.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
                    <ProfilePic src={lastUpdater.image} className="user-image user-image-sm center-img" />
                  </Link>

                  <div className="flx flx-col flx-align-start mobile-hide">
                    <div className="flx flx-row co-type-caption mrgn-left-xs">
                      <Link className="text-hover" to={'/' + props.org.url + '/user/' + lastUpdater.username}>{lastUpdater.username || ''}</Link> 
                      &nbsp;
                    </div>
                  </div>

                </div>
                <div className="preview-content color--black flx flx-col flx-just-center">
                  <div className="w-100 flx flx-row flx-just-start flx-align-center">
                    <ProjectLabel className="" projectNames={props.projectNames} projectId={thread.projectId} org={props.org} />
                    <div className="koi-type-caption opa-60 ta-right color--black flx-item-right mobile-show">
                      <DisplayTimestamp timestamp={thread.lastModified} />
                    </div>
                  </div>
                  <Link className="color--black co-post-preview-title text-hover" 
                        to={`/${props.org.url}/${props.projectId}/${thread.threadId}`}>
                        {thread.title}
                  </Link>
                  {/*} <UpdateSection thread={thread} lastUpdater={lastUpdater} />*/}
                </div>

                <div className="flx-item-right flx flx-col flx-just-end flx-hold">
                  <div className="thread-timestamp opa-60 ta-right color--black flx-item-right mrgn-bottom-sm mobile-hide">
                    <DisplayTimestamp timestamp={thread.lastModified} />
                  </div>
                  <div className="cta-container flx flx-row flx-just-end flx-item-right mobile-hide">
                    <LikeReviewButton
                      authenticated={props.authenticated}
                      isLiked={thread.likes && thread.likes[props.authenticated] ? true : false}
                      likesCount={Object.keys(thread.likes || {}).length}
                      objectId={thread.threadId}
                      thread={thread}
                      likeObject={thread}
                      type={Constants.THREAD_TYPE}
                      org={props.org} />
                      {/*<div className="koi-ico --24 ico--bookmark mrgn-left-md opa-20 no-click"></div>*/}

                  </div>
                </div>
                
              </div>
              <div className="cta-container flx flx-row w-100 flx-align-start mobile-show">
                <LikeReviewButton
                  authenticated={props.authenticated}
                  isLiked={thread.likes && thread.likes[props.authenticated] ? true : false}
                  likesCount={Object.keys(thread.likes || {}).length}
                  objectId={thread.threadId}
                  thread={thread}
                  likeObject={thread}
                  type={Constants.THREAD_TYPE}
                  org={props.org} />
                  {/*<div className="koi-ico --24 ico--bookmark mrgn-left-md opa-20 no-click flx-item-right"></div>*/}
              </div>
          
              {/*<div className="DN color--black thread-timestamp flx flx-row flx-align-center mrgn-bottom-md">
                <div>Created by <Link to={'/' + props.orgName + '/user/' + thread.createdBy.username} className="co-type-bold text-hover">{thread.createdBy.username}</Link> in </div>
                <ProjectLabel className="" projectNames={props.projectNames} projectId={thread.projectId} orgName={props.orgName} />
                <UpdateSection thread={thread} />
              </div>
              <div className="DN tip__caption mrgn-top-xs co-type-thread-body flx flx-col w-100 flx-align-start" dangerouslySetInnerHTML={{ __html: thread.body || '' }} />
                {/*<div className="tip__caption color--gray ta-left flx flx-row" dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(Helpers.convertStoredToEditorState(thread.body)) || '' }} />*/}

                
              </div>

          </div>
        </div>

        



   


    </div>
  );
}

export default ThreadPreview;