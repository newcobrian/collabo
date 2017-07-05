import React from 'react';
import { connect } from 'react-redux';
import { Control, Form, actions } from 'react-redux-form';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { EDITOR_PAGE } from '../actions';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';
import Geosuggest from 'react-geosuggest'

const renderGeoSuggestItinerary = googlemaps => {
  const suggestSelect = result => {
    var request = {
      placeId: result.placeId
    };

    let geoData = {
      label: result.label,
      placeId: result.placeId,
      location: result.location
    }

    if (result.gmaps && result.gmaps.address_components) {
      result.gmaps.address_components.forEach(function(resultItem) {
        if (resultItem.types && resultItem.types[0] && resultItem.types[0] === 'country') {
          if (resultItem.short_name) geoData.country = resultItem.short_name;
        }
      })
    }

    // field.input.onChange(geoData);
  }

  return (
    <Geosuggest 
      className="input--underline"
      types={['(regions)']}
      placeholder="Search a city or country"
      required
      onSuggestSelect={suggestSelect}/>
  )
}

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
});

class EditForm extends React.Component {
  constructor() {
    super();
  
    this.handleSubmit = itinerary => {
      console.log('submitted itin = ' + JSON.stringify(itinerary))
      // Do whatever you like in here.
      // If you connect the UserForm to the Redux store,
      // you can dispatch actions such as:
      // dispatch(actions.submit('user', somePromise));
      // etc.
    }

    this.initMap = (mapProps, map) => {
      const {google} = this.props;
      let service = new google.maps.places.PlacesService(map);
      this.props.loadGoogleMaps(service, EDITOR_PAGE);
    }
  }

  render() {
    console.log(JSON.stringify(this.props.data))
    if (!this.props.googleMapsObject) {
      return (
        <Map google={window.google}
          onReady={this.initMap}
          visible={false} >
        </Map>
        );
    }

    return (
      <Form
        model="editForm"
        onSubmit={(itinerary) => this.handleSubmit(itinerary)}
      >
        <label htmlFor="editForm.ititnerary.title">Title:</label>
        <Control.text model="editForm.itinerary.title" id="editForm.itinerary.title" />

        <label htmlFor="editForm.itinerary.geo">Location:</label>
        <Control.text model="editForm.itinerary.geo" id="editForm.itinerary.geo" component={renderGeoSuggestItinerary} />

        <button type="submit">
          Finish registration!
        </button>
      </Form>
    );
  }
}

// export default EditForm;

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(EditForm));