import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { SAVE_MODAL } from '../../actions';

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class SaveModal extends React.Component {
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
          open={(this.props.modalType === SAVE_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{}}>
          	<div>
				<ul>
					<li> Create new itinerary </li>
					{this.props.itinerariesList.map(itinerary => {
				        return (
				            <li>
						    	<div>
						    		{itinerary.title}
						    	</div>
						    </li>
				        );
				     })}
				</ul>
			</div>
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(SaveModal);