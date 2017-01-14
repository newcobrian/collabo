import React from 'react';
import { Link } from 'react-router';

const LikeReviewButton = props => {
  // let classes = 'btn btn-sm action-btn';
  let classes = '';
  if (props.isLiked) {
    // classes += ' btn-secondary';
    classes += 'cta-icon cta-liked';
  } else {
    // classes += ' btn-outline-secondary';
    classes += 'cta-icon cta-like';
  }

  let likeText = ' Likes';
  if (props.likesCount === 1) {
    likeText = ' Like'
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.isLiked) {
      props.unLike(props.userId, props.reviewId);
    } else {
      props.like(props.userId, props.reviewId);
    }
  };

  return (
    <div
      className="cta-wrapper roow roow-col"
      onClick={handleClick}>
      <div className={classes}>
      </div>
      {props.likesCount} {likeText}
    </div>
  );
};

const ReviewPreview = props => {
  const review = props.review;
  const reviewer = props.reviewer;
  return (
      <div className="reviews-wrapper roow roow-left roow-col-left">
        <div className="subject-name-container">
            <Link to={`review/${review.subjectId}/${review.id}`}>
              <div className="text-subject-name">{review.title}</div>
              <div className="text-category shift-up-5">Book</div>
            </Link>
        </div>
        <div className="review-container roow roow-center roow-row-top">
          <div className="review-image-wrapper">
            <Link to={`review/${review.subjectId}/${review.id}`}>
              <div className="subject-image">
                <img src={review.image}/>
              </div>
            </Link>
          </div>
          <div className="review-data-container roow roow-col-left">
            <div className="review-data-module gray-border roow roow-col-left">
              <div className="reviewer-name-container">
                <Link to={`@${reviewer.username}`}>
                  <div className="reviewer-name">
                    {reviewer.username}
                  </div>
                </Link>
              </div>
              <Link to={`@${reviewer.username}`}>
                <div className="photo-rating-module roow">
                  <div className="reviewer-photo center-img"><img src={reviewer.image}/></div>
                    <div className={'rating-container roow roow-row-center rating-wrapper-' + review.rating}>
                        <div className="rating-graphic rating--2"></div>
                        <div className="rating-graphic rating--1"></div>
                        <div className="rating-graphic rating-0"></div>
                        <div className="rating-graphic rating-1"></div>
                        <div className="rating-graphic rating-2"></div>
                    </div>
                </div>
              </Link>
              <div className="info">
                <div className="subject-caption">
                  {review.caption}
                </div>
                <div className="review-timestamp">
                  {(new Date(review.lastModified)).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="cta-box roow roow-row-space gray-border">
              
              <LikeReviewButton
                userId={props.userId}
                isLiked={props.review.isLiked}
                likesCount={props.review.likesCount}
                unLike={props.unLike}
                like={props.like} 
                reviewId={review.id} />

              <div className="cta-wrapper roow roow-col">
                <div className="cta-icon cta-save"></div>
                12 Saves
              </div>
              <div className="cta-wrapper roow roow-col">
                <div className="cta-icon cta-share"></div>
                Share
              </div>
            </div>
            <div>Some comments bleep bloop</div>
          </div>
        </div> 
      </div>
  );
}

export default ReviewPreview;