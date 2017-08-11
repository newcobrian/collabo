import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';

const ShowWeekDayText = props => {
  if (!props.subject || !props.subject.hours || !props.subject.hours.weekdayText) {
    return (<div className="v2-type-body2">N/A</div>);
  }
    else {
      return (
        <ul className="v2-type-body2">
          {
            props.subject.hours.weekdayText.map((day, index) => {
              return (
                <li key={index}>{day}</li>
                )
            })
          }
        </ul>
      )
    }
}

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
          open={(this.props.modalType === Constants.INFO_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{
              
            }}
        >

        <div className="flx flx-col">
           <div className="dialog--save__tip-name color--black tip__title v2-type-h2 v-row">{this.props.review.subject.title}</div>
           <div className="v-row">
             <label>Address</label>
             <div className="v2-type-body2">{this.props.review.subject.address}</div>
          </div>
           <div className="v-row">
             <label>Phone</label>
             <div className="v2-type-body2">{this.props.review.subject.internationalPhoneNumber}</div>
          </div>
          <div className="v-row">
             <label>Hours</label>
             <ShowWeekDayText subject={this.props.review.subject} />
          </div>
        </div>
          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(InfoModal);