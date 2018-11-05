import { Link } from 'react-router';
import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';

const mapStateToProps = state => ({ 
  ...state.auth
});

// const mapDispatchToProps = dispatch => ({
//   onChangeEmail: value =>
//     dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'email', value }),
//   onChangePassword: value =>
//     dispatch({ type: 'UPDATE_FIELD_AUTH', key: 'password', value }),
//   onSubmit: (email, password) =>
//     dispatch({ type: 'LOGIN', payload: agent.Auth.login(email, password) }),
//   onUnload: () =>
//     dispatch({ type: 'LOGIN_PAGE_UNLOADED' })
// });

class Login extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.submitForm = (email, password) => ev => {
      // this.submitForm = (email, password) => {
      ev.preventDefault();
      // this.props.onSubmit(email, password);
      this.props.signInUser(email, password, this.props.authRedirect);
    };
  }

  componentDidMount () {
    this.props.setSidebar(false);
  }

  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'login'});
  }

  componentWillUnmount() {
    this.props.unloadAuth();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;

    return (
      <div>
        <div className="home-page page-common page-login flx flx-col flx-align-center flx-just-start ta-center fill--pond">

            <div className="w-100 w-max-400 flx flx-col flx-center-all">
              <div className="loggedout-logo mrgn-bottom-xs mrgn-top-md">
                <img className="center-img" src="/img/koi-logo_a.png"/>
              </div>
              <div className="register-msg co-type-body ta-center mrgn-bottom-sm color--white w-100 pdding-left-sm pdding-right-sm pdding-bottom-md">
                {this.props.message}
              </div>

                <div className="co-type-page-title color--black ta-center">Welcome Back</div>
                <div className="text-xs-center mrgn-bottom-sm mrgn-top-sm">
                  <Link className="text-hover co-type-body color--utsuri opa-60" to="/register">
                    Create an account
                  </Link>
                </div>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(email, password)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button type="submit"
                    disabled={this.props.inProgress}
                    className="flx flx-col flx-center-all koi-button-fancy-wrapper home-register-button border--seaweed w-100">
                      <div className="koi-button-fancy-outer">
                      </div>
                      <div className="koi-button-fancy-inner">
                      </div>
                      <div className="koi-button-fancy-text color--seaweed">
                        Login
                      </div>
                  </button>

                  <fieldset className="text-xs-center mrgn-bottom-sm mrgn-top-md">
                    <Link className="koi-type-body text-hover color--utsuri opa-60" to='/ForgotPassword'>Forgot password?</Link>
                  </fieldset>
                </fieldset>
              </form>
            </div>

          </div>


        <div className="footer color--black fill--pond flx flx-col flx-center-all flx-item-bottom co-type-data pdding-top-lg">
        <div className="koi-type-body color--black opa-70 mrgn-bottom-md">
          &copy; 2018 Futurehumans, LLC All Rights Reserved
        </div>
        <div className="flx flx-row flx-center-all mrgn-bottom-lg">
          <Link to="/terms.html" target="blank" className="koi-type-body color--black opa-70">
            Terms of Service
          </Link>
          <div className="middle-dot color--white flx-hold">&middot;</div>
          <Link to="/privacy.html" target="blank" className="koi-type-body color--black opa-70">
            Privacy Policy
          </Link>
        </div>
      </div>
      </div>
    );
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default connect(mapStateToProps, Actions)(Login);