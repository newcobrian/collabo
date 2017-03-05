import React from 'react';
import { Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import SaveReviewButton from './SaveReviewButton';
import ProxyImage from './ProxyImage';
import ReviewActions from './ReviewActions';

const RatingsButtons = props => {
  const handleClick = rating => ev => {
    ev.preventDefault();
    props.updateRating(props.authenticated, props.review.id, props.review.subjectId, rating);
  };

  if (props.authenticated && props.authenticated === props.review.reviewer.userId) {
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
  const canModify = props.authenticated &&
      props.authenticated === props.review.reviewer.userId;
  return (
      <div className="reviews-wrapper roow roow-left roow-col-left">
        <div className="subject-name-container">
              <div className="text-subject-name roow">
                <Link to={`review/${review.subjectId}/${review.id}`}>
                  {review.subject.title}
                </Link>
                <a title={'Open link: ' + review.subject.url} target="blank" href={review.subject.url}>
                <div className="goto-link flex-">
                  <i className="ion-android-arrow-forward"></i>
                </div>
                </a>
                <div>
                  <ReviewActions review={review} authenticated={props.authenticated} 
                canModify={canModify} deleteReview={props.deleteReview} reviewDetailPath={props.reviewDetailPath} />
                </div>
              </div>
              <div className="text-category shift-up-5">#hashtags #cominghere #soon</div>
        </div>
        <div className="review-container roow roow-center roow-col-left bottom-divider">
          <div className="roow roow-row-top pic-and-review">
            <div className="review-image-wrapper">
              <a href={review.subject.images ? review.subject.images[0] : ""}>
                <div className="subject-image">
                  <ProxyImage src={review.subject.image ? review.subject.image : ""}/>
                </div>
              </a>
            </div>
            <div className="review-data-container roow roow-col-left">
              <div className="review-data-module roow roow-col-left">
                  <div className="photo-rating-module roow roow-row-top">
                    <Link to={`@${review.reviewer.username}`}>
                      <div className="reviewer-photo center-img"><ProxyImage src={review.reviewer.image}/></div>
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
                        <RatingsButtons review={review} authenticated={props.authenticated} updateRating={props.updateRating} />
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
            </div>


          </div>

          <div className="roow roow-row flex-wrap cta-container">
              <div className="cta-box roow roow-row-space">
                <CommentPreview comments={props.review.comments} review={props.review} />
                <div className="roow roow-row flew-item-right">
                  <SaveReviewButton 
                    authenticated={props.authenticated}
                    isSaved={props.review.isSaved}
                    unSave={props.unSave}
                    save={props.save} 
                    review={review} />
                  <LikeReviewButton
                    authenticated={props.authenticated}
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
  );
}

export default ReviewPreview;