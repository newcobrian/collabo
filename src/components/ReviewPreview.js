import React from 'react';
import { Link } from 'react-router';

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
          <div className="review-data-container roow roow-col-right">
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
                  <div className="reviewer-photo"><img src={reviewer.image}/></div>
                    <div className="rating-container roow">
                        <div className="rating-graphic">0</div>
                    </div>
                </div>
              </Link>
              <div className="info">
                <div className="subject-caption">
                  {review.caption}
                </div>
                <div className="review-timestamp">
                  {review.timestamp}
                </div>
              </div>
            </div>
            <div className="cta-box roow gray-border">
              <i className="icoon ion-heart"></i>
              <i className="icoon ion-android-bookmark"></i>
              <i className="icoon ion-android-share"></i>
            </div>
          </div>
        </div> 
      </div>




  );
}

export default ReviewPreview;