import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class ReorderModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Close"
        className="vb fill--white vb--shadow-none"
        onTouchTap={handleClose}
        style={{
            color:'#2B3538'
          }}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === Constants.REORDER_ITINERARY_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{
              
            }}

          contentStyle={{width: "100%", maxWidth: "600px"}}
        >

        <div className="dialog--save flx flx-col">
          <div className="dialog--save__tip-name color--black tip__title v2-type-h3 v-row brdr-bottom">TITLE</div>
           

            <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm brdr-bottom w-100">
              <div className="flx flx-row flx-align-center mrgn-bottom-sm">
                <i className="material-icons mrgn-right-md color--primary md-18">&#xE55F;</i>
                <label>Address</label>
              </div>
              <div>
                <div className="v2-type-body1">ADDY</div>
              </div>
            </div>

           <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm brdr-bottom w-100">
              <div className="flx flx-row flx-align-center mrgn-bottom-sm">
                <i className="material-icons mrgn-right-md color--primary md-18">phone</i>
                <label>Phone</label>
              </div>
              <div>
                <div className="v2-type-body1">PHONE NUM</div>
              </div>
            </div>

            <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm">
              <div className="flx flx-row flx-align-center mrgn-bottom-sm md-18">
                <i className="material-icons mrgn-right-md color--primary">schedule</i>
                <label>Hours</label>
              </div>
              <div>
              </div>
            </div>

         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ReorderModal);