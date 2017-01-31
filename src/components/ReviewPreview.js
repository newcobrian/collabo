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
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper roow roow-col">
          <div className="cta-icon cta-comment comment-on"></div>
          {props.comments.commentsCount} Comments
        </div>
      </Link>
    )
  }
  else {
    return (
      <Link to={`review/${props.review.subjectId}/${props.review.id}`}>
        <div className="cta-wrapper roow roow-col">
          <div className="cta-icon cta-comment"></div>
          Comment
        </div>
      </Link>
    )
  }
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
                  <div className="roow roow-col-left">
                    <div className="reviewer-name-container">
                      <Link to={`@${review.reviewer.username}`}>
                        <div className="reviewer-name">
                          <span className="dash"></span>{review.reviewer.username}
                        </div>
                      </Link>
                    </div>
                    <Link to={`review/${review.subjectId}/${review.id}`}> 
                      <RatingsButtons review={review} userId={props.userId} updateRating={props.updateRating} />
                    </Link>
                  </div>

                </div>
              
              <div className="info">
                <Link to={`review/${review.subjectId}/${review.id}`}>
                <div className="subject-caption">
                  {review.caption}
                </div>
                </Link>
                <div className="review-timestamp">
                  {(new Date(review.lastModified)).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="roow roow-row flex-wrap">
              <div className="cta-box roow roow-row-space">
                <CommentPreview comments={props.review.comments} review={props.review} />
                <div className="roow roow-row flew-item-right">
                  <div className="cta-wrapper disable roow roow-col">
                    <div className="cta-icon cta-save"></div>
                    Save
                  </div>
                  <LikeReviewButton
                    userId={props.userId}
                    isLiked={props.review.isLiked}
                    likesCount={props.review.likesCount}
                    unLike={props.unLike}
                    like={props.like} 
                    review={review} />
                </div>
                {/**}
                  </div>
                  <div className="cta-wrapper roow roow-col">
                    <div className="cta-icon cta-share"></div>
                    Share
                  </div>**/}
                </div>
                
            </div>






          </div>
        </div> 
      </div>
  );
}

export default ReviewPreview;