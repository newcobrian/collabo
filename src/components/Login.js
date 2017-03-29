import { Link } from 'react-router';
import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

const mapStateToProps = state => ({ 
  ...state.auth,
  authenticationError: state.auth.error
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
      this.props.signInUser(email, password);
    };
  }

  componentWillMount() {
    this.props.sendMixpanelEvent('Login page loaded');
  }

  componentWillUnmount() {
    // this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    return (
      <div className="page-common auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="register">
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={this.props.error} />

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

                  <button
                    className="bttn-style bttn-wider pull-xs-right"
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

// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default connect(mapStateToProps, Actions)(Login);