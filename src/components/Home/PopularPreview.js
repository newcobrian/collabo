import React from 'react';
import * as Constants from '../../constants';
import ItineraryPreview from '.././ItineraryPreview';

const PopularPreview = props => {
  if (props.popularList) {
    return (
      <div className="flx flx-col flx-just-space-around mrgn-bottom-sm">
        {
          props.popularList.slice(0,Constants.POPULARITY_MODULE_COUNT).map(itinerary => {
            return (
              <ItineraryPreview itinerary={itinerary}
                key={itinerary.id} 
                authenticated={props.authenticated} 
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