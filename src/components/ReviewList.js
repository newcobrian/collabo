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
      <div className="article-preview roow roow-center-all">
        Follow some more interesting people!
      </div>
    );
  }

  return (
    <div>
      {
        props.reviews.map(review => {
          if (!props.tag || (review.subject && review.subject.tag && review.subject.tag.includes(props.tag))) {
            return (
              <ReviewPreview review={review}
                tag={props.tag}
                key={review.id} 
                authenticated={props.authenticated} 
                like={props.like} 
                unLike={props.unLike}
                save={props.save}
                unSave={props.unSave}
                updateRating={props.updateRating}
                deleteReview={props.deleteReview}
                showModal={props.showModal} />

            );
          }
        })
      }
            <div className="no-results-module">
              <div className="v2-type-body2 center-text">
                <p>There's no {props.tag} reviews, yet!</p>
                <p>Go create one, loser:</p>
                <p>&darr;</p>
              </div>
            </div>

      <ListPagination reviewsCount={props.reviewsCount} currentPage={props.currentPage} onSetPage={props.onSetPage} />
    </div>
  );
};

export default ReviewList;