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

const UpdateSection = props => {
  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="flx-hold mrgn-right-xs opa-40">
        created a new thread.
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="flx-hold mrgn-right-xs opa-40">
        edited the post. 
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="flx-hold mrgn-right-xs opa-40">
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
    <div className="flx-item-right co-project-name"><Link to={'/' + props.orgName + '/' + props.projectId}>{props.projectNames[props.projectId]}</Link></div> 
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

const ThreadPreview = props => {
  const thread = props.thread;
  // const postAuthor = thread.lastUpdate === Constants.COMMENT_TYPE ? 
  //   ( thread.lastUpdater ? thread.lastUpdater : { username: '', userId: null, image: '' } ) : thread.createdBy;
  const postAuthor = thread.lastUpdater ? thread.lastUpdater : { username: '', userId: null, firstName: '', lastName: '', image: '' }
  // let title = tip.subject ? tip.subject.title : ''
  // let canModify = props.authenticated === tip.userId ? true : false;

  return (
    <div className={"tp-wrapper fill--primary--20 flx flx-col flx-col"}>
        
        <div className="tp-container b--primary--10 flx flx-col flx-align-start bx-shadow">           

          <div className="thread-row-wrapper flx flx-row fill--primary">
            <div className="thread-content-wrapper w-100">
              <div className="flx flx-row flx-align-start w-100 mrgn-bottom-md brdr-bottom">
                <Link to={'/' + props.orgName + '/user/' + postAuthor.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
                  <ProfilePic src={postAuthor.image} className="user-image user-image-sm center-img" />
                </Link>

                <div className="flx flx-col flx-align-start mrgn-bottom-sm">
                  <div className="flx flx-row co-type-body">
                    <div className="co-type-bold">{postAuthor.username || ''}</div> 
                    &nbsp;<UpdateSection thread={thread} />
                  </div>
                  <div className="thread-timestamp color--black opa-40">
                    <DisplayTimestamp timestamp={thread.lastModified} />
                  </div>
                </div>

                <ProjectLabel className="DN" projectNames={props.projectNames} projectId={thread.projectId} orgName={props.orgName} />

              </div>

              <div className="color--black co-post-title flx flx-row">
                <Link className="color--black" 
                      to={`/${props.orgName}/${props.projectId}/${thread.threadId}`}>
                      {thread.title}
                </Link>
              </div>
              <div className="color--black co-type-sub flx flx-row mrgn-bottom-md opa-30">
                Created by Jimmy
              </div>
              <div className="tip__caption mrgn-top-xs co-type-body flx flx-col w-100 flx-align-start" dangerouslySetInnerHTML={{ __html: thread.body || '' }} />
                {/*<div className="tip__caption color--gray ta-left flx flx-row" dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(Helpers.convertStoredToEditorState(thread.body)) || '' }} />*/}

                <div className="cta-container flx flx-row flx-align-start mrgn-top-sm mrgn-bottom-md">
                  <div className="koi-ico koi-ico-bookmark mrgn-right-md opa-30"></div>
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
                usersList={props.usersList}
                type={Constants.THREAD_TYPE}
                deleteComment={props.deleteComment} />
            </div>
          </div>
        </div>


   


    </div>
  );
}

export default ThreadPreview;