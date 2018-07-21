import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import * as Constants from '../constants';
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
 
const CommentPreview = props => {
  if (!props.thread) return null
  else if (props.thread.commentsCount) {
    return (
      <Link to={`/${props.orgName}/${props.projectId}/${props.thread.threadId}`}>
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
    <Link to={`/${props.orgName}/${props.projectId}/${props.thread.threadId}`} className={"tip-wrapper flx flx-col flx-col w-100 w-max"}>
        
          <div className="tip-container flx flx-row flx-align-start w-100 bx- brdr-bottom">
            
          
              
              { /** Title and Address **/ }
              <div className="tip__title-module flx flx-col w-100">

                <div className="tip__right-module flx flx-row flx-m-col flx-align-center w-100">



                    { /** Title **/ }
                    <div className="hide-in-list tip__title tip-title ta-left">
                      {/*<div className="tip__order-count color--black">{props.index}.</div>*/}
                      <Link to={`/${props.orgName}/${props.projectId}/${props.thread.threadId}`}> {thread.title}</Link>
                    </div>

                    { /** END Title **/ }


                    {/* Action Module */}
                    <div className="tip__cta-box flx flx-row flx-just-start flx-align-center flx-item-right">
                      
                      {/* Tags Wrapper **/ }
                      <div className="flx flx-row flx-align-center flx-wrap pdding-bottom-xs">

                       
                      </div>
                      {/* END Tags Wrapper **/ }


                      <div className="cta-wrapper vb vb--tip vb--outline--none flx flx-row flx-align-center v2-type-body2 DN">
                        <LikeReviewButton
                          authenticated={props.authenticated}
                          isLiked={props.thread.likes ? props.thread.likes[this.props.authenticated] : false}
                          likesCount={props.thread.likesCount}
                          likeObject={thread}
                          projectId={props.projectId}
                          type={props.dataType} />
                      </div>

                    </div>
                    {/* END Action Module */}


                    { /** Timestamp **/ }
                    <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs DN">
                      <DisplayTimestamp timestamp={thread.lastModified} />
                    </div>
                    { /** END Timestamp **/ }
                    
                  </div>
 


                  <div className="tip__content-wrapper">
                    <div className="tip__content-inner">
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
                              <div dangerouslySetInnerHTML={{ __html: thread.body }} />
                            </div>


                            <div className="flx flx-row flx-just-start flx-align-center">
                              <div className="date-posted inline-block color--black v2-type-body1 opa-30 font--alpha">
                                <DisplayTimestamp timestamp={thread.lastModified} />
                              </div>
                            </div>
                          </div>
                      </div>

                      <CommentPreview thread={thread} />

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

export default ThreadPreview;