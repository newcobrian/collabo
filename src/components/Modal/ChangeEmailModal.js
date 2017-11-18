import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import ListErrors from './../ListErrors';

const mapStateToProps = state => ({
  ...state.modal,
  ...state.settings,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated
});

class ChangeEmailModal extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: ''
    };

    this.updateState = field => ev => {
      const state = this.state;
      const newState = Object.assign({}, state, { [field]: ev.target.value });
      this.setState(newState);
    };

    this.submitForm = ev => {
      ev.preventDefault();
      this.props.changeEmailAddress(this.state.email, this.state.password)
    }
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Close"
        className="vb mrgn-right-sm"
        hoverColor="rgba(247,247,247,.2)"
        onClick={handleClose}
        style={{
          }}
          labelStyle={{   
                      }}
      />,
      <FlatButton
        label="Update"
        hoverColor="white"
        onClick={this.submitForm}
        disableTouchRipple={true}
        fullWidth={false}
        className="vb color--white fill--primary"
        labelStyle={{ 
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
          open={(this.props.modalType === Constants.CHANGE_EMAIL_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          className="dialog-wrapper"
          style={{
              
            }}

          title='Change Your Email Address'
          titleClassName="dialog__title v2-type-h2"
          titleStyle={{}}

          className="dialog dialog--save"
          style={{height: "100%"}}

          overlayClassName="dialog__overlay"
          overlayStyle={{}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px", height: "100%"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "0px", height: "100%"}}

          actionsContainerClassName="dialog--save__actions"
          actionsContainerStyle={{}}
          
        >

            <div className="dialog--save__content">
              <div className="flx flx-col flx-center-all new-itin-modal">
                <div className="page-title-wrapper center-text DN">
                  <div className="v2-type-page-header">Change Your Email Address</div>
                  <div className="v2-type-body2 opa-60 mrgn-top-sm DN"></div>
                </div>
                <div className="flx flx-col flx-center-all create-wrapper mrgn-top-md">
                  <ListErrors errors={this.props.errors}></ListErrors>
                      <div className="form-wrapper flx flx-col-left">
                        <form>
                          <fieldset className="field-wrapper">
                          Current email address: {this.props.currentUser.email}
                          </fieldset>

                    <fieldset className="field-wrapper">
                      <label></label>
                        <input
                          className="input--underline edit-itinerary__name"
                          type="text"
                          required
                          placeholder="New email address"
                          value={this.state.email}
                          onChange={this.updateState('email')} />
                      </fieldset>
                      
                    <fieldset className="field-wrapper">
                      <label></label>
                        <input
                          className="input--underline edit-itinerary__name"
                          type="password"
                          required
                          placeholder="Re-enter your password"
                          value={this.state.password}
                          onChange={this.updateState('password')} />
                      </fieldset>

                    <div
                    className="DN vb w-100 vb--create mrgn-top-md"
                    type="button"
                    onClick={this.submitForm}>
                    Update email
                  </div>
                </form>
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

export default connect(mapStateToProps, Actions)(ChangeEmailModal);