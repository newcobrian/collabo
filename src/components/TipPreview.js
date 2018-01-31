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

const mapStateToProps = state => ({
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});
 
const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`/review/${props.tip.subjectId}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment"></div>
          {props.tip.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`/review/${props.tip.subjectId}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment comment-on"></div>
          Comment
        </div>
      </Link>
    )
  }
}

/* Displays user entered caption -OR- empty message if user has not entered caption */ 
const CaptionDisplay = props => {
  if (props.canModify) {
    return (
      <div className="tip__caption v2-type-body2 font--beta  ta-left opa-70">
        <RenderDebounceInput
          type="textarea"
          className="w-100 show-border"
          cols="20"
          wrap="hard"
          value={props.tip.review.caption}
          placeholder="Add notes here"
          debounceFunction={props.changeCaption(props.tip)} />
      </div>
    )
  }
  else if (props.tip.review.caption) {
    return (
      <div className="inline opa-70">{props.tip.review.caption}</div>
    )
  }
  else {
    return (
     <div className="inline opa-30">no review yet</div>
    )
  } 
}

const RatingDisplay = props => {
  // if viewer is the tip creator, let them modify
  if (props.canModify) {
    return(
      <div className={'tip__rating-module flx flx-row flx-align-center flx-hold w-100 tip__rating-module--' + props.tip.review.rating}>
        <select className="color--black" value={props.tip.review.rating} onChange={props.changeRating(props.tip)}>
          <option value="-">Add Rating</option>
          <option value="0">0/10 Run away</option>
          <option value="1">1/10 Stay away</option>
          <option value="2">2/10 Just bad</option>
          <option value="3">3/10 Don't go</option>
          <option value="4">4/10 Meh</option>
          <option value="5">5/10 Average</option>
          <option value="6">6/10 Solid</option>
          <option value="7">7/10 Go here</option>
          <option value="8">8/10 Really good</option>
          <option value="9">9/10 Must go</option>
          <option value="10">10/10 The best</option>
        </select>
      </div>
    )
  }
  // otherwise just show the rating
  else {
    if (!props.tip.review.rating) {
      return null
    }
    else {
      return (
        <div className={'tip__rating-module flx flx-row flx-align-center w-100 flx-hold tip__rating-module--' + props.tip.review.rating}>
          <div className={'tip__rating flx-hold flx flx-row flx-center-all v2-type-rating--' +  props.tip.review.rating}>
            {props.tip.review.rating}
          </div>
          <i className="rating-star-icon material-icons color--black opa-40 md-14 DN">star</i>
        </div>
      )
    }
  }
}

const TipPreview = props => {
  const tip = props.tip;
  let canModify = props.authenticated === tip.userId ? true : false;
      
  const handleSaveClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.SAVE_MODAL, props.tip, props.tip.images);
  }

  const onInfoClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.INFO_MODAL, props.tip);
  }

  const isSelectedTip = tipId => {
    if (tipId === props.selectedMarker) return ' tip-selected';
    return '';
  }

  const onTipClick = (tip) => ev => {
      ev.preventDefault();
      if (props.onSelectActiveTip) {
        props.onSelectActiveTip(tip);
      }
    }

  return (
    <Element name={'tip' + tip.key} className={"tip-wrapper flx flx-col flx-col w-100 w-max" + isSelectedTip(tip.key)} id={'tip' + tip.key} onClick={onTipClick(tip)}>
        
        <div className="tip-container flx flx-col flx-center-all w-100 bx- brdr-all">
            
          
              
              { /** Title and Address **/ }
              <div className="tip__title-module flx flx-col w-100">



                <div className="flx flx-col w-100">

                  <div className="tip__right-module flx flx-row w-100 flx-align-center">


                    { /** Image 
                    <MediaQuery query="(min-device-width: 1224px)">**/ }
                      <div className="tip__image-module bx-shadow bg-loading">
                        <div className={"tip__photo-count tip-count-" + tip.images.length}>{tip.images.length > 0 ? tip.images.length : null}</div>
                        <ImagePicker images={tip.images} />
                      </div>
                      { /** END Image
                    </MediaQuery> **/ }

                    { /** Title **/ }
                    <div className="hide-in-list tip__title tip-title ta-left mrgn-left-md">
                      <div className="tip__order-count color--black">{props.index}.</div>
                      <Link to={`/review/${tip.subjectId}`}> {tip.subject.title}</Link>
                    </div>
                    { /** END Title **/ }

                    { /** Timestamp **/ }
                    <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs DN">
                      <DisplayTimestamp timestamp={tip.review.lastModified} />
                    </div>
                    { /** END Timestamp **/ }

                    {/* More Options button */}
                    {props.dataType === Constants.RECOMMENDATIONS_TYPE && canModify && 
                      <div className="edit-itinerary-link vb vb--xs flx-item-right no-pad vb--outline--none opa-20 fill--white color--black">             
                        <MuiThemeProvider muiTheme={getMuiTheme()}>
                          <IconMenu
                             iconButtonElement={<IconButton className=""><MoreHorizIcon /></IconButton>}
                             anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                             targetOrigin={{horizontal: 'left', vertical: 'top'}}
                           >
                          <div className="vb vb--sm vb--shadow-none fill--white color--primary danger-hover"
                            onClick={props.deleteRec(tip)}>Delete Recommendation
                          </div>
                            
                           </IconMenu>
                         </MuiThemeProvider>
                      </div>}
                    {/* END More Options button */}
                    
                  </div>
 


                  <div className="tip__content-wrapper">
                    <div className="tip__content-inner">
                      { /** Author **/ }
                      <Link
                          to={'/' + tip.createdBy.username}
                          className="show-in-list">
                        <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                            <div className="tip__author-photo flx-hold mrgn-right-sm">
                              <ProfilePic src={tip.createdBy.image} className="user-image user-image-sm center-img" />
                            </div> 
                            <div className="color--black v2-type-body1">
                              {tip.createdBy.username}
                            </div>
                        </div>
                      </Link> 
                      { /** END Author **/ }


                      { /** Caption **/ }
                      <div className="tip__caption-module flx flx-row w-100 mrgn-bottom-sm brdr-02-bottom pdding-bottom-sm">
                        <Link to={'/' + tip.createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm">
                          <ProfilePic src={tip.createdBy.image} className="user-image user-image-sm center-img" />
                        </Link> 
                        <div className="flx flx-col flx-align-start">
                            {/* Tags Wrapper **/ }
                            <div className="flx flx-row flx-align-center flx-wrap pdding-bottom-xs">

                              { /** Rating **/ }
                              <RatingDisplay
                                canModify={canModify}
                                tip={tip}
                                changeRating={props.changeRating}
                                />
                              { /** END Rating **/ }

                             
                            </div>
                            {/* END Tags Wrapper **/ }
                            <div className="tip__caption font--beta v2-type-body2 ta-left">
                              <Link to={'/' + tip.createdBy.username} className="strong">{tip.createdBy.username} </Link>
                              <CaptionDisplay 
                                tip={props.tip} 
                                canModify={canModify} 
                                changeCaption={props.changeCaption} />
                            </div>

                            {/* Tags list **/ }
                            <div className="w-100 flx flx-row flx-align-center">
                              { 
                                Object.keys(tip.tags || {}).map(function (tagName) {
                                  return (
                                    <div className="tip-tag fill--light-gray flx flx-row flx-align-center" key={tagName}>
                                      <div className="">
                                        {tagName}
                                      </div>
                                    </div>
                                  )
                                }, this)}
                            </div>


                            <div className="flx flx-row flx-just-start flx-align-center">
                              <div className="date-posted inline-block color--black font--alpha">
                                <DisplayTimestamp timestamp={tip.review.lastModified} />
                              </div>
                            </div>
                          </div>
                      </div>

                      { /** Comments **/ }
                      <div className="flx flx-row flex-wrap cta-container mrgn-top-sm">
                         <CommentContainer
                            authenticated={props.authenticated}
                            comments={tip.comments || []}
                            errors={props.commentErrors}
                            commentObject={tip}
                            itineraryId={props.itineraryId}
                            userInfo={props.userInfo}
                            type={props.dataType}
                            deleteComment={props.deleteComment} />
                      </div> 
                    </div> 
                  { /** END tip__content-inner **/}

                  {/* Action Module */}
                  <div className="tip__cta-box w-100 flx flx-row flx-just-start flx-align-center mrgn-top-md">
                    <Link onClick={handleSaveClick} className="w-33 hide-in-list vb vb--tip vb--outlin--none flx flx-row flx-align-center brdr-top brdr-right color--black fill--white">
                        {/*<img className="center-img mrgn-right-sm" src="/img/icons/i32_save.png"/>*/}
                        <i className="material-icons color--primary mrgn-right-sm md-24">playlist_add</i>
                        <div className="color--black v2-type-body0 weight-500">Add to</div>
                    </Link>
                    
                    <div className="w-33 cta-wrapper vb vb--tip vb--outline--none flx flx-row flx-align-center v2-type-body2 brdr-top brdr-right">
                      <LikeReviewButton
                        authenticated={props.authenticated}
                        isLiked={props.tip.isLiked}
                        likesCount={props.tip.likesCount}
                        likeObject={tip}
                        itineraryId={props.itineraryId}
                        type={props.dataType} />
                    </div>

                    <Link onClick={onInfoClick} className="w-33 hide-in-list vb vb--tip vb--outline--none flx flx-row flx-align-center brdr-top">
                      <i className="material-icons opa-60 mrgn-right-sm">info_outline</i>
                      <div className="color--black v2-type-body0 weight-500">Info</div>
                    </Link>
                    {/*<Link to={googleMapLink} className="w-20 hide-in-list vb vb--tip vb--outline--none flx flx-row flx-align-center brdr-top">
                      <i className="material-icons md-24">place</i>
                    </Link> */}

                  </div>
                  {/* END Action Module */}

                  </div>
                </div>

               




             
            </div> { /** End photo / copy row **/ }

            
   



        </div> 

    </Element>
  );
}

export default TipPreview;