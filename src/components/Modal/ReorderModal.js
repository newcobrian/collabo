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

class ReorderModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const submitForm = ev => {
      ev.preventDefault();
    }

    const actions = [
      <FlatButton
        label="Cancel"
        className="vb fill--white vb--shadow-none"
        onTouchTap={handleClose}
        style={{
            color:'#2B3538'
          }}
      />,
      <FlatButton
        label="Save"
        hoverColor="white"
        onTouchTap={submitForm}
        disableTouchRipple={true}
        fullWidth={false}
        className="vb vb--shadow-none color--white fill--primary"
        labelStyle={{   fontWeight: '400',
                        fontSize: '14px',
                        letterSpacing: '2px',
                        boxShadow: 'none'
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
          open={(this.props.modalType === Constants.REORDER_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{
              
            }}
        >

        <div className="flx flx-col">
          HIHOHOHOHO
        </div>
          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ReorderModal);