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
  ...state.create,
  authenticated: state.common.authenticated
});

class InfoModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Cancel"
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
          open={(this.props.modalType === Constants.INFO_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{
              
            }}
        >
          {JSON.stringify(this.props.review)}
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(InfoModal);