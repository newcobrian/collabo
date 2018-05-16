import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import ListErrors from './ListErrors';
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
  ...state.addReview,
  authenticated: state.common.authenticated
});

class AddReview extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ADD_REVIEW_PAGE);

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
	    	this.props.onUpdateCreateField('geo', geoData, Constants.ADD_REVIEW_PAGE);
	    }

	    this.changeGeo = value => {
	    	this.props.onUpdateCreateField('geo', value, Constants.ADD_REVIEW_PAGE)	;
	    }
	    this.changeSubject = value => {
	    	this.props.onUpdateCreateField('subject', value, Constants.ADD_REVIEW_PAGE)	;
	    }
	    this.changeCaption = updateFieldEvent('caption');

	    this.changeRating = updateFieldEvent('rating')

		this.submitForm = ev => {
	      ev.preventDefault();
	      
	      if (!this.props.geo || !this.props.geo.placeId) {
	        this.props.createSubmitError('location', Constants.ADD_REVIEW_PAGE);
	      }
	      else if (!this.props.subject) {
	        this.props.createSubmitError('place of interest', Constants.ADD_REVIEW_PAGE);
	      }
	      else {
	      	console.log('props = ' + JSON.stringify(this.props))
		   	// let itinerary = {};
	    	// itinerary.title = this.props.title;
	    	// itinerary.geo = this.props.geo;
	    	// if (this.props.description) itinerary.description = this.props.description;

		    // this.props.setInProgress();
		    // this.props.onCreateItinerary(this.props.authenticated, itinerary);
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
			this.props.loadGoogleMaps(google, map, Constants.ADD_REVIEW_PAGE);
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
    	this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'add review page'});
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

console.log('geo = ' + JSON.stringify(this.props.geo))
console.log('subject = ' + JSON.stringify(this.props.subject))
		const {google} = this.props;
		const updateCreateField = this.props.onUpdateCreateField;

		const suggestSelectSubject = result => {
	    	let resultObject = {
		      title: result.label,
		      id: result.placeId,
		      location: result.location
		    }
		    if (result.gmaps && result.gmaps.formatted_address) {
		      resultObject.address = result.gmaps.formatted_address;
		    }

		    let service = new google.maps.places.PlacesService(this.props.mapObject);
		    let request = { placeId: result.placeId }
		    service.getDetails(request, function(place, status) {
		      if (status == google.maps.places.PlacesServiceStatus.OK) {
		        if (place.name) resultObject.title = place.name;
		        if (place.international_phone_number) resultObject.internationalPhoneNumber = place.international_phone_number;
		        if (place.formatted_phone_number) resultObject.formattedPhoneNumber = place.formatted_phone_number;
		        if (place.opening_hours) {
		          resultObject.hours = {};
		          if (place.opening_hours.periods) resultObject.hours.periods = place.opening_hours.periods;
		          if (place.opening_hours.weekday_text) resultObject.hours.weekdayText = place.opening_hours.weekday_text;
		        }
		        if (place.permanently_closed) resultObject.permanently_closed = true;
		        if (place.website) resultObject.website = place.website;
		        if (place.photos && place.photos[0]) {
		          resultObject.defaultImage = [ place.photos[0].getUrl({'maxWidth': 1225, 'maxHeight': 500}) ];
		        }
		        if (place.url) resultObject.googleMapsURL = place.url;
		      	updateCreateField('subject', resultObject, Constants.ADD_REVIEW_PAGE);
		      }
		      else {
				updateCreateField('subject', resultObject, Constants.ADD_REVIEW_PAGE);
			  }
			})
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
	        	          <div className="v2-type-page-header">Add a new review</div>
	        	          <div className="v2-type-body2 opa-60"></div>
	        	        </div>
			         	<div className="create-content flx flx-col flx-center-all ta-center">
							
							<div className="flx flx-col flx-center-all create-wrapper">
						
					            <div className="create-form-wrapper form-wrapper ta-left flx flx-col-left bx-shadow">
						            
						            <form>
						            	<div className="v2-type-page-header mrgn-bottom-sm">Add a new review</div>

						            	<fieldset className="field-wrapper">
					                    	<label>Pick a city or country</label>
					                    	<Geosuggest 
					                    	  className="input--underline v2-type-body3"
											  types={['(regions)']}
											  placeholder="Paris, Madrid, Waikiki..."
											  required
											  onChange={this.changeGeo}
											  onSuggestSelect={this.suggestSelect}/>
					                    </fieldset>
										<fieldset className="field-wrapper">
					                    	<label>What are you reviewing?</label>
					                    	<Geosuggest 
					                    	  className="input--underline v2-type-body3"
											  placeholder="Add a place"
											  required
											  onChange={this.changeSubject}
											  onSuggestSelect={suggestSelectSubject}/>
					                    </fieldset>
					                    <fieldset className={'tip__rating-module flx flx-row flx-align-center flx-hold w-100 tip__rating-module--'}>
					                    	<label>Add your rating</label>
                                            <select className="color--black" value={this.props.rating} onChange={this.changeRating}>
	                                              <option value="-">To Try</option>
	                                              <option value="0">0/10 Run away</option>
	                                              <option value="1">1/10 Stay away</option>
	                                              <option value="2">2/10 Just bad</option>
	                                              <option value="3">3/10 Don't go</option>
	                                              <option value="4">4/10 Meh</option>
	                                              <option value="5">5/10 Average</option>
	                                              <option value="6">6/10 Solid</option>
	                                              <option value="7">7/10 Go here</option>
	                                              <option value="8">8/10 Really good</option>
	                                              <option value="9">9/10 Must go</option>
	                                              <option value="10">10/10 The best</option>
                                            </select>
                                        </fieldset>
										<fieldset className="field-wrapper">
											<label>Caption (Optional)</label>
					                      <textarea
					                        className="input--underline v2-type-body3"
					                        type="text"
					                        rows="3"
					                        maxLength="184"
					                        placeholder="What did you think?"
					                        value={this.props.description}
					                        onChange={this.changeCaption} />
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
					  	<div className="hero-bg">
						    <div className="hero-map opa-20">
						    </div>
						    <div className="hero-grid opa-10">
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
}) (connect(mapStateToProps, Actions)(AddReview));

// export default connect(mapStateToProps, Actions)(Create);