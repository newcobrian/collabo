'use strict';

import ReviewPreview from './ReviewPreview';
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
            <ReviewPreview review={review} 
              key={review.id} 
              reviewer={review.reviewer} 
              userId={props.userId} 
              like={props.like} 
              unLike={props.unLike} />

          );
        })
      }

      <ListPagination reviewsCount={props.reviewsCount} currentPage={props.currentPage} onSetPage={props.onSetPage} />
    </div>
  );
};

export default ReviewList;