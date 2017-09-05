import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { GoogleApiWrapper, Map, Marker, InfoWindow } from 'google-maps-react';
import { isEqual } from 'lodash';

var Scroll = require('react-scroll');
var scroller = Scroll.scroller;

const mapStateToProps = state => ({
	...state.itinerary,
  	authenticated: state.common.authenticated
});

class MapContainer extends React.Component {
	constructor() {
		super();

		this.onMarkerClick = tip => ev => {	
			scroller.scrollTo('tip:' + tip.key, {duration: 400, offset: -70});
			this.props.onMapMarkerClick(tip);
		}

		this.onMarkerMouseover = (tip) => ev => {
			// this.props.onMapMarkerMouseover(tip);
		}
	}

  	render() {
	  	if (!this.props.google) {
	      return (
	         <div className="map-loading-wrapper flx flx-col flx-center-all v2-type-body3 fill--primary color--white">
	          <div className="color--white">Loading Map</div>
	        </div>
	        );
	    }
	 //    console.log('itin = ' + JSON.stringify(this.props.itinerary))
	    // console.log('initial map cetner = ' + JSON.stringify(this.props.initialMapCenter))

	    const getMapCenter = itinerary => {

	    	let mapCenter = {}
	    	if (itinerary && itinerary.geo && itinerary.geo.location) mapCenter = itinerary.geo.location;

	    	if (itinerary && itinerary.tips) {
		      for (let i = 0; i < itinerary.tips.length; i++) {
		        if (itinerary.tips[i].subject && itinerary.tips[i].subject.location) {
		          mapCenter = itinerary.tips[i].subject.location;
		          break;
		        }
		      }
		    }
		    if (!mapCenter) {
		    	if (navigator && navigator.geolocation) {
		            navigator.geolocation.getCurrentPosition((pos) => {
		                const coords = pos.coords;
		                mapCenter = { lat: coords.latitude, lng: coords.longitude }
		                return mapCenter;
		             })
		        }
		    }
		    return mapCenter;
	    }
		
		let initialMapCenter = getMapCenter(this.props.itinerary);

	    return (	
			<Map google={this.props.google}
				initialCenter={initialMapCenter}
				style={{width: '100%', height: '100%'}}
				className="map-wrapper" >
		        {
		          this.props.itinerary.tips.map((tipItem, index) => {
		            return (
		              <Marker
		                key={index}
		                name={tipItem.subject.title}
		                title={'# ' + index + ': ' + tipItem.subject.title}
		                position={tipItem.subject.location}
		                onClick={this.onMarkerClick(tipItem)}
		                icon={{
					      url: "/img/graphics/map-pin_normal.png",
					      scaledSize: new this.props.google.maps.Size(40,48)
					    }}
					    onMouseover={this.onMarkerMouseover(tipItem)}
					    />
		            )
		          })
		        }
		        {/*<InfoWindow
		            onClose={this.props.closeInfoWindow}
		            visible={this.props.showingInfoWindow}
		            position={this.props.infoWindowPosition}>
	              <div>
	                <h4>{this.props.mouseoverTitle}</h4>
	              </div>
	          </InfoWindow>*/}

	        </Map>
	    );
	}
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(MapContainer));