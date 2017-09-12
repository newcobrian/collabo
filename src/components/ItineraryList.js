import ItineraryPreview from './ItineraryPreview';
import { Link, IndexLink } from 'react-router';
import ListPagination from './ListPagination';
import React from 'react';

const ItineraryList = props => {
  if (!props.itineraries) { 
    return (
       <div className="profile-feed flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap w-max">
        <div className="loading-module flx flx-col flx-center-all v2-type-body3">
          <div className="earth-graphic">  
            <img className="center-img" src="/img/loading-01.gif"/>
          </div>
          <div>Loading Travel Guides...</div>
        </div>
      </div>
    );
  }

  // if (props.itineraries.length === 0) {
  //   return (
  //     <div className="status-module flx flx-center-all v2-type-body3">
  //       Nothing here...
  //     </div>
  //   );
  // }

  return (
    <div className="profile-feed flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap w-max">
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


      <Link to="/create" className="itinerary__cover cover--empty flx flx-col flx-center-all ta-center">
      <i className="material-icons color--success md-48 mrgn-bottom-md">add</i>
        <div className="color--success mrgn-bottom-lg pdding-bottom-lg pdding-bottom-md brdr-bottom">CREATE A NEW GUIDE</div>
        <div className="ta-center w-100 v2-type-body1 opa-50 mrgn-bottom-md">You could make...</div>
        <ul className="ta-left">
          <li className="v2-type-body1 opa-50 mrgn-bottom-sm">A city guide or your fav spots for your friends?</li>
          <li className="v2-type-body1 opa-50 mrgn-bottom-sm">An itinerary for your next weekend trip?</li>
          <li className="v2-type-body1 opa-50 mrgn-bottom-sm">A list  of everything you want to eat next time you're in Tokyo!</li>
        </ul>
      </Link>


    </div>
  );
};

export default ItineraryList;