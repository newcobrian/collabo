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
      props.unLike(props.userId, props.review);
    } else {
      props.like(props.userId, props.review);
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

const CommentPreview = props => {
  if (props.comments) {
    return (
    <div className="comments-preview-wrapper roow roow-col-left">
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="roow roow-row-col">
          <div className="commenter-pic"><img src={props.comments.image}/></div>
          <div className="comment-single">{props.comments.body}</div>
        </div>
        <div className="comment-counter">{props.comments.commentsCount} Comments</div>
      </Link>
    </div>
    )
  }
  return null;
}

const ReviewPreview = props => {
  const review = props.review;
  return (
      <div className="reviews-wrapper roow roow-left roow-col-left">
        <div className="subject-name-container">
            <Link to={`review/${review.subjectId}/${review.id}`}>
              <div className="text-subject-name">{review.title}</div>
            </Link>
              <div className="text-category shift-up-5">Book, Movie, Restaurant, Cool</div>

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
            <div className="review-data-module gray-border roow roow-col-left box-shadow">
              
              <Link to={`@${review.reviewer.username}`}>
                <div className="photo-rating-module roow">
                  <div className="reviewer-photo center-img"><img src={review.reviewer.image}/></div>
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
                <div className="reviewer-name-container">
                <Link to={`@${review.reviewer.username}`}>
                  <div className="reviewer-name">
                    <span className="dash">-</span>{review.reviewer.username}
                  </div>
                </Link>
              </div>
                <div className="review-timestamp">
                  {(new Date(review.lastModified)).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="roow roow-row flex-wrap">
              <div className="cta-box roow roow-row-space gray-border">
                
                <LikeReviewButton
                  userId={props.userId}
                  isLiked={props.review.isLiked}
                  likesCount={props.review.likesCount}
                  unLike={props.unLike}
                  like={props.like} 
                  review={review} />

                <div className="cta-wrapper roow roow-col">
                  <div className="cta-icon cta-save"></div>
                  12 Saves

                  </div>
                  <div className="cta-wrapper roow roow-col">
                    <div className="cta-icon cta-share"></div>
                    Share
                  </div>
                </div>
                
                <CommentPreview comments={props.review.comments} review={props.review} />
            </div>






          </div>
        </div> 
      </div>
  );
}

export default ReviewPreview;