import ItineraryPreview from './ItineraryPreview';
import { Link, IndexLink } from 'react-router';
import ListPagination from './ListPagination';
import React from 'react';

const ItineraryList = props => {
  if (!props.itineraries) { 
    return (
       <div className="profile-feed flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap fill--light-gray">
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
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
    <div className="profile-feed flx flx-row flx-just-center flx-self-end flx-align-center flx-wrap">
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


      <Link to="/create" className="itinerary__cover cover--empty flx flx-col flx-center-all ta-center fill-success color--white brdr-all">
        <div className="v2-type-h1 pdding-bottom-sm color--black">
         Start new travel guide
        </div>
        <div className="v2-type-body1 pdding-bottom-md color--black opa-50">
          Upcoming trip or recommendations for friends?
        </div>
        <div className="vb fill--success color--white vb--round">
           <i className="material-icons md-32 color--white">add</i>
        </div>
        <div className="ta-center w-100 v2-type-body1 opa-50 mrgn-bottom-md DN">You could make...</div>
        <ul className="ta-left mrgn-left-lg mrgn-right-lg DN">
          <li className="v2-type-body1 opa-50 mrgn-bottom-sm">A city guide or your fav spots for your friends?</li>
          <li className="v2-type-body1 opa-50 mrgn-bottom-sm">An itinerary for your next weekend trip?</li>
          <li className="v2-type-body1 opa-50 mrgn-bottom-sm">A list  of everything you want to eat next time you're in Tokyo!</li>
        </ul>
      </Link>


    </div>
  );
};

export default ItineraryList;