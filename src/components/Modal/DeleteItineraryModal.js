import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { DELETE_ITINERARY_MODAL } from '../../actions';
import ImagePicker from './../ImagePicker';

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class DeleteItineraryModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const deleteClick = () => {
      this.props.onDeleteItinerary(this.props.authenticated, this.props.itinerary.id, this.props.itinerary.geo.placeId, this.props.source);
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

    if (!this.props.itinerary) return null;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === DELETE_ITINERARY_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}

          className="dialog--save"
          style={{}}

          overlayClassName="dialog--save__overlay"
          overlayStyle={{}}
          
          title="this.props.itinerary.title"
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
                  <div className="dialog--save__tip-name">Are you sure you want to delete this itinerary? It will be lost forever</div>
                </div>
              </div>
              <div
                className="vb w-100 vb--create mrgn-top-md"
                type="button"
                onClick={deleteClick}>
                Delete
              </div>
    			</div>

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(DeleteItineraryModal);