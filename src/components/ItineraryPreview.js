import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import ProxyImage from './ProxyImage';
import ReviewActions from './ReviewActions';
import FORWARD from '../constants';
import { FORWARD_MODAL, REVIEW_MODAL } from '../actions';
import { ITINERARY_TYPE } from '../constants';

const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment"></div>
          {props.itinerary.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper cta-wrapper-comment flx flx-col">
          <div className="cta-icon cta-comment comment-on"></div>
          Comment
        </div>
      </Link>
    )
  }
}

const ItineraryPreview = props => {
  const itinerary = props.itinerary;
  const canModify = props.authenticated &&
      props.authenticated === props.itinerary.userId;

  return (
    <div className="reviews-wrapper flx flx-left flx-col-left mrgn-bottom-lg bx-shadow">

        <Link to={`itinerary/${itinerary.id}`}>
          <div className="subject-image">
            <ProxyImage className="gray-border" src={itinerary.subjectImage ? itinerary.subjectImage : ""}/>
          </div>
        </Link>

      <div className="review-container flx flx-center flx-col-left bottom-divider default-card-white">
        <div className="subject-name-container center-text">
          <div className="delete-wrapper">
            <div className="delete-button">
                <ReviewActions review={itinerary} authenticated={props.authenticated} 
                canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />
            </div>
          </div>
          
          <Link to={`itinerary/${itinerary.id}`}>
          <div className="text-subject-name v2-type-h2 center-text">
            {itinerary.title}
          </div>
          </Link>
        </div>{/**END subject-name-container**/}
        <div className="flx flx-row-top pic-and-review">
          <div className="review-data-container flx flx-col-center">
              

              <div className="flx">

              </div>

              <div className="subject-caption v2-type-body2 center-text pdding-top-sm">
                {itinerary.description}
              </div>
              <div className="review-timestamp">
                {(new Date(itinerary.lastModified)).toLocaleString()}
              </div>  
          </div>


        </div>

        <div className="flx flx-row flex-wrap cta-container">
            <div className="cta-box flx flx-row-space">
              <div className="flx flx-col-left">
              
              </div>
              <CommentPreview comments={props.itinerary.comments} itinerary={props.itinerary} />
              
              <div className="flx flx-row flex-item-right">
                <LikeReviewButton
                  authenticated={props.authenticated}
                  isLiked={props.itinerary.isLiked}
                  likesCount={props.itinerary.likesCount}
                  unLike={props.unLike}
                  like={props.like} 
                  likeObject={itinerary}
                  type={ITINERARY_TYPE} />

{/***}              <Link className="cta-wrapper flx flx-col" onClick={handleForwardClick}>
                  <div className="cta-icon cta-share"></div>
                  Forward
                </Link>
**/}
              </div>
            </div>             
        </div>



      </div> 
    </div>
  );
}

export default ItineraryPreview;