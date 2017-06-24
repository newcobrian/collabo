import ItineraryPreview from './ItineraryPreview';
import ListPagination from './ListPagination';
import React from 'react';

const ItineraryList = props => {
  if (!props.itineraries) {
    return (
      <div className="loading-module flx flx-center-all v2-type-body3">I-list Loading...</div>
    );
  }

  if (props.itineraries.length === 0) {
    return (
      <div className="loading-module flx flx-center-all v2-type-body3">
        No itineraries.
      </div>
    );
  }

  return (
    <div className="profile-feed flx flx-col flx-just-center flx-align-center flx-wrap w-max">
      {
        props.itineraries.map(itinerary => {
          return (
            <ItineraryPreview itinerary={itinerary}
              key={itinerary.id} 
              authenticated={props.authenticated} 
              like={props.like} 
              unLike={props.unLike}
              deleteItinerary={props.deleteItinerary}
              redirectPath={props.redirectPath}

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