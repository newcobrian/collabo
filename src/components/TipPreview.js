import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import * as Constants from '../constants';
import CommentContainer from './Review/CommentContainer';
import DisplayTimestamp from './DisplayTimestamp';

const mapStateToProps = state => ({
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});
 
const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`/review/${props.tip.subjectId}/${props.tip.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment"></div>
          {props.tip.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`/review/${props.tip.subjectId}/${props.tip.id}`}>
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
  if (props.tip.review.caption) {
    return (
      <div className="inline">{props.tip.review.caption}</div>
    )
  }
  else {
    return (
     <div className="inline opa-60">No review yet</div>
    )
  } 
}

const TipPreview = props => {
  const tip = props.tip;
      
  const handleSaveClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.SAVE_MODAL, props.tip, props.tip.images);
  }

  const onInfoClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.INFO_MODAL, props.tip);
  }

  return (
    <div className="tip-wrapper flx flx-col flx-col w-100 w-max">
      
      <div className="tip-container flx flx-col flx-center-all w-100">
          
        
            
            { /** Title and Address **/ }
            <div className="tip__title-module flx flx-row w-100">


              <div className="tip__right-module flx flx-col flx-align-end">


                { /** Image **/ }
                <div className="tip__image-module">
                  <div className="tip__photo-count">{tip.images.length > 0 ? tip.images.length : null}</div>
                  <ImagePicker images={tip.images} />
                </div>
                { /** END Image **/ }

                { /** Rating **/ }
                <div className={'tip__rating-module flx flx-row flx-align-center mrgn-top-sm w-100 tip__rating-module--' + tip.review.rating}>
                  <div className={'tip__rating flx-hold flx flx-row flx-center-all v2-type-rating--' +  tip.review.rating}>
                    {tip.review.rating}
                  </div>
                  <i className="rating-star-icon material-icons color--black opa-40 md-14">star</i>
                </div>
                { /** END Rating **/ }

                <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs DN">
                  <DisplayTimestamp timestamp={tip.review.lastModified} />
                </div>
                
              </div>


              <div className="flx flx-col w-100">

                  <div className="tip__title-wrapper flx flx-row flx-align-top w-100 hide-in-list">
                    <div className="tip__order-count DN v2-type-h3">{props.index}.</div>

                  

                  </div>
                <div className="tip__content-wrapper">

                  { /** Title **/ }
                  <Link to={`/review/${tip.subjectId}/${tip.id}`}>
                  <div className="hide-in-list tip__title v2-type-h3 ta-left">
                    <div className="tip__order-count">{props.index}.</div> {tip.subject.title} 
                  </div>
                  </Link>
                  { /** END Title **/ }

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
                  <div className="tip__caption-module flx flx-col w-100 pdding-right-lg mrgn-bottom-sm">
                    <div className="tip__caption v2-type-body2 ta-left opa-90">
                      <CaptionDisplay tip={props.tip} />
                    </div>
                  </div>

                  { /** Comments **/ }
                  <div className="flx flx-row flex-wrap cta-container">
                     <CommentContainer
                        authenticated={props.authenticated}
                        comments={tip.comments || []}
                        errors={props.commentErrors}
                        commentObject={tip}
                        itineraryId={props.itineraryId}
                        userInfo={props.userInfo}
                        type={Constants.REVIEW_TYPE}
                        deleteComment={props.deleteComment} />
                  </div> 
                  {/* Action Module */}
                  <div className="tip__cta-box w-100 flx flx-row flx-just-start flx-align-center mrgn-top-md">
                    <Link onClick={handleSaveClick} className="hide-in-list vb vb--sm vb--outline-none flx flx-row flx-align-center mrgn-right-sm color--white fill-primary">
                        {/*<img className="center-img mrgn-right-sm" src="/img/icons/i32_save.png"/>*/}
                        <i className="material-icons mrgn-right-sm color--white">playlist_add</i>
                        <div className="color--white">SAVE</div>
                    </Link>
                    <Link onClick={onInfoClick} className="hide-in-list vb vb--sm vb--outline flx flx-row flx-align-center mrgn-right-sm">
                      <i className="material-icons mrgn-right-sm opa-50">info_outline</i>
                      <div className="color--black">Info</div>
                    </Link>
                    <div className="vb__label v2-type-body0 opa-60 mrgn-top-sm DN">Save to</div>
                    <div className="cta-wrapper vb vb--sm vb--outline flx flx-row flx-align-center v2-type-body2 mrgn-right-sm">
                      <LikeReviewButton
                        authenticated={props.authenticated}
                        isLiked={props.tip.isLiked}
                        likesCount={props.tip.likesCount}
                        unLike={props.unLike}
                        like={props.like} 
                        likeObject={tip}
                        itineraryId={props.itineraryId}
                        type={Constants.REVIEW_TYPE} />
                    </div>
                  </div>
                  {/* END Action Module */}
                </div>
              </div>

             




           
          </div> { /** End photo / copy row **/ }

          
 



      </div> 
    </div>
  );
}

export default TipPreview;