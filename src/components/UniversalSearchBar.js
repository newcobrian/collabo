import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from './FirebaseSearchInput';

const mapStateToProps = state => ({
	...state.common,
	authenticated: state.common.authenticated
})

class UniversalSearchBar extends React.Component {
	constructor() {
		super();

		this.searchInputCallback = result => {
		    if (result.placeId) {
		    	browserHistory.push('/places/' + result.placeId);
		    }
	    }

		this.renderPopularCities = () => {
		    if (this.props.popularGeos && this.props.popularGeos.length > 1) {
		      return (
		        <div className="search-detail-bar mobile-hide flx flx-col color--black flx-center-all ta-center pdding-left-md w-100 v2-type-body2 color--black">
		          <div className="label-big color--black flx-hold mrgn-right-lg opa-80 DN">Top Cities:</div>
		          <div className="flx flx-center-all">
		        {this.props.popularGeos.map(geo => {
		          let title = geo.shortName ? geo.shortName : geo.label;
		          return (
		            <div className="pop-city-wrapper flx flx-row flx-center-all flx-hold  mrgn-left-md mrgn-right-md">
		              <Link to={"/places/" + geo.id} className="geo-type color--primary opa-100 flx-hold">{title}</Link>
		              <div className="middle-dot flx-hold DN">&middot;</div>
		            </div>
		          )
		        })}
		        </div>
		        </div>
		      )
		    }
		    else {
		      return (
		        <div className="search-detail-bar mobile-hide flx flx-col color--black flx-center-all ta-center pdding-left-md w-100 v2-type-body2 color--black">
		          <div className="label-big color--black flx-hold mrgn-right-lg opa-80 DN">Top Cities:</div>
		          <div className="flx flx-center-all">
			        {Constants.POPULAR_CITIES.map(geo => {
			          let title = geo.shortName ? geo.shortName : geo.label;
			          return (
			            <div className="pop-city-wrapper flx flx-row flx-center-all flx-hold mrgn-left-md mrgn-right-md">
			              <Link to={"/places/" + geo.id} className="geo-type color--primary opa-100 flx-hold">{title}</Link>
			              <div className="middle-dot flx-hold DN">&middot;</div>
			            </div>

		          )

		        })}
			        </div>
		        </div>
		      )
		    }
		}
	}

	componentWillMount() {
		this.props.getPopularGeos();
	}
	
	render() {
		const isLandingPage = (browserHistory.getCurrentLocation().pathname === '/global') && !this.props.authenticated ?
      'page-landing' : ''

		return (
			<div className={"search-wrapper-wrapper w-100 flx flx-col flx-m-col flx-align-center " + isLandingPage}>
			  <div className="search-wrapper short-width-search page-top-search w-100 flx flx-row flx-align-center flx-hold">
			    <i className="search-icon material-icons color--black md-24">search</i>
			    <FirebaseSearchInput
			      name="searchInput"
			      callback={this.searchInputCallback}
			      placeholder="Search for a city or country"
			      type={Constants.GEO_SEARCH}
			      className="input--search fill--black color--black input--underline v2-type-body3" />
			  </div>
			  {this.renderPopularCities()}
			</div>
		)
	}
}

export default connect(mapStateToProps, Actions)(UniversalSearchBar);