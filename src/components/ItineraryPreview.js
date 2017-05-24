import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import ProxyImage from './ProxyImage';
import ReviewActions from './ReviewActions';
import FORWARD from '../constants';
import { FORWARD_MODAL, REVIEW_MODAL } from '../actions';

const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper cta-wrapper-comment roow roow-col">
          <div className="cta-icon cta-comment"></div>
          {props.itinerary.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`itinerary/${props.itinerary.id}`}>
        <div className="cta-wrapper cta-wrapper-comment roow roow-col">
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
    <div className="reviews-wrapper roow roow-left roow-col-left mrgn-bottom-lg bx-shadow">

        <Link to={`itinerary/${itinerary.id}`}>
          <div className="subject-image">
            <ProxyImage className="gray-border" src={itinerary.subjectImage ? itinerary.subjectImage : ""}/>
          </div>
        </Link>

      <div className="review-container roow roow-center roow-col-left bottom-divider default-card-white">
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
        <div className="roow roow-row-top pic-and-review">
          <div className="review-data-container roow roow-col-center">
              

              <div className="roow">

              </div>

              <div className="subject-caption v2-type-body2 center-text pdding-top-sm">
                {itinerary.description}
              </div>
              <div className="review-timestamp">
                {(new Date(itinerary.lastModified)).toLocaleString()}
              </div>  
          </div>


        </div>

        <div className="roow roow-row flex-wrap cta-container">
            <div className="cta-box roow roow-row-space">
              <div className="roow roow-col-left">
              
              </div>
              <CommentPreview comments={props.itinerary.comments} itinerary={props.itinerary} />
              
              <div className="roow roow-row flex-item-right">
                <LikeReviewButton
                  authenticated={props.authenticated}
                  isLiked={props.itinerary.isLiked}
                  likesCount={props.itinerary.likesCount}
                  unLike={props.unLike}
                  like={props.like} 
                  likeObject={itinerary}
                  type="itinerary" />

{/***}              <Link className="cta-wrapper roow roow-col" onClick={handleForwardClick}>
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