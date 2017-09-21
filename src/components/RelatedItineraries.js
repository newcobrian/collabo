import React from 'react';
import ItineraryPreview from './ItineraryPreview';

const RelatedItineraries = props => {
	if (!props.relatedItineraries || props.relatedItineraries.length === 0) return null;
	
	return (
		<div className="w-100 flx flx-col">
			<div className="v2-type-h3 DN">Your friends have {props.numRelated} related guides</div>
			<div className="w-100 flx flx-row flx-wrap">
				{
					props.relatedItineraries.map(itinerary => {
			          return (
			            <ItineraryPreview itinerary={itinerary}
			              key={itinerary.id} 
			              authenticated={props.authenticated} 
			              like={props.like} 
			              unLike={props.unLike}
			              />
			          );
			        })
			    }
			  </div>
		</div>
	)
}

export default RelatedItineraries;