import ItineraryPreview from './ItineraryPreview';
import ListPagination from './ListPagination';
import React from 'react';

const ItineraryList = props => {
  if (!props.itineraries) {
    return (
      <div className="article-preview roow roow-center-all">Loading...</div>
    );
  }

  if (props.itineraries.length === 0) {
    return (
      <div className="article-preview roow roow-center-all">
        No itineraries.
      </div>
    );
  }

  return (
    <div>
      {
        props.itineraries.map(itinerary => {
          return (
            <ItineraryPreview itinerary={itinerary}
              key={itinerary.id} 
              authenticated={props.authenticated} 
              like={props.like} 
              unLike={props.unLike}

              updateRating={props.updateRating}
              deleteReview={props.deleteReview}
              showModal={props.showModal} />

          );
        })
      }
    </div>
  );
};

export default ItineraryList;