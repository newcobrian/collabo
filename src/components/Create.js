import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import ListErrors from './ListErrors';
import { CREATE_PAGE } from '../actions';
import Geosuggest from 'react-geosuggest';
import ProfileInfo from './ProfileInfo'
// import Script from 'react-load-script';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';

const SubjectInfo = props => {
	const renderImage = image => {
		if (image) {
			return (
				<ProxyImage src={image}/>
			)
		}
		else return null;
	}
	if (props.subject) {
		return (
			<div>
			<div className="flx flx-row-top">
				<div className="subject-image create-subject-image">{renderImage(props.image)}</div>
			</div>
			</div>
		)
	}
	else return null;
}

const mapStateToProps = state => ({
  ...state.create,
  authenticated: state.common.authenticated
});

class Create extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, CREATE_PAGE);

	    this.changeTitle = updateFieldEvent('title');
	    this.suggestSelect = result => {
	    	var request = {
			  placeId: result.placeId
			};

			// let service = new google.maps.places.PlacesService(document.createElement('div'));
			// service.getDetails(request, callback);

			// function callback(place, status) {
			//   if (status == google.maps.places.PlacesServiceStatus.OK) {
			//     console.log(place.photos[0])
			//     console.log('url = ' + place.url)
			//   }
			// }

	    	let geoData = {
	    		label: result.label,
	    		placeId: result.placeId,
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
	    	this.props.onUpdateCreateField('geo', geoData, CREATE_PAGE);
	    }
	    this.changeGeo = value => {
	    	this.props.onUpdateCreateField('geo', value, CREATE_PAGE)	;
	    }
	    this.changeDescription = updateFieldEvent('description');

		this.submitForm = ev => {
	      ev.preventDefault();
	      
	      if (!this.props.title) {
	        this.props.createSubmitError('itinerary name', CREATE_PAGE);
	      }
	      else if (!this.props.geo || !this.props.geo.placeId) {
	        this.props.createSubmitError('location', CREATE_PAGE);
	      }
	      else {
		   	let itinerary = {};
	    	itinerary.title = this.props.title;
	    	itinerary.geo = this.props.geo;
	    	if (this.props.description) itinerary.description = this.props.description;

		    this.props.setInProgress();
		    this.props.onCreateItinerary(this.props.authenticated, itinerary);
		  }
    	}

    	this.getUserLocation = () => {
    		if (navigator.geolocation) {
		      let watchId = navigator.geolocation.watchPosition(this.props.showPosition);
		      this.props.setWatchPositionId(watchId);
		    }
    	}

		this.initMap = (mapProps, map) => {
			const {google} = this.props;
			// let service = new google.maps.places.PlacesService(map);
			this.props.loadGoogleMaps(google, map, CREATE_PAGE);
			// let request = { placeId: 'ChIJ10KlwAdzXg0RsH56kZsfcHs'}

		 //  	service.getDetails(request, function(place, status) {
		 //      if (status == google.maps.places.PlacesServiceStatus.OK) {
		 //          let lat = place.geometry.location.lat();
		 //          let lng = place.geometry.location.lng();
		 //          console.log('lat = ' + lat)
			// 	}
			// })
		}
	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}
    	else {
	    	// this.props.onCreateLoad(this.props.authenticated);
	    	this.getUserLocation();
    	}
    	this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
		if (this.props.watchId) navigator.geolocation.clearWatch(this.props.watchId);
		if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
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
		return (
			<div>
				<div className="flx flx-col flx-center-all page-common editor-page create-page">
	{/**}			
					<div>
				        <Script
				          url={url}
				          onCreate={this.handleScriptCreate.bind(this)}
				          onError={this.handleScriptError.bind(this)}
				          onLoad={this.handleScriptLoad.bind(this)}
				        /> 
				    </div> 
				    <div ref="GMap"></div>**/}
					

				    {/* CONTAINER - START */}
			        <div className="hero-container">
	        			<div className="page-title-wrapper center-text DN">
	        	          <div className="v2-type-page-header">Create a New Guide</div>
	        	          <div className="v2-type-body2 opa-60">This could be a list of top spots or plans for an upcoming trip</div>
	        	        </div>
			         	<div className="create-content flx flx-col flx-center-all ta-center">
							
							<div className="flx flx-col flx-center-all create-wrapper">
						
					            <div className="create-form-wrapper form-wrapper ta-left flx flx-col-left">
						            
						            <form>
						            	<div className="v2-type-page-header mrgn-bottom-sm">Create a New Guide</div>

						            	<fieldset className="field-wrapper">
					                    	<label>Location</label>
					                    	<Geosuggest 
					                    	  className="input--underline v2-type-body3"
											  types={['(regions)']}
											  placeholder="Paris, Madrid, Waikiki..."
											  required
											  onChange={this.changeGeo}
											  onSuggestSelect={this.suggestSelect}/>
					                    </fieldset>
										<fieldset className="field-wrapper">
											<label>Guide Name</label>
					                      <input
					                        className="input--underline edit-itinerary__name v2-type-body3"
					                        type="text"
					                        placeholder="My New Travel Guide"
					                        required
					                        value={this.props.title}
					                        maxLength="42"
					                        onChange={this.changeTitle} />
					                    </fieldset>
										<fieldset className="field-wrapper">
											<label>About (Optional)</label>
					                      <textarea
					                        className="input--underline v2-type-body3"
					                        type="text"
					                        rows="3"
					                        maxLength="184"
					                        placeholder="Add a description..."
					                        required
					                        value={this.props.description}
					                        onChange={this.changeDescription} />
					                    </fieldset>

					                    <ListErrors errors={this.props.errors}></ListErrors>
					                    
					                    <div
					                    className="vb vb--create w-100 mrgn-top-md color--white fill--primary"
					                    type="button"
					                    disabled={this.props.inProgress}
					                    onClick={this.submitForm}>
					                    	<div className="flx flx-row flx-center-all ta-center">
						                    	<div className="flx-grow1 mrgn-left-md">Next</div>
												<img className="flx-item-right" src="/img/icons/icon32_next.png"/>
											</div>
					                  </div>
							        </form>
							    </div>
						    </div>

						  

					  	</div>
					  	

						

					</div>	
					{/* END CONTAINER */}
					

			    </div>
			    

			</div>


		)
	}
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(Create));

// export default connect(mapStateToProps, Actions)(Create);