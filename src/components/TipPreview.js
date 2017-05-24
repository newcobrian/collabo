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
    <div className="reviews-wrapper roow roow-row-left roow-row-top mrgn-bottom-lg">

      <Link to={`review/${review.subjectId}/${review.id}`}>
      <div className="subject-image">
        <img className="center-img" src="../img/views.ramen.temp.png"/>
      </div>
      </Link>

      <div className="review-container roow roow-center roow-col-left">
        <div className="subject-name-container center-text">
          
          { /** Hidden Delete Button **/ }
          <div className="delete-wrapper">
            <div className="delete-button">
              <ReviewActions review={review} authenticated={props.authenticated} 
              canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />
            </div>
          </div>
          

          { /** Title and Add **/ }
          <div className="roow roow-row-top">
            <Link to={`review/${review.subjectId}/${review.id}`}>
            <div className="v2-type-h2 ta-left">
              {review.title}
            </div>
            </Link>
            <div className="v-button v-button--add flex-item-right">
              Add
            </div>
          </div>
          <div className="v2-type-mono mono-sm ta-left">
            {review.address}
          </div>

        { /** Rating and Like **/ }
          <div className="roow roow-row">
            <div className={'v2-type-rating ta-left v2-type-rating--' +  review.rating}>
              {review.rating}<div className="v2-type-rating--total"> /10</div>
            </div>
            <div className="roow roow-row flex-item-right v2-type-body2">
              0
              <div className="cta-wrapper">
                <div className="cta-icon cta-like"></div>
              </div>
            </div>
          </div>

        </div>{/**END subject-name-container**/}

      { /** Caption **/ }
        <div className="roow roow-row-top">
          <div className="review-data-container roow roow-col-left">
            <div className="subject-caption v2-type-body2 v2-type--italic ta-left pdding-top-sm">
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