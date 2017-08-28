import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Snackbar from 'material-ui/Snackbar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const mapStateToProps = state => ({
  ...state.snackbarToaster
});

class SnackbarToaster extends React.Component {
  render() {
    const handleOnActionTouchTap = ev => {
      ev.preventDefault();
      browserHistory.push(this.props.link)
    }
    
    if (this.props.link) {
      return  (
        <span>
          <MuiThemeProvider muiTheme={getMuiTheme()}>
            <Snackbar
              open={this.props.open}
              message={this.props.message}
              action="GO"
              onActionTouchTap={handleOnActionTouchTap}
              autoHideDuration={this.props.duration || 5000}
              onRequestClose={this.props.onRequestClose}
              style={{opacity:"1", marginBottom:"20px"}}
              bodyStyle={{opacity:".95", backgroundColor: "#63A652"}}

            />
        </MuiThemeProvider>
        </span>
      ) ;
    }
    return  (
      <span>
      	<MuiThemeProvider muiTheme={getMuiTheme()}>
	        <Snackbar
	          open={this.props.open}
	          message={this.props.message}
	          autoHideDuration={this.props.duration || 5000}
	          onRequestClose={this.props.onRequestClose}
            style={{opacity:"1", marginBottom:"20px"}}
            bodyStyle={{opacity:".95", backgroundColor: "#63A652"}}

	        />
	    </MuiThemeProvider>
      </span>
    ) ;
  }
}

export default connect(mapStateToProps, Actions)(SnackbarToaster);