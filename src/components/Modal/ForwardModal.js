import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
// import FriendSelector from '../FriendSelector';
import { FORWARD_MODAL } from '../../actions';

const mapStateToProps = state => ({
  ...state.modal,
  // ...state.friendSelector,
  authenticated: state.common.authenticated
});

class ForwardModal extends React.Component {
  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'forward modal' });
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Cancel"
        onClick={handleClose}
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
          open={(this.props.modalType === FORWARD_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{
              
            }}
        >
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ForwardModal);