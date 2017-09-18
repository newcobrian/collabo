import React from 'react';
import * as Constants from '../../constants';
import ItineraryPreview from '.././ItineraryPreview';

const PopularPreview = props => {
  if (props.popularList) {
    return (
      <div className="">
        {
          props.popularList.map(itinerary => {
            return (
              
              <ItineraryPreview itinerary={itinerary}
                key={itinerary.id} 
                authenticated={props.authenticated} 
                like={props.like} 
                unLike={props.unLike}
                deleteItinerary={props.deleteItinerary}
                type={Constants.MEDIUM_GUIDE_PREVIEW} />

            );
          })
        }
      </div>
    )
  }
  return null;
};

export default PopularPreview; 