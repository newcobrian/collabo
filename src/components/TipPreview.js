import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ReviewActions from './ReviewActions';
import FORWARD from '../constants';
import { FORWARD_MODAL, REVIEW_MODAL } from '../actions';

const CommentPreview = props => {
  if (props.comments) {
    return (
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper cta-wrapper-comment roow roow-col">
          <div className="cta-icon cta-comment"></div>
          {props.review.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper cta-wrapper-comment roow roow-col">
          <div className="cta-icon cta-comment comment-on"></div>
          Comment
        </div>
      </Link>
    )
  }
}

const TipPreview = props => {
  const review = props.review;
  const canModify = props.authenticated &&
      props.authenticated === props.review.userId;

  return (
    <div className="reviews-wrapper roow roow-left roow-col-left mrgn-bottom-lg bx-shadow">

        <Link to={`review/${review.subjectId}/${review.id}`}>
          <div className="subject-image">
            <ProxyImage className="gray-border" src={review.subjectImage ? review.subjectImage : ""}/>
          </div>
        </Link>

      <div className="review-container roow roow-center roow-col-left bottom-divider default-card-white">
        <div className="subject-name-container center-text">
          <div className="delete-wrapper">
            <div className="delete-button">
                <ReviewActions review={review} authenticated={props.authenticated} 
                canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />
            </div>
          </div>
          
          <Link to={`review/${review.subjectId}/${review.id}`}>
          <div className="text-subject-name v2-type-h2 center-text">
            {review.title}
          </div>
          </Link>
        </div>{/**END subject-name-container**/}
        <div className="roow roow-row-top pic-and-review">
          <div className="review-data-container roow roow-col-center">
              

              <div className="roow">

              </div>

              <div className="subject-caption v2-type-body2 center-text pdding-top-sm">
                {review.caption}
              </div>
              <div className="review-timestamp">
                {(new Date(review.lastModified)).toLocaleString()}
              </div>  
          </div>


        </div>

{/***        <div className="roow roow-row flex-wrap cta-container">
            <div className="cta-box roow roow-row-space">
              <div className="roow roow-col-left">
              
              </div>
              <CommentPreview comments={props.review.comments} review={props.review} />
              
              <div className="roow roow-row flex-item-right">
                <LikeReviewButton
                  authenticated={props.authenticated}
                  isLiked={props.review.isLiked}
                  likesCount={props.review.likesCount}
                  unLike={props.unLike}
                  like={props.like} 
                  review={review} />
                <SaveReviewButton 
                  authenticated={props.authenticated}
                  isSaved={props.review.isSaved}
                  unSave={props.unSave}
                  save={props.save} 
                  review={review} />
              </div>

              <Link className="cta-wrapper roow roow-col" onClick={handleForwardClick}>
                  <div className="cta-icon cta-share"></div>
                  Forward
                </Link>

              </div>             
          </div>

**/}

      </div> 
    </div>
  );
}

export default TipPreview;