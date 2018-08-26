import React from 'react';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { connect } from 'react-redux';

const mapStateToProps = state => ({ 
  ...state.auth
});

class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.submitForm = (email, password) => ev => {
      ev.preventDefault();
      this.props.sendForgotPassword(email);
    };
  }

  componentDidMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'forgot password page'});
  }

  componentWillUnmount() {
  	this.props.unloadAuth();
  }

  render() {
  	const email = this.props.email;

	return (
		<div className="page-common auth-page">
	        <div className="container page">
	          <div className="row">

	            <div className="col-md-6 offset-md-3 col-xs-12">
	              <div className="mrgn-top-lg v2-type-page-header mrgn-bottom-sm ta-center">Reset Password</div>
	              <div className="v2-type-body1 mrgn-bottom-sm ta-center mrgn-bottom-md">
	              	Enter your email address and we'll send you a link to reset your password:
	              </div>

	              <form onSubmit={this.submitForm(email)}>
	                <fieldset>

	                  <fieldset className="form-group">
	                    <input
	                      className="form-control form-control-lg mrgn-bottom-sm"
	                      type="email"
	                      placeholder="Email"
	                      value={email}
	                      onChange={this.changeEmail} />
	                  </fieldset>

	                  <button
	                    className="vb fill--primary w-100"
	                    type="submit">
	                    Reset Password
	                  </button>
	                </fieldset>
	              </form>
	            </div>

	          </div>
	        </div>
        </div>
    	);
	}
};

export default connect(mapStateToProps, Actions)(ForgotPassword);