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
			scroller.scrollTo('tip' + tip.key, {duration: 400, offset: -134});
			this.props.onSelectActiveTip(tip)
		}

		this.onMarkerMouseover = tip => ev => {
			this.props.onSelectActiveTip(tip)
		}
	}

	componentWillMount() {
		this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'map container'});
	}

  	render() {
	  	if (!this.props.google) {
	      return (
	         <div className="map-loading-wrapper flx flx-col flx-center-all v2-type-body3 fill--black color--white">
                <div className="loader-wrapper flx flx-col flx-center-all fill--black">
                  <div className="loader-bird"></div>
                  <div className="loader">
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                  </div>
                  <div className="v2-type-body2 color--white">Loading map</div>
                </div>
	        </div>
	        );
	    }
	 //    console.log('itin = ' + JSON.stringify(this.props.itinerary))
	    // console.log('initial map cetner = ' + JSON.stringify(this.props.initialMapCenter))

	    const getMapCenter = (itinerary, tips) => {

	    	let mapCenter = {}
	    	if (itinerary && itinerary.geo && itinerary.geo.location) mapCenter = itinerary.geo.location;

	    	if (tips) {
		      for (let i = 0; i < tips.length; i++) {
		        if (tips[i].subject && tips[i].subject.location) {
		          mapCenter = tips[i].subject.location;
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
		
		let initialMapCenter = getMapCenter(this.props.itinerary, this.props.visibleTips);

	    return (	
			<Map google={this.props.google}
				initialCenter={initialMapCenter}
				style={{width: '100%', height: '100%'}}
				className="map-wrapper" >
		        {
		          this.props.visibleTips.map((tipItem, index) => {
		          	let markerUrl = (tipItem.key === this.props.selectedMarker ? "/img/graphics/map-pin_hover.png": "/img/graphics/map-pin_normal.png")
		            return (
		              <Marker
		                key={index}
		                name={tipItem.subject.title}
		                title={'# ' + index + ': ' + tipItem.subject.title}
		                position={tipItem.subject.location}
		                onClick={this.onMarkerClick(tipItem)}
		                icon={{
					      url: markerUrl,
					      scaledSize: new this.props.google.maps.Size(40,48)
					    }}
					    onMouseover={this.onMarkerMouseover(tipItem)}
					    />
		            )
		          })
		        }
		        <InfoWindow
		            visible={this.props.showingHoverInfoWindow}
		            marker={this.props.hoverMarker}>
	              <div>
	                <h4>{this.props.mouseoverTitle}</h4>
	              </div>
		        </InfoWindow>
		        <InfoWindow
			        visible={this.props.showingActiveInfoWindow}
			        position={this.props.activeTipPosition}
			        options={{
			        pixelOffset: new this.props.google.maps.Size(0,-48),
			        }} >
		            <div className="butt">
		                <h4>{this.props.index} {this.props.activeTipTitle}</h4>
		            </div>
		        </InfoWindow>

	        </Map>
	    );
	}
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(MapContainer));