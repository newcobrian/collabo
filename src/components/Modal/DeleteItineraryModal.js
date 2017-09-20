import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { DELETE_ITINERARY_MODAL } from '../../actions';

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
        disableTouchRipple={true}
        fullWidth={false}
        labelStyle={{}}
        style={{
          }}
      />,
      <FlatButton
        label="Delete"
        hoverColor="white"
        onTouchTap={deleteClick}
        disableTouchRipple={true}
        fullWidth={false}
        className="vb vb--light"
        labelStyle={{color: "red"}}
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
          
          title="Permanently delete this guide?"
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
            
            <div className="dialog--delete__content">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="dialog--save__tip-name">It will be lost forever...</div>
              </div>
              <div
                className="vb w-100 vb--create mrgn-top-md DN"
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