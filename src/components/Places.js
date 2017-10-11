import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link } from 'react-router';
import ItineraryList from './ItineraryList'; 
import FirebaseSearchInput from './FirebaseSearchInput';

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
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'places'});
  }

  componentWillUnmount() {
    this.props.unloadPlacesFeed(this.props.authenticated, this.props.params.pid);
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
    else if (this.props.feed.length === 0) {
      return (
        <div> No itineraries created for {this.props.geo.label}.</div>
      )
    }
    return (
<div>
      <div className="search-wrapper-wrapper w-100 flx flx-row flx-m-col flx-align-center">
        <div className="search-wrapper short-width-search page-top-search w-100 flx flx-row flx-align-center flx-hold">
          <i className="search-icon material-icons color--white md-32">search</i>
          <FirebaseSearchInput
            name="searchInput"
            callback={this.searchInputCallback}
            placeholder="Search any city or country"
            type={Constants.GEO_SEARCH}
            className="input--search fill--black color--white input--underline v2-type-body3" />
        </div>
        <div className="search-detail-bar mobile-hide flx flx-row color--white flx-just-start flx-align-center ta-center pdding-left-md w-100 v2-type-body2 color--white">
            <div className="label-big color--white flx-hold mrgn-right-lg opa-80">Top Cities:</div>
            
            <Link to="/places/ChIJ51cu8IcbXWARiRtXIothAS4" className="geo-type color--white opa-100">Tokyo</Link>
            <div className="middle-dot">&middot;</div>
            <Link to="/places/ChIJ5TCOcRaYpBIRCmZHTz37sEQ" className="geo-type color--white opa-100">Barcelona</Link>
            <div className="middle-dot">&middot;</div>
             <Link to="/places/ChIJmQrivHKsQjQR4MIK3c41aj8" className="geo-type color--white opa-100">Taipei</Link>
             <div className="middle-dot">&middot;</div>
            <Link to="/places/ChIJIQBpAG2ahYAR_6128GcTUEo" className="geo-type color--white opa-100">San Francisco</Link>
            <div className="middle-dot">&middot;</div>
            <Link to="/places/ChIJOwg_06VPwokRYv534QaPC8g" className="geo-type color--white opa-100">New York</Link>

          </div>
      </div>


      <div className="home-page page-common page-places">
        <div className="page-title-wrapper center-text">
          <div className="v2-type-page-header flx flx-col flx-center-all">
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