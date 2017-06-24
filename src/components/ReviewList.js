import ReviewPreview from './ReviewPreview';
import ListPagination from './ListPagination';
import React from 'react';

const ReviewList = props => {
  if (!props.reviews) {
    return (
      <div className="article-preview roow roow-center-all">Loading...</div>
    );
  }

  if (props.reviews.length === 0) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        No tips added yet
      </div>
    );
  }

  return (
    <div>
      {
        props.reviews.map(review => {
          return (
            <ReviewPreview review={review}
              key={review.reviewId} 
              authenticated={props.authenticated} 

              like={props.like} 
              unLike={props.unLike}
              save={props.save}
              unSave={props.unSave}
              updateRating={props.updateRating}
              deleteReview={props.deleteReview}
              showModal={props.showModal} />

          );
        })
      }
            <div className="no-results-module">
              <div className="v2-type-body2 center-text">
                <a href="/create.html"><p>Got any good {props.tag} recommendations?</p></a>
              </div>
            </div>

      <ListPagination reviewsCount={props.reviewsCount} currentPage={props.currentPage} onSetPage={props.onSetPage} />
    </div>
  );
};

export default ReviewList;