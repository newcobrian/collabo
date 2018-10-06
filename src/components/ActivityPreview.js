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
      <div>
        Posted new thread&nbsp;
      </div>
    )
  }
  else if (props.activity.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div>
        Modified thread&nbsp;
      </div>
    )
  }
  else if (props.activity.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div>
        Commented&nbsp;
      </div>
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
     <Link to={`/${props.orgName}/${props.projectId}/${props.activity.activityId}`} className={"flx flx-col flx-col w-100 w-max"}>
        <div className="flx flx-col flx-align-start w-100"> 
        <div className="flx flx-row mrgn-left-xs ">
          <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
            <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
          </Link>
          <div className="flx flx-col">
            { /** Timestamp **/ }
            <div className="tip__timestamp v2-type-caption opa-40">
              <DisplayTimestamp timestamp={activity.lastModified} />
            </div>
            { /** END Timestamp **/ }
            <div className="co-type-body flx flx-row">
              <UpdateSection activity={activity} />: &nbsp;
              <div className="co-type-bold ta-left">
                  <Link to={`/${props.orgName}/${props.projectId}/${props.activity.activityId}`}> {activity.title}</Link>
              </div>
            </div>
            <div className="tip__caption font--beta v2-type-body2 ta-left mrgn-top-sm">
              <div dangerouslySetInnerHTML={{ __html: activity.body || '' }} />
              {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(thread.body) || '' }} />*/}
              </div>
            </div>
          </div>
        </div>

     

       


    </Link>
  );
}

const EditThreadItem = props => {
  if (!props.activity) return null;
  
  let activity = props.activity
  let createdBy = activity.createdBy

  return (
    <div className="flx flx-col flx-align-start w-100"> 
      <div className="flx flx-row mrgn-left-xs">

        <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row DN">
          <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
        </Link>
        <div className="color--primary co-type-body flx flx-row">
          <Link className="" to={'/' + props.orgName + '/user/' + createdBy.username}>{createdBy.username}</Link> edited post  
          <Link to={'/' + props.orgname + '/' + activity.projectId + '/' + activity.threadId}>{activity.title}</Link>
        </div>
        <div className="thread-timestamp">
          <DisplayTimestamp timestamp={activity.lastModified} />
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
      <div className="flx flx-col mrgn-left-xs">
        <div className="flx flx-row">
          <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="DN mrgn-right-xs tip__author-photo flx-hold mrgn-right-sm flx flx-row">
            <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
          </Link>
          <div className="flx flx-col">
            
            <div className="co-type-sub color--black opa-100">
              <Link className="color--black co-type-bold" to={'/' + props.orgName + '/user/' + createdBy.username}>{createdBy.username}</Link>

              <strong>Commented on thread: &nbsp; </strong>
              <Link className="color--black" to={'/' + props.orgName + '/' + activity.projectId + '/' + activity.threadId}>{activity.title}</Link>
            </div>

            <div className="thread-timestamp">
              <DisplayTimestamp timestamp={activity.lastModified} />
            </div>

            <div className="co-type-body mrgn-top-sm">
              {activity.body}
            </div>
          </div>

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