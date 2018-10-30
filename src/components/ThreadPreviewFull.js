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
import AnimateHeight from 'react-animate-height';


var Scroll = require('react-scroll');
var Element = Scroll.Element;
var linkify = require('linkify-it')();

const UpdateSection = props => {
  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="mrgn-right-xs opa-80 color--black">
        created a new thread.
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="mrgn-right-xs opa-80 color--black">
        edited the post. 
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="mrgn-right-xs opa-80 color--black">
        added a comment
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
    <div className="co-project-name mrgn-left-xs">
      <Link className="co-type-bold text-hover" to={'/' + props.orgName + '/' + props.projectId}>
        {props.projectNames[props.projectId] ? props.projectNames[props.projectId].name : ''}
      </Link>
    </div> 
  )
}


 
const CommentPreview = props => {
  if (!props.thread) return null
  else if (props.thread.commentsCount) {
    return (
      <Link to={`/${props.orgName}/${props.thread.projectId}/${props.thread.threadId}`}>
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

const ThreadPreviewFull = props => {
  const thread = props.thread;
  const lastUpdater = props.lastUpdater;
  const createdBy = props.orgUserData && props.orgUserData[thread.userId] ? props.orgUserData[thread.userId] : { username: '' }

  // const postAuthor = thread.lastUpdate === Constants.COMMENT_TYPE ? 
  //   ( thread.lastUpdater ? thread.lastUpdater : { username: '', userId: null, image: '' } ) : thread.createdBy;
  //const lastUpdater = thread.lastUpdater ? thread.lastUpdater : { username: '', userId: null, firstName: '', lastName: '', image: '' }
  // let title = tip.subject ? tip.subject.title : ''
  // let canModify = props.authenticated === tip.userId ? true : false;

  return (
    <div className={"tp-wrapper tp-full flx flx-row"}>
        
        <div className="tp-container flx flx-col flx-align-start">           
          
          <div className="thread-row-wrapper flx flx-row">
            <div className="thread-content-wrapper w-100">
              <div className="flx flx-row flx-align-center w-100 mrgn-bottom-sm brdr-bottom pdding-bottom-sm DN">
                <Link to={'/' + props.orgName + '/user/' + lastUpdater.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
                  <ProfilePic src={lastUpdater.image} className="user-image user-image-sm center-img" />
                </Link>

                <div className="flx flx-col flx-align-start">
                  <div className="flx flx-row co-type-body mrgn-left-xs">
                    <Link className="co-type-bold text-hover" to={'/' + props.orgName + '/user/' + lastUpdater.username}>{lastUpdater.username || ''}</Link> 
                    &nbsp;<UpdateSection thread={thread} />
                  </div>
                  
                </div>
                <div className="thread-timestamp color--black flx-item-right">
                  <DisplayTimestamp timestamp={thread.lastModified} />
                </div>

              </div>

              <div className="color--black co-type-thread-title flx flx-row">
              
                <Link className="color--black" 
                      to={`/${props.orgName}/${props.projectId}/${thread.threadId}`}>
                      {thread.title}
                </Link>
              </div>
              <div className="co-type-thread-body" dangerouslySetInnerHTML={{ __html: thread.body || '' }}></div>

              <div className="color--black thread-timestamp flx flx-row flx-align-center mrgn-bottom-md">
                <div>Created by <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="co-type-bold text-hover">{createdBy.username}</Link> in </div>
                <ProjectLabel className="" projectNames={props.projectNames} projectId={thread.projectId} orgName={props.orgName} />
              
              </div>
              <div className="tip__caption mrgn-top-xs co-type-thread-body flx flx-col w-100 flx-align-start" dangerouslySetInnerHTML={{ __html: thread.body || '' }} />
                {/*<div className="tip__caption color--gray ta-left flx flx-row" dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(Helpers.convertStoredToEditorState(thread.body)) || '' }} />*/}

                <div className="cta-container flx flx-row flx-align-start mrgn-top-sm">
                  <div className="koi-ico ico--bookmark mrgn-right-md opa-20 no-click"></div>
                  <LikeReviewButton
                    authenticated={props.authenticated}
                    isLiked={thread.likes && thread.likes[props.authenticated] ? true : false}
                    likesCount={Object.keys(thread.likes || {}).length}
                    objectId={thread.threadId}
                    thread={thread}
                    likeObject={thread}
                    type={Constants.THREAD_TYPE}
                    orgName={props.orgName} />
                </div>
              </div>

          </div>
        </div>

        <div className="comment-row-wrapper flx flx-row">
          <div className="co-thread-reply-wrapper">
            <CommentContainer
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              comments={thread.comments || {}}
              errors={props.commentErrors}
              commentObject={thread}
              threadId={thread.threadId}
              thread={thread}
              project={props.project}
              orgName={props.orgName}
              orgUserData={props.orgUserData}
              type={Constants.THREAD_TYPE}
              deleteComment={props.deleteComment} />
          </div>
        </div>



   


    </div>
  );
}

export default ThreadPreviewFull;