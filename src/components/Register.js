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

  componentWillUnmount() {
    // this.props.onUnload();
  }

  render() {
    const email = this.props.email;
    const password = this.props.password;
    const username = this.props.username;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="login">
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={this.props.error} />

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
                    className="bttn-style bttn-wide pull-xs-right"
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


// import React from 'react';
// import { Field, reduxForm } from 'redux-form';
// import { connect } from 'react-redux';
// import * as Actions from '../actions';

// const validate = values => {
//   const errors = {};

//   if (!values.username) {
//     errors.username = "Please enter a username.";
//   }

//   if (!values.email) {
//     errors.email = "Please enter an email.";
//   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
//     errors.email = 'Invalid email address'
//   }

//   if (!values.password) {
//     errors.password = "Please enter a password.";
//   }

//   if (!values.passwordConfirmation) {
//     errors.passwordConfirmation = "Please enter a password confirmation.";
//   }

//   if (values.password !== values.passwordConfirmation ) {
//     errors.password = 'Passwords do not match';
//   }

//   return errors;
// };

// class Signup extends React.Component {
//   handleFormSubmit = (values) => {
//     this.props.signUpUser(values);
//   };

//   renderField = ({ input, label, type, meta: { touched, error } }) => (
//     <fieldset className={`form-group ${touched && error ? 'has-error' : ''}`}>
//       <label className="control-label">{label}</label>
//       <div>
//         <input {...input} placeholder={label} className="form-control" type={type} />
//         {touched && error && <div className="help-block">{error}</div>}
//       </div>
//     </fieldset>
//   );

//   renderAuthenticationError() {
//     if (this.props.authenticationError) {
//       return <div className="alert alert-danger">{ this.props.authenticationError }</div>;
//     }
//     return <div></div>;
//   }

//   render() {
//     return (
//       <div className="container">
//         <div className="col-md-6 col-md-offset-3">
//           <h2 className="text-center">Sign Up</h2>

//           { this.renderAuthenticationError() }

//           <form onSubmit={this.props.handleSubmit(this.handleFormSubmit)}>
//             <Field name="username" type="text" component={this.renderField} label="Username" />
//             <Field name="email" type="text" component={this.renderField} label="Email" />
//             <Field name="password" type="password" component={this.renderField} label="Password" />
//             <Field name="passwordConfirmation" type="password" component={this.renderField} label="Password Confirmation" />

//             <button action="submit" className="btn btn-primary">Sign up</button>
//           </form>
//         </div>
//       </div>
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     authenticationError: state.auth.error
//   }
// }

// export default connect(mapStateToProps, Actions)(reduxForm({
//   form: 'signup',
//   validate
// })(Signup));