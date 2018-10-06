import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
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
  if (!props.activity) return null
  else if (props.activity.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <span>
        Posted new thread&nbsp;
      </span>
    )
  }
  else if (props.activity.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <span>
        Modified thread&nbsp;
      </span>
    )
  }
  else if (props.activity.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <span>
        Commented&nbsp;
      </span>
    )
  }
  else return null;
}
 
const CommentPreview = props => {
  if (!props.activity) return null
  else if (props.activity.commentsCount) {
    return (
      <Link to={`/${props.orgName}/${props.activity.projectId}/${props.activity.activityId}`}>
        <div className="cta-wrapper cta-wrapper-comment v2-type-body2 flx flx-row flx-align-center">
          <div className="material-icons color--black md-18 opa-60 mrgn-right-sm">comment</div>
          {props.activity.commentsCount} Comments
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

const NewThreadItem = props => {
  if (!props.activity) return null
  let activity = props.activity
  let createdBy = activity.createdBy

  return (
     <div className={"thread-preview-container flx flx-col flx-align-start w-100"}>
        <div className="flx flx-col flx-align-start w-100"> 
          
          <div className="flx flx-row">
            <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
              <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
            </Link>
            <div className="flx flx-col">

              <div className="thread-timestamp">
                Composed new thread&nbsp;&#xb7;&nbsp;<DisplayTimestamp timestamp={activity.lastModified} />
              </div>

              <Link className="co-type-bold co-type-label--lg" to={`/${props.orgName}/${props.projectId}/${props.activity.activityId}`}> {activity.title}</Link>

            </div>
          </div>
          
          <div className="indent-border brdr-color--primary co-type-body ta-left mrgn-top-sm">
            <div dangerouslySetInnerHTML={{ __html: activity.body || '' }} />
            {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(thread.body) || '' }} />*/}
          </div>
        </div>
          
    </div>
  );
}

const EditThreadItem = props => {
  if (!props.activity) return null;
  
  let activity = props.activity
  let createdBy = activity.createdBy

  return (
    <div className="thread-preview-container flx flx-col flx-align-start w-100"> 
      <div className="flx flx-col flx-align-start w-100">

        <div className="flx flx-row">
          <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
            <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
          </Link>
          <div className="co-type-label--lg">
            <div className="thread-timestamp">
              Edited thread&nbsp;&#xb7;&nbsp;<DisplayTimestamp timestamp={activity.lastModified} />
            </div>
            <Link className="co-type-bold" to={'/' + props.orgname + '/' + activity.projectId + '/' + activity.threadId}>{activity.title}</Link>

          </div>
        </div>
 
      </div>
    </div>
  )
}

const CommentItem = props => {
  if (!props.activity) return null;

  let activity = props.activity
  let createdBy = activity.lastComment ? activity.lastComment : { username: '', userId: null, image: '' }

  return (
    <div className="thread-preview-container flx flx-col flx-align-start w-100">
      <div className="flx flx-col flx-align-start w-100">

        <div className="flx flx-row">
          <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="mrgn-right-xs tip__author-photo flx-hold mrgn-right-sm flx flx-row">
            <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
          </Link>
          <div className="flx flx-col">
            
            <div className="thread-timestamp">
              Commented&nbsp;&#xb7;&nbsp;<DisplayTimestamp timestamp={activity.lastModified} />
            </div>
            <Link className="co-type-label--lg co-type-bold" to={'/' + props.orgName + '/' + activity.projectId + '/' + activity.threadId}>{activity.title}</Link>

          </div>

        </div>

        <div className="indent-border brdr-color--primary co-type-body mrgn-top-sm">
          {activity.body}
        </div>

      </div>
    </div>
  )
}

const ActivityPreview = props => {
  const activity = props.activity;

  if (activity.type === Constants.NEW_THREAD_TYPE) {
    return (
      <NewThreadItem activity={activity} orgName={props.orgName} />
      )
  }
  else if (activity.type === Constants.EDIT_THREAD_TYPE) {
    return (
      <EditThreadItem activity={activity} orgName={props.orgName} />
    )
  }
  else if (activity.type === Constants.COMMENT_TYPE) {
    return (
      <CommentItem activity={activity} orgName={props.orgName} />
      )
  }
  else return null
}

export default ActivityPreview;