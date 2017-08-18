import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import EditItineraryForm from './EditItineraryForm';
import { EDITOR_PAGE } from '../actions';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';
import Geosuggest from 'react-geosuggest'

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
});

class Editor extends React.Component {
  constructor() {
    super();

    this.submitForm = (values) => {
        // console.log('VALUES = ' + JSON.stringify(values))
        this.props.onEditorSubmit(this.props.authenticated, this.props.itineraryId, values.itinerary);
    }

    // this.initMap = (mapProps, map) => {
    //   const {google} = this.props;
    //   let service = new google.maps.places.PlacesService(map);
    //   this.props.loadGoogleMaps(google, map, EDITOR_PAGE);
    // }
  }

  componentWillMount() {
    if (!this.props.authenticated) {
        this.props.askForAuth();
    }
    if (this.props.params.iid) {
        this.props.onEditorLoad(this.props.authenticated, this.props.params.iid);
        // if (navigator.geolocation) {
        //   let watchId = navigator.geolocation.watchPosition(this.props.showPosition);
        //   this.props.setWatchPositionId(watchId);
        // }
    }
    this.props.sendMixpanelEvent('Editor page loaded');
  }

  componentWillUnmount() {
    this.props.onEditorUnload(this.props.itineraryId);
    // if (this.props.watchId) navigator.geolocation.clearWatch(this.props.watchId);
  }

  render() {
    // if (!this.props.googleObject) {
    //   return (
    //     <Map google={window.google}
    //       onReady={this.initMap}
    //       visible={false} >
    //     </Map>
    //     );
    // }

    return (
      <div>
        {/*<EditForm />*/}
        <EditItineraryForm 
          onSubmit={this.submitForm}
          searchLocation={this.props.geo}
          loadGoogleMaps={this.props.loadGoogleMaps}
            />
      </div>
    )
  }
}

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(Editor));

export default connect(mapStateToProps, Actions)(Editor);