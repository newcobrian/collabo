import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link, browserHistory } from 'react-router';
import FirebaseSearchInput from './FirebaseSearchInput';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';
import Geosuggest from 'react-geosuggest';

const mapStateToProps = state => ({
	...state.common,
	...state.universalSearchBar,
	authenticated: state.common.authenticated
})

class UniversalSearchBar extends React.Component {
	constructor() {
		super();

		this.searchInputCallback = result => {
			var request = {
			  placeId: result.placeId
			};

	    	let geoData = {
	    		label: result.label,
	    		location: result.location
	    	}
	    	if (result.gmaps && result.gmaps.address_components) {
	    		result.gmaps.address_components.forEach(function(resultItem) {
	    			// get country name if there
	    			if (resultItem.types && resultItem.types[0] && resultItem.types[0] === 'country') {
	    				if (resultItem.short_name) geoData.country = resultItem.short_name;
	    				if (resultItem.long_name) geoData.fullCountry = resultItem.long_name;
	    			}
	    			// get short name if its there
	    			if (resultItem.types && resultItem.types[0] && resultItem.types[0] === 'locality' && resultItem.types[1] && resultItem.types[1] === 'political') {
	    				if (resultItem.short_name) geoData.shortName = resultItem.short_name;
	    			}
	    		})
	    	}
	    	
	    	this.props.universalGeoSearch(result.placeId, geoData);
		    // if (result.placeId) {
		    // 	browserHistory.push('/places/' + result.placeId);
		    // }
	    }

		this.renderPopularCities = () => {
			const onCityClick = () => {
				this.props.sendMixpanelEvent(Constants.MIXPANEL_CLICK_EVENT, { 'type' : 'search bar popular cities' });
			}

		    if (this.props.popularGeos && this.props.popularGeos.length > 1) {
		      return (
		        <div className="search-detail-bar flx flx-col color--black flx-just-center ta-center w-100 v2-type-body2 color--black">
		          <div className="label-big color--black flx-hold mrgn-right-lg opa-80 DN">Top Cities:</div>
		          <div className="flx flx-center-all">
		        {this.props.popularGeos.map(geo => {
		          let title = geo.shortName ? geo.shortName : geo.label;
		          return (
		            <div className="pop-city-wrapper flx flx-row flx-center-all flx-hold  mrgn-left-md mrgn-right-md" key={geo.id}>
		              <Link to={"/places/" + geo.id} onClick={onCityClick} className="geo-type color--black opa-100 flx-hold">{title}</Link>
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
		        <div className="search-detail-bar mobile-hide flx flx-col color--black flx-center-all ta-center pdding-left-md w-100 v2-type-body2 color--black DN">
		          <div className="label-big color--black flx-hold mrgn-right-lg opa-80 DN">Top Cities:</div>
		          <div className="flx flx-center-all">
			        {Constants.POPULAR_CITIES.map(geo => {
			          let title = geo.shortName ? geo.shortName : geo.label;
			          return (
			            <div className="pop-city-wrapper flx flx-row flx-center-all flx-hold mrgn-left-md mrgn-right-md">
			              <Link to={"/places/" + geo.id} onClick={onCityClick} className="geo-type color--primary opa-100 flx-hold">{title}</Link>
			              <div className="middle-dot flx-hold DN">&middot;</div>
			            </div>

		          )

		        })}
			        </div>
		        </div>
		      )
		    }
		}

		this.initMap = (mapProps, map) => {
	      const {google} = this.props;
	      
	      this.props.loadGoogleMaps(google, map, Constants.UNIVERSAL_SEARCH_BAR);
	    }

	    this.changeGeo = value => {
	    	this.props.onUpdateCreateField('geo', value, Constants.UNIVERSAL_SEARCH_BAR);
	    }
	}

	componentWillMount() {
		this.props.getPopularGeos();
	}
	
	render() {
		if (!this.props.googleObject) {
	      return (
	        <Map google={window.google}
	          onReady={this.initMap}
	          visible={false} >
	        </Map>
	        );
    	}
		const isLandingPage = (browserHistory.getCurrentLocation().pathname === '/global') && !this.props.authenticated ?
      'page-landing' : ''

		return (
			<div className={"search-wrapper-wrapper w-100 flx flx-row flx-m-col flx-align-center brdr-bottom flx-just-start " + isLandingPage}>
			  <div className="search-wrapper short-width-search page-top-search flx flx-row flx-align-start flx-hold">
			    <i className="search-icon material-icons color--black md-24">search</i>
			    <Geosuggest 
            	  className="input--underline v2-type-body3"
				  types={['(regions)']}
				  placeholder="Paris, Madrid, Waikiki..."
				  required
				  onChange={this.changeGeo}
				  onSuggestSelect={this.searchInputCallback}/>
			  </div>
			  {this.renderPopularCities()}
			</div>
		)
	}
}

// export default connect(mapStateToProps, Actions)(UniversalSearchBar);

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(UniversalSearchBar));