import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { NEW_ITINERARY_MODAL } from '../../actions';
import ImagePicker from './../ImagePicker';
import ListErrors from './../ListErrors';

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class NewItineraryModal extends React.Component {
  render() {
    const handleClose = () => {
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
    const changeGeo = updateFieldEvent('geo');
    const changeDescription = updateFieldEvent('description');

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
        onTouchTap={handleClose}
        labelStyle={{textTransform: 'none', color:'rgba(0,0,0,.3)'}}
        style={{
          }}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === NEW_ITINERARY_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}

          className="dialog--save"
          style={{}}

          overlayClassName="dialog--save__overlay"
          overlayStyle={{}}
          
          title="Create new itinerary for..."
          titleClassName="dialog--save__title v2-type-h2"
          titleStyle={{padding: "10px 20px", fontWeight: "700", fontSize: "20px"}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "400px", maxWidth: "none"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "30px 0px"}}

          actionsContainerClassName="dialog--save__actions">
            
            <div className="dialog--save__content">
            <div className="dialog--save__tip-item">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="tip-preview-wrapper mrgn-right-md">
                   <ImagePicker images={this.props.images} />
                </div>
                <div className="dialog--save__tip-name">{this.props.review.title}</div>
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
                <label>Itinerary Name</label>
                          <input
                            className="input--underline edit-itinerary__name"
                            type="text"
                            placeholder="My Vacation 2018 or Best NYC Sandos"
                            required
                            value={this.props.title}
                            onChange={changeTitle} />
                        </fieldset>
                        <fieldset className="field-wrapper">
                          <label>City</label>
                          <input
                            className="input--underline"
                            type="text"
                            placeholder="Location"
                            required
                            value={this.props.geo}
                            onChange={changeGeo} />
                        </fieldset>
              <fieldset className="field-wrapper">
                <label>Short Description</label>
                          <textarea
                            className="input--underline"
                            type="text"
                            rows="4"
                            placeholder="What's the story behind this itinerary?"
                            value={this.props.description}
                            onChange={changeDescription} />
                        </fieldset>

                        <div
                        className="vb w-100 vb--create mrgn-top-md"
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

export default connect(mapStateToProps, Actions)(NewItineraryModal);