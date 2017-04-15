import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { REVIEW_MODAL } from '../../actions';
import Create from '../Create';

const mapStateToProps = state => ({
  ...state.modal,
  ...state.create,
  authenticated: state.common.authenticated
});

class ReviewModal extends React.Component {
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
          open={(this.props.modalType === REVIEW_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{
              
            }}
        >
          <Create />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ReviewModal);