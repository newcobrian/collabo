import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import ListErrors from './../ListErrors';
import {GoogleApiWrapper} from 'google-maps-react';
import Map from 'google-maps-react';
import Geosuggest from 'react-geosuggest';

const mapStateToProps = state => ({
  ...state.modal,
  currentUser: state.common.currentUser,
  userInfo: state.common.userInfo,
  authenticated: state.common.authenticated
});

class CreateRecsModal extends React.Component {
  constructor() {
    super();

    this.initMap = (mapProps, map) => {
      const {google} = this.props;
      this.props.loadGoogleMaps(google, map, Constants.CREATE_RECS_MODAL);
    }

    // this.updateState = field => ev => {
    //   const state = this.state;
    //   const newState = Object.assign({}, state, { [field]: ev.target.value });
    //   this.setState(newState);
    // };

    const updateFieldEvent =
      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.CREATE_RECS_MODAL);

    this.changeGeo = value => {
      this.props.onUpdateCreateField('geo', value, Constants.CREATE_RECS_MODAL) ;
    }

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
        this.props.onUpdateCreateField('geo', geoData, Constants.CREATE_RECS_MODAL);
        // const state = this.state;
        // const newState = Object.assign({}, state, { 'geo': geoData });
        // this.setState(newState);
      }

    this.submitForm = ev => {
      ev.preventDefault();

      if (!this.props.title) {
        this.props.createSubmitError('itinerary name', Constants.CREATE_RECS_MODAL);
      }
      else if (!this.props.geo || !this.props.geo.placeId) {
        this.props.createSubmitError('location', Constants.CREATE_RECS_MODAL);
      }

      this.props.onCreateRecsSubmit(this.props.authenticated, this.props.geo, this.props.title);
    }
  }

  componentDidMount() {
    this.props.onUpdateCreateField('title', 'Recommendations for ' + this.props.userInfo.username, Constants.CREATE_RECS_MODAL);
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create recs modal' });
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

    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Close"
        className="vb mrgn-right-sm"
        hoverColor="rgba(247,247,247,.2)"
        onClick={handleClose}
        style={{
          float: "left"
          }}
          labelStyle={{   
                      }}
      />,
      <FlatButton
        label="Next"
        hoverColor="white"
        onClick={this.submitForm}
        disableTouchRipple={true}
        fullWidth={false}
        className="vb color--white fill--primary"
        labelStyle={{ 
                    }}
        style={{
          }}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === Constants.CREATE_RECS_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          className="dialog-wrapper"
          style={{
              
            }}

          title='Ask for Recommendations'
          titleClassName="dialog__title v2-type-h2"
          titleStyle={{}}

          className="dialog dialog--save"
          style={{height: "100%"}}

          overlayClassName="dialog__overlay"
          overlayStyle={{}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px", height: "100%"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "0px", height: "100%"}}

          actionsContainerClassName="dialog--save__actions"
          actionsContainerStyle={{}}
          
        >

            <div className="dialog--save__content">
              <div className="flx flx-col flx-center-all new-itin-modal">
                <div className="page-title-wrapper center-text DN">
                  <div className="v2-type-page-header">Ask for Recommendations</div>
                  <div className="v2-type-body2 opa-60 mrgn-top-sm DN"></div>
                </div>
                <div className="flx flx-col flx-center-all create-wrapper mrgn-top-md">
                  <ListErrors errors={this.props.errors}></ListErrors>
                      <div className="form-wrapper flx flx-col-left">
                        <form>
                          <fieldset className="field-wrapper mrgn-bottom-md">
                            Let's create a place to gather all your friends' tips and recs.
                          </fieldset>

                    <fieldset className="field-wrapper mrgn-bottom-md">
                      <label>Where are you going?</label>
                        <Geosuggest 
                          className="input--underline v2-type-body3"
                          types={['(regions)']}
                          placeholder="Location"
                          required
                          onChange={this.changeGeo}
                          onSuggestSelect={this.suggestSelect}/>
                      </fieldset>
                      
                    <fieldset className="field-wrapper mrgn-bottom-md">
                      <label>Name your trip</label>
                        <input
                          className="input--underline edit-itinerary__name"
                          type="input"
                          required
                          placeholder="My Next Vacation"
                          value={this.props.title}
                          onChange={this.changeTitle} />
                      </fieldset>

                    <div
                    className="DN vb w-100 vb--create mrgn-top-md"
                    type="button"
                    onClick={this.submitForm}>
                    Update email
                  </div>
                </form>
              </div>
              </div>
            </div>
          </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(CreateRecsModal));

// export default connect(mapStateToProps, Actions)(CreateRecsModal);