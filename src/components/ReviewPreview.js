import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';

const RatingsButtons = props => {
  const handleClick = rating => ev => {
    ev.preventDefault();
    props.updateRating(props.userId, props.review.id, props.review.subjectId, rating);
  };

  if (props.userId === props.review.reviewer.userId) {
    return (
      <div className={'rating-container roow roow-row-center rating-wrapper-' + props.review.rating}>
        <button className="rating-graphic rating--2" onClick={handleClick(-2)}></button>
        <button className="rating-graphic rating--1" onClick={handleClick(-1)}></button>
        <button className="rating-graphic rating-0" onClick={handleClick(0)}></button>
        <button className="rating-graphic rating-1" onClick={handleClick(1)}></button>
        <button className="rating-graphic rating-2" onClick={handleClick(2)}></button>
      </div>
    )
  }
  else {
    return (
      <div className={'rating-container cannot-rate roow roow-row-center rating-wrapper-' + props.review.rating}>
        <div className="rating-graphic rating--2"></div>
        <div className="rating-graphic rating--1"></div>
        <div className="rating-graphic rating-0"></div>
        <div className="rating-graphic rating-1"></div>
        <div className="rating-graphic rating-2"></div>
      </div>
    )
  }
}

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
              <div className="text-subject-name">{review.subject.title}</div>
            </Link>
              <div className="text-category shift-up-5">Book, Movie, Restaurant, Cool</div>

        </div>
        <div className="review-container roow roow-center roow-row-top">

          <div className="review-image-wrapper">
            <Link to={`review/${review.subjectId}/${review.id}`}>
              <div className="subject-image">
                <img src={review.subject.image}/>
              </div>
            </Link>
          </div>
          <div className="review-data-container roow roow-col-left">
            <div className="review-data-module gray-border roow roow-col-left box-shadow">
              
             
                <div className="photo-rating-module roow">
                  <Link to={`@${review.reviewer.username}`}>
                    <div className="reviewer-photo center-img"><img src={review.reviewer.image}/></div>
                  </Link>  
                  <Link to={`review/${review.subjectId}/${review.id}`}> 
                    <RatingsButtons review={review} userId={props.userId} updateRating={props.updateRating} />
                  </Link>
                </div>
              
              <div className="info">
                <Link to={`review/${review.subjectId}/${review.id}`}>
                <div className="subject-caption">
                  {review.caption}
                </div>
                </Link>
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