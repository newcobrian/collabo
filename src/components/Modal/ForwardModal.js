import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import { Modal } from 'react-modal'
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import FriendSelector from '../FriendSelector';
import { FORWARD_MODAL } from '../../actions';

const mapStateToProps = state => ({
  ...state.modal,
  ...state.friendSelector,
  authenticated: state.common.authenticated
});

class ForwardModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleClose}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          title="Select friends"
          actions={actions}
          modal={false}
          open={(this.props.modalType === FORWARD_MODAL) ? true : false}
          autoScrollBodyContent={true}
        >
          <FriendSelector />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ForwardModal);