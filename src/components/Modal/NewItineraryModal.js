import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { NEW_ITINERARY_MODAL } from '../../actions';
import ImagePicker from './../ImagePicker';
import ListErrors from './../ListErrors';
import Geosuggest from 'react-geosuggest';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';
 
const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class NewItineraryModal extends React.Component {
  constructor() {
    super();

    this.initMap = (mapProps, map) => {
      const {google} = this.props;
      this.props.loadGoogleMaps(google, map, NEW_ITINERARY_MODAL);
    }
  }

  componentWillMount() {
    this.props.sendMixpanelEvent('New Itinerary Modal');
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const handleAdd = itinerary => ev => {
      ev.preventDefault();
      this.props.addToItinerary(this.props.authenticated, this.props.review, itinerary)
    }

    const handleItineraryClick = ev => {
      ev.preventDefault();
      this.props.showNewItineraryModal(this.props.authenticated, this.props.review);
    }

    const updateFieldEvent =
        key => ev => this.props.onUpdateCreateField(key, ev.target.value, NEW_ITINERARY_MODAL);

    const changeTitle = updateFieldEvent('title');
    const changeDescription = updateFieldEvent('description');

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
      this.props.onUpdateCreateField('geo', geoData, NEW_ITINERARY_MODAL);
    }
    
    const changeGeo = value => {
      this.props.onUpdateCreateField('geo', value, NEW_ITINERARY_MODAL) ;
    }

    const submitForm = ev => {
      ev.preventDefault();

      if (!this.props.title) {
        this.props.createSubmitError('itinerary name', NEW_ITINERARY_MODAL);
      }
      else if (this.props.geo !== 0 && !this.props.geo) {
        this.props.createSubmitError('location', NEW_ITINERARY_MODAL);
      }
      else {
        let itinerary = { title: this.props.title, geo: this.props.geo, userId: this.props.auth };
        if (this.props.description) itinerary.description = this.props.description;
        
        this.props.addToItinerary(this.props.auth, this.props.review, itinerary);
      }
    }

    const actions = [
      <FlatButton
        label="Cancel"
        hoverColor="white"
        className="vb mrgn-right-sm"
        onClick={handleClose}
        labelStyle={{  
                    }}
        style={{
          }}
      />,
      <FlatButton
        label="Save"
        hoverColor="white"
        onClick={submitForm}
        disableTouchRipple={true}
        fullWidth={false}
        className="vb color--white fill--primary"
        labelStyle={{ 
                    }}
        style={{
          }}
      />
    ];

    if (!this.props.googleObject) {
      return (
        <Map google={window.google}
          onReady={this.initMap}
          visible={false} >
        </Map>
        );
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === NEW_ITINERARY_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          
          title="Create new guide for..."

          titleClassName="dialog__title v2-type-h2"
          titleStyle={{}}

          className="dialog dialog--save"
          style={{}}

          overlayClassName="dialog__overlay"
          overlayStyle={{}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "0px"}}

          actionsContainerClassName="dialog--save__actions"
          actionsContainerStyle={{}}

          >
            
            <div className="dialog--save__content">
            <div className="dialog--save__tip-item">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="tip-preview-wrapper mrgn-right-md">
                   <ImagePicker images={this.props.images} />
                </div>
                <div className="dialog--save__tip-name">{this.props.review.subject.title}</div>
              </div>
            </div>
      <div className="flx flx-col flx-center-all new-itin-modal">
        <div className="page-title-wrapper center-text DN">
          <div className="v2-type-page-header">Create New Itinerary</div>
          <div className="v2-type-body2 opa-60 mrgn-top-sm DN"></div>
        </div>
        <div className="flx flx-col flx-center-all create-wrapper mrgn-top-sm">
          <ListErrors errors={this.props.errors}></ListErrors>
              <div className="form-wrapper flx flx-col-left">
                <form>
                 <fieldset className="field-wrapper">
                   <label>Location</label>
                   <Geosuggest 
                       className="input--underline"
                       types={['(regions)']}
                       placeholder="Paris, Madrid, Waikiki..."
                       required
                       onChange={changeGeo}
                       onSuggestSelect={suggestSelect}/>
                        {/*   googleMaps={this.props.googleMapObject} */}
                {/*}   <input
                     className="input--underline"
                     type="text"
                     placeholder="Location"
                     required
                     value={this.props.geo}
                     onChange={changeGeo} /> */}
                 </fieldset>
            <fieldset className="field-wrapper">
              <label>Guide Name</label>
                <input
                  className="input--underline edit-itinerary__name"
                  type="text"
                  placeholder="My New Travel Guide"
                  required
                  value={this.props.title}
                  onChange={changeTitle} />
              </fieldset>
              
            <fieldset className="field-wrapper">
              <label>About (Optional)</label>
                        <textarea
                          className="input--underline"
                          type="text"
                          rows="4"
                          placeholder="Add a description..."
                          value={this.props.description}
                          onChange={changeDescription} />
                      </fieldset>

                      <div
                      className="DN vb w-100 vb--create mrgn-top-md"
                      type="button"
                      onClick={submitForm}>
                      Create New Itinerary
                    </div>
              </form>
            </div>
        </div>
        </div>
    			</div>

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(NewItineraryModal));