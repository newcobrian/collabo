import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ItineraryList from './ItineraryList'; 
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from './FirebaseSearchInput';
import UniversalSearchBar from './UniversalSearchBar';

const mapStateToProps = state => ({
  ...state.places,
  authenticated: state.common.authenticated
});

class Places extends React.Component {
  constructor() {
    super();

    this.searchInputCallback = result => {
        if (result.placeId) {
          browserHistory.push('/places/' + result.placeId);
        }
      }
  }

  componentWillMount() {
    this.props.loadPlaces(this.props.params.pid);
    this.props.getPlacesFeed(this.props.authenticated, this.props.params.pid);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'places'});
  }

  componentWillUnmount() {
    this.props.unloadPlacesFeed(this.props.authenticated, this.props.params.pid);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.pid !== this.props.params.pid) {
      this.props.unloadPlacesFeed(this.props.authenticated, this.props.params.pid);
      this.props.loadPlaces(nextProps.params.pid);
      this.props.getPlacesFeed(this.props.authenticated, nextProps.params.pid);
    }
  }

  render() {
    if (this.props.placeNotFoundError) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this location.</div>
        </div>
      )
    }
    if (!this.props.geo || !this.props.feed) {
      return (
        <div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <div className="v2-type-body2 color--white">Loading location</div>
          </div>
        </div>
        )
    }
    // else if (this.props.feed.length === 0) {
    //   return (
    //     <div> No itineraries created for {this.props.geo.label}.</div>
    //   )
    // }
    return (
    <div>

      <div className="page-common page-places flx flx-col flx-align-start">

        
            <UniversalSearchBar />
        


        <div className={"page-title-wrapper center-text country-color-" + this.props.geo.country}>
          <div className="v2-type-page-header flx flx-col flx-center-all invert">
            <div className={'itinerary__cover__flag mrgn-bottom-sm flx-hold flag-' + this.props.geo.country}>
            </div>
            {this.props.geo.label}
          </div>
          <div className="v2-type-body2 opa-60"></div>
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

    </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Places);