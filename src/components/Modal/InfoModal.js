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
        label="Close"
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

          contentStyle={{width: "100%", maxWidth: "600px"}}
        >

        <div className="dialog--save flx flx-col">
          <div className="dialog--save__tip-name color--black tip__title v2-type-h3 v-row brdr-bottom">{this.props.review.subject.title}</div>
           

            <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm brdr-bottom w-100">
              <div className="flx flx-row flx-align-center mrgn-bottom-sm">
                <i className="material-icons mrgn-right-md color--primary md-18">&#xE55F;</i>
                <label>Address</label>
              </div>
              <div>
                <div className="v2-type-body1">{this.props.review.subject.address}</div>
              </div>
            </div>

           <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm brdr-bottom w-100">
              <div className="flx flx-row flx-align-center mrgn-bottom-sm">
                <i className="material-icons mrgn-right-md color--primary md-18">phone</i>
                <label>Phone</label>
              </div>
              <div>
                <div className="v2-type-body1">{this.props.review.subject.internationalPhoneNumber}</div>
              </div>
            </div>

            <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm">
              <div className="flx flx-row flx-align-center mrgn-bottom-sm md-18">
                <i className="material-icons mrgn-right-md color--primary">schedule</i>
                <label>Hours</label>
              </div>
              <div>
                <div className="v2-type-body1"><ShowWeekDayText subject={this.props.review.subject} /></div>
              </div>
            </div>

         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(InfoModal);