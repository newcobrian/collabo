import React from 'react';
import ItineraryPreview from './ItineraryPreview';

const RelatedItineraries = props => {
	if (!props.relatedItineraries || props.relatedItineraries.length === 0) return null;
	
	return (
		<div>
			<h>Your friends have {props.numRelated} related guides</h>
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
	)
}

export default RelatedItineraries;
