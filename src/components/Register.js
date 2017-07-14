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
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.changeUsername = ev => this.props.onChangeUsername(ev.target.value);
    // this.changeEmail = ev => onChangeEmail(ev.target.value);
    // this.changePassword = ev => onChangePassword(ev.target.value);
    // this.changeUsername = ev => onChangeUsername(ev.target.value);
    // this.submitForm = (username, email, password) => ev => {
    this.submitForm = (username, email, password) => ev => {
      ev.preventDefault();
      // this.props.onSubmit(username, email, password);
      this.props.signUpUser(username.toLowerCase(), email, password);
    }
  }

  componentWillMount() {
    this.props.sendMixpanelEvent('Register page loaded');
  }

  componentWillUnmount() {
    this.props.unloadAuth();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    const username = this.props.username;

    return (
      <div className="page-common auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <div className="v2-type-page-header ta-center">Sign Up</div>
              <div className="text-xs-center mrgn-bottom-sm">
                <Link className="v2-type-body1 color--primary" to="/login">
                  Have an account?
                </Link>
              </div>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(username, email, password)}>
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
                      type="password"
                      placeholder="Password"
                      value={this.props.password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="vb fill--primary w-100"
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