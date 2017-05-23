import TipPreview from './TipPreview';
import React from 'react';

const TipList = props => {
  if (!props.reviews) {
    return (
      <div className="article-preview roow roow-center-all">Loading...</div>
    );
  }

  if (props.reviews.length === 0) {
    return (
      <div className="article-preview roow roow-center-all">
        Empty itinerary.
      </div>
    );
  }

  return (
    <div>
      {
        props.reviews.map(review => {
          return (
            <TipPreview review={review}
              key={review.reviewId} 
              authenticated={props.authenticated}
            />
          );
        })
      }
    </div>
  );
};

export default TipList;