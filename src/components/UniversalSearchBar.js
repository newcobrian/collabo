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
		        <div className="search-detail-bar mobile-hide flx flx-row color--white flx-just-start flx-align-center ta-center pdding-left-md w-100 v2-type-body2 color--white">
		          <div className="label-big color--white flx-hold mrgn-right-lg opa-80">Top Cities:</div>

		        {this.props.popularGeos.map(geo => {
		          let title = geo.shortName ? geo.shortName : geo.label;
		          return (
		            <div className="pop-city-wrapper flx flx-row flx-center-all flx-hold">
		              <Link to={"/places/" + geo.id} className="geo-type color--white opa-100 flx-hold">{title}</Link>
		              <div className="middle-dot flx-hold">&middot;</div>
		            </div>
		          )
		        })}
		        </div>
		      )
		    }
		    else {
		      return (
		        <div className="search-detail-bar mobile-hide flx flx-row color--white flx-just-start flx-align-center ta-center pdding-left-md w-100 v2-type-body2 color--white">
		          <div className="label-big color--white flx-hold mrgn-right-lg opa-80">Top Cities:</div>

		        {Constants.POPULAR_CITIES.map(geo => {
		          let title = geo.shortName ? geo.shortName : geo.label;
		          return (
		            <div className="pop-city-wrapper flx flx-row flx-center-all flx-hold">
		              <Link to={"/places/" + geo.id} className="geo-type color--white opa-100 flx-hold">{title}</Link>
		              <div className="middle-dot flx-hold">&middot;</div>
		            </div>
		          )
		        })}
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
			<div className={"search-wrapper-wrapper w-100 flx flx-row flx-m-col flx-align-center " + isLandingPage}>
			  <div className="search-wrapper short-width-search page-top-search w-100 flx flx-row flx-align-center flx-hold">
			    <i className="search-icon material-icons color--white md-32">search</i>
			    <FirebaseSearchInput
			      name="searchInput"
			      callback={this.searchInputCallback}
			      placeholder="Search any city or country"
			      type={Constants.GEO_SEARCH}
			      className="input--search fill--black color--white input--underline v2-type-body3" />
			  </div>
			  {this.renderPopularCities()}
			</div>
		)
	}
}

export default connect(mapStateToProps, Actions)(UniversalSearchBar);