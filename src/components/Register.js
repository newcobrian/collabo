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

    this.changeEmail = updateFieldEvent('email');
    this.changePassword = updateFieldEvent('password');
    this.changeUsername = updateFieldEvent('username');
    this.changeFullName = updateFieldEvent('fullName');
    // this.changeLastName = updateFieldEvent('lastName');
    // this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    // this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    // this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
    // this.changeEmail = ev => onChangeEmail(ev.target.value);
    // this.changePassword = ev => onChangePassword(ev.target.value);
    // this.changeUsername = ev => onChangeUsername(ev.target.value);
    // this.submitForm = (username, email, password) => ev => {
    this.submitForm = (username, email, password, fullName) => ev => {
      ev.preventDefault();
      // this.props.onSubmit(username, email, password);
      this.props.signUpUser(username.toLowerCase(), email.toLowerCase(), password, fullName, this.props.authRedirect);
    }
  }
  
  componentDidMount () {
    this.props.setSidebar(false);
  }

  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'register'});
  }

  componentWillUnmount() {
    this.props.unloadAuth();
  }

  render() {
    const { email, password, username, fullName } = this.props;
    return (
      <div className="page-common auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
            <div className="register-msg v2-type-body3 ta-center mrgn-bottom-sm mrgn-top-md color--black w-100 pdding-left-lg pdding-right-lg pdding-top-md pdding-bottom-md">
              {this.props.message}
            </div>
              <div className="v2-type-page-header ta-center">Sign Up</div>
              <div className="text-xs-center mrgn-bottom-sm">
                <Link className="v2-type-body1 color--primary" to="/login">
                  Log in
                </Link>
              </div>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(username, email, password, fullName)}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username" 
                      value={this.props.username}
                      onChange={this.changeUsername} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.props.email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="fullName"
                      placeholder="Full Name"
                      value={this.props.fullName}
                      onChange={this.changeFullName} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={this.props.password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="vb fill--primary color--white w-100 ta-center"
                    type="submit"
                    disabled={this.props.inProgress}>
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Register);
export default connect(mapStateToProps, Actions)(Register);