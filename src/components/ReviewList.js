'use strict';

import ReviewPreview from './ReviewPreview';
import ReviewPreview2 from './ReviewPreview2';
import ListPagination from './ListPagination';
import React from 'react';

const ReviewList = props => {
  if (!props.reviews) {
    return (
      <div className="article-preview">Loading...</div>
    );
  }

  if (props.reviews.length === 0) {
    return (
      <div className="article-preview">
        No reviews are here... yet.
      </div>
    );
  }

  return (
    <div>
      {
        props.reviews.map(review => {
          return (
            <ReviewPreview2 review={review} 
              key={review.id} 
              userId={props.userId} 
              like={props.like} 
              unLike={props.unLike}
              updateRating={props.updateRating} />

          );
        })
      }

      <ListPagination reviewsCount={props.reviewsCount} currentPage={props.currentPage} onSetPage={props.onSetPage} />
    </div>
  );
};

export default ReviewList;