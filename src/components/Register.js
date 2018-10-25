import { Link } from 'react-router';
import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';

const mapStateToProps = state => ({ 
  ...state.auth,
  authenticationError: state.auth.error
});

// const mapDispatchToProps = dispatch => ({
//   onChangeEmail: value =>
//     dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),
//   onChangePassword: value =>
//     dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),
//   onChangeUsername: value =>
//     dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'username', value }),
//   // onSubmit: (username, email, password) => {
//   //   const payload = agent.Auth.register(username, email, password);
//   //   dispatch({ type: 'REGISTER', payload })
//   // },
//   onUnload: () =>
//     dispatch({ type: 'REGISTER_PAGE_UNLOADED' })
// });

class Register extends React.Component {
  constructor() {
    super();

    const updateFieldEvent =
        key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.REGISTER_PAGE);

    // this.changeEmail = updateFieldEvent('email');
    this.changePassword = updateFieldEvent('password');
    // this.changeUsername = updateFieldEvent('username');
    this.changeFullName = updateFieldEvent('fullName');
    // this.changeLastName = updateFieldEvent('lastName');
    // this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    // this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    // this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
    // this.changeEmail = ev => onChangeEmail(ev.target.value);
    // this.changePassword = ev => onChangePassword(ev.target.value);
    // this.changeUsername = ev => onChangeUsername(ev.target.value);
    // this.submitForm = (username, email, password) => ev => {
    this.submitForm = (email, password, fullName) => ev => {
      ev.preventDefault();
      this.props.signUpUser(this.props.email.toLowerCase(), password, fullName, this.props.params.vid, this.props.authRedirect);
    }
  }
  
  componentDidMount () {
    this.props.loadEmailCode(this.props.params.vid)
    this.props.setSidebar(false);
  }

  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'register'});
  }

  componentWillUnmount() {
    this.props.unloadAuth();
  }

  render() {
    const { email, password, fullName, emailCodeNotFound } = this.props;
    if (emailCodeNotFound) {
      return (
        <div>
          <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
            <div className="container page">
              <div className="row">

                <div className="col-md-6 offset-md-3 col-xs-12 flx flx-col flx-center-all">
                <div className="co-logo large-logo mrgn-bottom-sm mrgn-top-md">
                  <img className="center-img" src="/img/logomark.png"/>
                </div>
                <div className="register-msg co-type-body ta-center mrgn-bottom-sm color--white w-100 pdding-left-sm pdding-right-sm pdding-bottom-md">
                  Sorry, this email link has expired.
                  <Link to={'/register'}>Click here to send another verification email?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )
    }
    else {
      return (
        <div>
          <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
            <div className="container page">
              <div className="row">

                <div className="col-md-6 offset-md-3 col-xs-12 flx flx-col flx-center-all">
                <div className="co-logo large-logo mrgn-bottom-sm mrgn-top-md">
                  <img className="center-img" src="/img/logomark.png"/>
                </div>
                <div className="register-msg co-type-body ta-center mrgn-bottom-sm color--white w-100 pdding-left-sm pdding-right-sm pdding-bottom-md">
                  {this.props.message}
                </div>

                  <div className="co-type-page-title color--white ta-center">Join KOI</div>
                  <div className="text-xs-center mrgn-bottom-sm">
                    <Link className="co-type-body color--white opa-60" to="/login">
                      Log in
                    </Link>
                  </div>

                  <ListErrors errors={this.props.errors} />

                  <form onSubmit={this.submitForm(email, password, fullName)}>
                    <fieldset>

                      {/*<fieldset className="form-group ">
                        <input
                          className="form-control form-control-lg"
                          type="text"
                          placeholder="Username" 
                          value={this.props.username}
                          onChange={this.changeUsername} />
                      </fieldset>

                      <fieldset className="form-group ">
                        <input
                          className="form-control form-control-lg"
                          type="email"
                          placeholder="Email"
                          value={this.props.email}
                          onChange={this.changeEmail} />
                      </fieldset>*/}

                      Verified email: {email}

                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          type="fullName"
                          placeholder="Enter your full name"
                          value={this.props.fullName}
                          onChange={this.changeFullName} />
                      </fieldset>

                      <fieldset className="form-group">
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          placeholder="Choose a password"
                          value={this.props.password}
                          onChange={this.changePassword} />
                      </fieldset>

                      <button
                        className="vb fill--tertiary color--primary vb--round w-100 ta-center"
                        type="submit"
                        disabled={this.props.inProgress}>
                        Register
                      </button>

                    </fieldset>
                  </form>
                </div>

              </div>
            </div>
          </div>
          <div className="footer color--white flx flx-col flx-center-all flx-item-bottom co-type-data pdding-top-lg">
            <div className="co-type-data color--white opa-70 mrgn-bottom-md">
              &copy; 2018 Futurehumans, LLC All Rights Reserved
            </div>
            <div className="flx flx-row flx-center-all mrgn-bottom-lg">
              <Link to="/terms.html" target="blank" className="color--white opa-70">
                Terms of Service
              </Link>
              <div className="middle-dot color--white flx-hold">&middot;</div>
              <Link to="/privacy.html" target="blank" className="color--white opa-70">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Register);
export default connect(mapStateToProps, Actions)(Register);