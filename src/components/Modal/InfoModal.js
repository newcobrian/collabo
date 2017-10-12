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
    return (<div className="v2-type-body2 opa-40">N/A</div>);
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

const ShowWebsite = props => {
  if (!props.subject || !props.subject.website) {
    return (<div className="v2-type-body2 opa-40">N/A</div>);
  }
    else {
      return (
        <a href={props.subject.website} target='_blank' className="v2-type-body2 color--primary">{props.subject.website}</a>
      )
    }
}

const ShowPhoneNumber = props => {
  if (!props.subject || !props.subject.internationalPhoneNumber) {
    return (<div className="v2-type-body2 opa-40">N/A</div>);
  }
    else {
      return (
        <div className="v2-type-body2">
          {props.subject.internationalPhoneNumber}
        </div>
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

    let googleMapLink = (this.props.review.subject.googleMapsURL ? this.props.review.subject.googleMapsURL :
        'https://maps.google.com/maps?q=' + this.props.review.subject.location.lat + ',' + this.props.review.subject.location.lng)

    const actions = [
      <FlatButton
        label="Close"
        className="vb"
        hoverColor="rgba(247,247,247,.2)"
        onTouchTap={handleClose}
        style={{
          }}
          labelStyle={{   
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
          onRequestClose={handleClose}
          className="dialog-wrapper"
          style={{
              
            }}

          title={this.props.review.subject.title}
          titleClassName="dialog__title v2-type-h2"
          titleStyle={{}}

          className="dialog dialog--save"
          style={{}}

          overlayClassName="dialog__overlay"
          overlayStyle={{}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "0px"}}

          actionsContainerClassName="dialog--save__actions"
          actionsContainerStyle={{}}
          
        >

        <div className="dialog--save flx flx-col color--black font--alpha">
           
            <div className="mrgn-top-md w-100">
              <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm brdr-bottom w-100 pdding-left-md pdding-right-md">
                <div className="flx flx-row flx-align-start mrgn-bottom-sm">
                  <i className="material-icons mrgn-right-md color--black opa-60 md-24">&#xE55F;</i>
                <div>
                <div className="v2-type-body2">{this.props.review.subject.address}</div>
                <a target='_blank' className="color--primary v2-type-body2" href={googleMapLink}>Get Directions</a>
                </div>
              </div>
            </div>

            <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm brdr-bottom w-100 pdding-left-md pdding-right-md">
              <div className="flx flx-row flx-align-start mrgn-bottom-sm">
                <i className="material-icons mrgn-right-md color--black opa-60 md-24">link</i>
                <div className="v2-type-body2"><ShowWebsite subject={this.props.review.subject} /></div>
              </div>    
            </div>

            <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm brdr-bottom w-100 pdding-left-md pdding-right-md">
              <div className="flx flx-row flx-align-start mrgn-bottom-sm">
                <i className="material-icons mrgn-right-md color--black opa-60 md-24">phone</i>
                <div className="v2-type-body2"><ShowPhoneNumber subject={this.props.review.subject} /></div>
              </div>    
            </div>

            <div className="flx flx-col mrgn-bottom-md pdding-bottom-sm pdding-left-md pdding-right-md">
              <div className="flx flx-row flx-align-start mrgn-bottom-sm md-24">
                <i className="material-icons mrgn-right-md color--black opa-60">schedule</i>
                <div className="v2-type-body2"><ShowWeekDayText subject={this.props.review.subject} /></div>
              </div>
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