import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link } from 'react-router';
import ItineraryList from './ItineraryList';

const mapStateToProps = state => ({
  ...state.places,
  authenticated: state.common.authenticated
});

class Places extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    this.props.loadPlaces(this.props.params.pid);
    this.props.getPlacesFeed(this.props.authenticated, this.props.params.pid);
    this.props.sendMixpanelEvent('Location page loaded');
  }

  componentWillUnmount() {
    this.props.unloadPlacesFeed(this.props.authenticated, this.props.params.pid);
  }

  render() {
    if (!this.props.geo || !this.props.feed) return null;
    else if (this.props.feed.length === 0) {
      return (
        <div> No itineraries created for {this.props.geo.label}.</div>
      )
    }
    return (
      <div className="home-page">
        <div className="page-title-wrapper center-text">
          <div className="v2-type-page-header flx flx-col flx-center-all">
            <div className={'itinerary__cover__flag mrgn-bottom-sm flx-hold flag-' + this.props.geo.country}>
            </div>
            {this.props.geo.label}
          </div>
          <div className="v2-type-body2 opa-60 mrgn-top-sm"></div>
        </div>
        <div className="toggle-wrapper DN">
        </div>
        <div className="feed-wrapper">
          <ItineraryList
          itineraries={this.props.feed} 
          authenticated={this.props.authenticated} 
          like={this.props.likeReview} 
          unLike={this.props.unLikeReview}
          deleteItinerary={this.props.showDeleteModal} />
        </div>

      </div>


    );
  }
}

export default connect(mapStateToProps, Actions)(Places);