import React from 'react';
import * as Constants from '../../constants';
import ItineraryPreview from '.././ItineraryPreview';

const PopularPreview = props => {
  if (props.popularList) {
    return (
      <div className="profile-feed flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap w-max">
        {
          props.popularList.map(itinerary => {
            return (
              <ItineraryPreview itinerary={itinerary}
                key={itinerary.id} 
                authenticated={props.authenticated} 
                like={props.like} 
                unLike={props.unLike}
                deleteItinerary={props.deleteItinerary}
                type={Constants.SMALL_GUIDE_PREVIEW} />

            );
          })
        }
      </div>
    )
  }
  return null;
};

export default PopularPreview; 