import ItineraryPreview from './ItineraryPreview';
import TipPreview from './TipPreview';
import ListPagination from './ListPagination';
import React from 'react';

const FeedList = props => {
  if (!props.feed) {
    return (
      <div className="loading-module flx flx-center-all v2-type-body3">Feed Loading...</div>
    );
  }

  if (props.feed.length === 0) {
    return (
      <div className="loading-module flx flx-center-all v2-type-body3">
        No itineraries.
      </div>
    );
  }

  return (
    <div className="profile-feed flx flx-row flx-just-center flx-align-start flx-wrap">
      {
        props.feed.map(feedItem => {
          if (Object.keys(feedItem.review).length === 0 && feedItem.review.constructor === Object) {
            return (
              <ItineraryPreview itinerary={feedItem.itinerary}
                key={feedItem.itinerary.id} 
                authenticated={props.authenticated} 
                like={props.like} 
                unLike={props.unLike}
                deleteItinerary={props.deleteItinerary}
                redirectPath={props.redirectPath} 
              />
            );
          }
          else {
            return (
              <TipPreview tip={feedItem.review}
                key={feedItem.review.id} 
                authenticated={props.authenticated}
                like={props.like} 
                unLike={props.unLike}
                userInfo={props.userInfo}

                showModal={props.showModal}
                deleteComment={props.deleteComment}
              />
              )
          }
        })
      }
    </div>
  );
};

export default FeedList;