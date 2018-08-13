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
      <div className="opa-40 color--black">
        posted a new thread
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="opa-40 color--black">
        modified the original post
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="opa-40 color--black">
        added a new comment
      </div>
    )
  }
  else return null;
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
  const createdBy = thread.createdBy;
  // let title = tip.subject ? tip.subject.title : ''
  // let canModify = props.authenticated === tip.userId ? true : false;

  return (
    <Link to={`/${props.orgName}/${props.projectId}/${props.thread.threadId}`} className={"thread-preview-wrapper flx flx-col flx-col w-100 w-max"}>
        
          <div className="thread-preview-container flx flx-row flx-align-start w-100">
                    <div className="thread-icon flx flx-center-all flx-hold">
                      <i className="material-icons color--black md-24 opa-70">fiber_manual_record

                      </i>
                    </div>

                    <div className="tip__content-inner flx flx-col">
                     
                      <div>
                      { /** Caption **/ }
                      <div className="tip__caption-module flx flx-col w-100 mrgn-bottom-sm brdr-02-bottom">
                        
                        <div className="flx flx-row">
                          <Link to={'/' + props.orgName + '/user/' + createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
                            <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                          </Link>
                          <div className="flx flx-col">
                            <div className="color--primary co-type-body flx flx-row">
                              <div className="co-type-bold mrgn-right-xs">{createdBy.username}</div> <UpdateSection thread={thread} />
                            </div>
                            { /** Timestamp **/ }
                            <div className="tip__timestamp v2-type-caption opa-40">
                              <DisplayTimestamp timestamp={thread.lastModified} />
                            </div>
                            { /** END Timestamp **/ }
                          </div>
                        </div>

                        <div className="flx flx-col flx-align-start w-100">
                            { /** Title **/ }
                            <div className="co-type-h4 ta-left mrgn-top-sm">
                              {/*<div className="tip__order-count color--black">{props.index}.</div>*/}
                              <Link to={`/${props.orgName}/${props.projectId}/${props.thread.threadId}`}> {thread.title}</Link>
                            </div>
                            { /** END Title **/ }

                            <div className="tip__caption font--beta v2-type-body2 ta-left pdding-left-sm pdding-top-sm opa-70">
                              <div className="caption-shadow">
                              </div>
                                <div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(Helpers.convertStoredToEditorState(thread.body)) || '' }} />
                              {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(thread.body) || '' }} />*/}
                                </div>

                            </div>
                        </div>

                      <CommentPreview orgName={props.orgName} thread={thread} />
                      </div>

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
             
            </div> { /** End photo / copy row **/ }

            </div>
    </Link>
  );
}

export default ThreadPreview;