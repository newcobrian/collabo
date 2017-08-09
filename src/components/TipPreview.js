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
    // console.log('comments = ' + JSON.stringify(props.comments))
    return (
      <Link to={`/review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment"></div>
          {props.review.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`/review/${props.review.subjectId}/${props.review.id}`}>
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
  if (props.review.caption) {
    return (
      <div className="inline">{props.review.caption}</div>
    )
  }
  else {
    return (
     <div className="inline opa-60">No review yet</div>
    )
  } 
}

const TipPreview = props => {
  const review = props.review;
  const canModify = props.authenticated &&
      props.authenticated === review.userId;
      
  const handleSaveClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.SAVE_MODAL, props.review, props.review.images);
  }

  const onInfoClick = ev => {
    ev.preventDefault();
    props.showModal(Constants.INFO_MODAL, props.review);
  }

  return (
    <div className="tip-wrapper flx flx-col flx-col w-100">
      
      <div className="tip-container flx flx-col flx-align-center">
          
          <div className="tip-inner flx flx-col flx-just-start w-100 w-max-2">
            
            { /** Title and Address **/ }
            <div className="tip__title-module flx flx-row w-100 mrgn-bottom-md">
              <div className="tip__order-count v2-type-h3 flx-item-right">{props.index}.</div>
              <div className="tip__title-wrapper flx flx-row flx-align-top w-100 hide-in-list">
                <Link to={`/review/${review.subjectId}/${review.id}`}>
                <div className="tip__title v2-type-h3 ta-left">
                  {review.title} 
                </div>
                </Link>
              </div>
            </div>


            <div className="flx fl-row">
              
              { /** Image **/ }
              <div className="tip__image-module mrgn-right-lg">
                <div className="tip__photo-count">{review.images.length > 0 ? review.images.length : null}</div>
                <ImagePicker images={review.images} />
              </div>





                {/* Non-image module on right */}
                <div className="tip__data-module flx flx-col flx-align-start w-100">

                  <div className="flx flx-col mrgn-bottom-sm">

                    { /** Rating and Caption **/ }
                    <div className="tip__rating-module flx flx-row flx-align-start mrgn-bottom-sm w-100">
                      <div className={'tip__rating flx-hold v2-type-rating--' +  review.rating}>
                        {review.rating}<div className="v2-type-rating--total opa-50 weight-300"></div>
                      </div>
            
                      { /** Caption **/ }
                      <div className="tip__caption-module flx flx-col w-100 pdding-right-md">
                        <div className="tip__caption v2-type-body2 ta-left">
                          <CaptionDisplay review={props.review} />
                        </div>
                      </div> 
                    </div>

                    <div className="tip__timestamp v2-type-caption opa-20 mrgn-top-xs">
                      <DisplayTimestamp timestamp={review.lastModified} />
                    </div>


                    { /** Comments **/ }
                    <div className="flx flx-row flex-wrap cta-container">
                       <CommentContainer
                          authenticated={props.authenticated}
                          comments={review.comments || []}
                          errors={props.commentErrors}
                          commentObject={review}
                          itineraryId={props.itineraryId}
                          userInfo={props.userInfo}
                          type={Constants.REVIEW_TYPE}
                          deleteComment={props.deleteComment} />
                    </div> 
                  </div>

                  {/* Action Module */}
                  <div className="tip__cta-box w-100 flx flx-row flx-just-start flx-align-center mrgn-top-md">
                    <Link onClick={onInfoClick} className="hide-in-list vb vb--sm vb--outline flx flx-row flx-align-center mrgn-right-sm">
                      <img className="center-img mrgn-right-sm" src="/img/icons/i32_info.png"/>
                      <div className="color--black">Info</div>
                    </Link>
                    <Link onClick={handleSaveClick} className="vb vb--sm vb--outline flx flx-row flx-align-center mrgn-right-sm">
                        <img className="center-img mrgn-right-sm" src="/img/icons/i32_save.png"/>
                        <div className="color--black">SAVE</div>
                    </Link>
                    <div className="vb__label v2-type-body0 opa-60 mrgn-top-sm DN">Save to</div>
                    <div className="cta-wrapper vb vb--sm vb--outline flx flx-row flx-align-center v2-type-body2 mrgn-right-sm">
                      <LikeReviewButton
                        authenticated={props.authenticated}
                        isLiked={props.review.isLiked}
                        likesCount={props.review.likesCount}
                        unLike={props.unLike}
                        like={props.like} 
                        likeObject={review}
                        itineraryId={props.itineraryId}
                        type={Constants.REVIEW_TYPE} />
                    </div>
                  </div>
                
                     

                   

                  </div>

            

            </div> { /** End right col stack **/ }

           
          </div> { /** End photo / copy row **/ }

          
 



      </div> 
    </div>
  );
}

export default TipPreview;