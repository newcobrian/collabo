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
  if (!props.activity) return null
  else if (props.activity.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div>
        new thread posted
      </div>
    )
  }
  else if (props.activity.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div>
        thread post was modified
      </div>
    )
  }
  else if (props.activity.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div>
        new comment
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
     <Link to={`/${props.orgName}/${props.projectId}/${props.activity.activityId}`} className={"tip-wrapper flx flx-col flx-col w-100 w-max"}>
        
          <div className="tip-container bx-shadow flx flx-row flx-align-start w-100">
            
          
              
              { /** Title and Address **/ }
              <div className="tip__title-module flx flx-col w-100">

                <div className="tip__right-module flx flx-row flx-m-col flx-align-center w-100">



                    { /** Title **/ }
                    <div className="hide-in-list tip__title tip-title ta-left">
                      {/*<div className="tip__order-count color--black">{props.index}.</div>*/}
                      <Link to={`/${props.orgName}/${props.projectId}/${props.activity.activityId}`}> {activity.title}</Link>
                    </div>

                    { /** END Title **/ }


                    {/* Action Module */}
                    <div className="tip__cta-box flx flx-row flx-just-start flx-align-center flx-item-right">
                    </div>
                    {/* END Action Module */}


                    { /** Timestamp **/ }
                    <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs ">
                      <DisplayTimestamp timestamp={activity.lastModified} />
                    </div>
                    { /** END Timestamp **/ }
                    
                  </div>
 


                  <div className="tip__content-wrapper">
                    <div className="tip__content-inner">
                      <div>
                        <UpdateSection activity={activity} />
                      </div>

                      { /** Author **/ }
                      <Link
                          to={'/user/' + createdBy.username}
                          className="show-in-list">
                        <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                            <div className="tip__author-photo flx-hold mrgn-right-sm">
                              <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                            </div> 
                            <div className="color--black v2-type-body1">
                              {createdBy.username}
                            </div>
                        </div>
                      </Link> 
                      { /** END Author **/ }


                      { /** Caption **/ }
                      <div className="tip__caption-module flx flx-row w-100 mrgn-bottom-sm brdr-02-bottom">
                        <Link to={'/user/' + createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm">
                          <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                        </Link> 
                        <div className="flx flx-col flx-align-start w-100">
                            <div className="tip__caption font--beta v2-type-body2 ta-left">
                              <div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(Helpers.convertStoredToEditorState(activity.body || '')) }} />
                            {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(thread.body) || '' }} />*/}
                            </div>


                            <div className="flx flx-row flx-just-start flx-align-center">
                              <div className="date-posted inline-block color--black v2-type-body1 opa-30 font--alpha">
                                <DisplayTimestamp timestamp={activity.lastModified} />
                              </div>
                            </div>
                          </div>
                      </div>

                      {/*<CommentPreview orgName={props.orgName} activity={activity} />*/}

                      { /** Comments  }
                      <div className="flx flx-row flex-wrap cta-container mrgn-top-sm">
                         <CommentContainer
                            authenticated={props.authenticated}
                            comments={tip.comments || {}}
                            errors={props.commentErrors}
                            commentObject={tip}
                            itineraryId={props.itineraryId}
                            userInfo={props.userInfo}
                            type={props.dataType}
                            deleteComment={props.deleteComment} />
                      </div> 
                    </div> 
                  { /** END tip__content-inner **/}

                  

                  </div>


               




             
            </div> { /** End photo / copy row **/ }

   


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
    <div> 
      <div>
        <Link to={'/' + props.orgName + '/user/' + createdBy.username}>{createdBy.username}</Link> edited a post:  
        <Link to={'/' + props.orgname + '/' + activity.projectId + '/' + activity.threadId}>{activity.title}</Link>
      </div>
      { /** Timestamp **/ }
      <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs ">
        <DisplayTimestamp timestamp={activity.lastModified} />
      </div>
    </div>
  )
}

const CommentItem = props => {
  if (!props.activity) return null;

  let activity = props.activity
  let createdBy = activity.createdBy

  return (
    <div> 
      <div>
        <Link to={'/' + props.orgName + '/user/' + createdBy.username}>{createdBy.username}</Link> commented on thread: 
          <Link to={'/' + props.orgname + '/' + activity.projectId + '/' + activity.threadId}>{activity.title}</Link>
      </div>
      <div>
        comment body: {activity.body}
      </div>
      { /** Timestamp **/ }
      <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs ">
        <DisplayTimestamp timestamp={activity.lastModified} />
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