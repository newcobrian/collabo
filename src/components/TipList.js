import TipPreview from './TipPreview';
import React from 'react';

const TipList = props => {
  if (!props.reviewList) {
    return (
      <div className="article-preview roow roow-center-all">Loading...</div>
    );
  }

  if (props.reviewList.length === 0) {
    return (
      <div className="article-preview roow roow-center-all">
        Empty itinerary.
      </div>
    );
  }

  return (
    <div>
      {
        props.reviewList.map(reviewItem => {
          let review = reviewItem.review;
          return (
            <TipPreview review={review}
              key={review.priority} 
              authenticated={props.authenticated}
              like={props.like} 
              unLike={props.unLike}
              userInfo={props.userInfo}
              comments={reviewItem.comments}
              images={reviewItem.images}
            />
          );
        })
      }
    </div>
  );
};

export default TipList;