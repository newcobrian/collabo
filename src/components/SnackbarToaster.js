import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const mapStateToProps = state => ({
  ...state.snackbarToaster
});

class SnackbarToaster extends React.Component {

  render() {
    return  (
      <span>
      	<MuiThemeProvider muiTheme={getMuiTheme()}>
	        <Snackbar
	          open={this.props.open}
	          message={this.props.message}
	          autoHideDuration={this.props.duration || 5000}
	          onRequestClose={this.props.onRequestClose}
	        />
	    </MuiThemeProvider>
      </span>
    ) ;
  }
}

export default connect(mapStateToProps, Actions)(SnackbarToaster);