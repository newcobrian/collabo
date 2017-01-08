import React from 'react';
import { Link } from 'react-router';

const ReviewPreview = props => {
  const review = props.review;

  return (
      <div className="reviews-wrapper roow roow-left roow-col-left">
        <div className="subject-name-container">
            <div className="text-subject-name">{review.title}</div>
            <div className="text-category shift-up-5">Book</div>
        </div>
        <div className="review-container roow roow-center roow-row-top">
          <div className="review-image-wrapper">
            <div className="subject-image">
              <img src={review.image}/>
            </div>
          </div>
          <div className="review-data-container roow roow-col-right">
            <div className="review-data-module gray-border roow roow-col-left">
              <div className="reviewer-name-container">
                <div className="reviewer-name">
                  Kiko Mizuhara
                </div>
              </div>
              <div className="photo-rating-module roow">
                <div className="reviewer-photo"><img src="http://www.kpopmusic.com/wp-content/uploads/2014/12/tumblr_mk9ghdPCaW1rexlpko1_1280.jpg"/></div>
                  <div className="rating-container roow">
                      <div className="rating-graphic">0</div>
                  </div>
              </div>
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