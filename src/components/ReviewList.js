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
        Follow some more interesting people!
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
              authenticated={props.authenticated} 
              like={props.like} 
              unLike={props.unLike}
              save={props.save}
              unSave={props.unSave}
              updateRating={props.updateRating} />

          );
        })
      }

      <ListPagination reviewsCount={props.reviewsCount} currentPage={props.currentPage} onSetPage={props.onSetPage} />
    </div>
  );
};

export default ReviewList;