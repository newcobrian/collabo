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
              action="View now"
              onActionTouchTap={handleOnActionTouchTap}
              autoHideDuration={this.props.duration || 800000}
              onRequestClose={this.props.onRequestClose}
              className="ta-center"
              style={{opacity:"1", marginBottom:"0px"}}
              bodyStyle={{opacity:".95", backgroundColor: "#121419"}}
              contentStyle={{}}

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
	          autoHideDuration={this.props.duration || 800000}
	          onRequestClose={this.props.onRequestClose}
            className="ta-center"
            style={{opacity:"1", height:"90px", marginBottom:"20px"}}
            bodyStyle={{opacity:".95", backgroundColor: "#121419", marginBottom:"20px", height:"90px", padding: "20px", border:"2px solid #00E2C8"}}
            contentStyle={{fontWeight: "bold;", fontSize: "16px"}}

	        />
	    </MuiThemeProvider>
      </span>
    ) ;
  }
}

export default connect(mapStateToProps, Actions)(SnackbarToaster);