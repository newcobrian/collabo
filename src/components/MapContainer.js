import React from 'react';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { GoogleApiWrapper, Map } from 'google-maps-react';

class MapContainer extends React.Component {
  render() {
  	if (!this.props.google) {
      return (
        <div>Loading...</div>
        );
    }
    return (
    	<div>
			<Map google={this.props.google} >
			 {this.props.markers.map(marker =>
		          <Marker
		            key={marker.get('title')}
		            title={marker.get('title')}
		            description={marker.get('description')}
		            properties={marker.get('properties')}
		            position={marker.get('position')}
		            mapOn={marker.get('mapOn')}
		            addMarker={this.props.addMarker}
		            onMarkerClick={this.props.onMarkerClick}/>
		        )}
		        <InfoWindow {...this.props}
		            marker={this.props.activeMarker}
		            visible={this.props.showingInfoWindow}>
		              <div>
		                <h4>{this.props.selectedTitle}</h4>
		              </div>
		        </InfoWindow>
		    </Map>
		</div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
})(MapContainer)