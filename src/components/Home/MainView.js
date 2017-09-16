import ReviewList from '../ReviewList';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import ItineraryList from './../ItineraryList';
import ItineraryPreview from './../ItineraryPreview';

const mapStateToProps = state => ({
  ...state.home,
  authenticated: state.common.authenticated
});

const MainView = props => {
  return (
    <div>
      <div className="feed-wrapper fill--light-gray">
        <div className="page-section page-section__friends w-100 w-max pdding-top-md">
          <div className="section-header ta-center opa-40">Friends</div>
          <ItineraryList
            itineraries={props.itineraries} 
            authenticated={props.authenticated} 
            like={props.likeReview} 
            unLike={props.unLikeReview}
            deleteItinerary={props.showDeleteModal} />
          </div>
        </div>
    </div>
  );
};

export default connect(mapStateToProps, Actions)(MainView);