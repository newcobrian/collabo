import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';
import LoggedOutMessage from './LoggedOutMessage';

const mapStateToProps = state => ({
  ...state.enterEmail,
  authenticated: state.common.authenticated
});

const EmailTakenError = props => {
	if (!props.emailTaken) {
		return null
	}
	else {
		return (
			<div>
				This email address is taken. 
				<Link to={'/login'}>Sign in</Link>
				<Link to={'/forgotPassword'}>Did you forget your password?</Link>
			</div>
		)
	}
}

class EnterEmail extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ENTER_EMAIL_PAGE);

	    this.changeEmail = updateFieldEvent('email');

		this.submitForm = ev => {
	      ev.preventDefault();

		  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		  let lowerCaseEmail = this.props.email ? this.props.email.toLowerCase() : ''

	      if (!re.test(lowerCaseEmail)) {
	        this.props.createSubmitError('Please enter a valid email address', Constants.ENTER_EMAIL_PAGE);
		  }
	      else {
		    this.props.setInProgress();
		    this.props.enterEmail(lowerCaseEmail)
		  }
    	}

    	this.onGoBackClick = ev => {
	      ev.preventDefault();
	      browserHistory.goBack()
	    }

	    this.onResendVerification = ev => {
	    	ev.preventDefault()
	    	this.props.resetVerificationPage()
	    }
	}

	componentDidMount() {
    	this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'enter email'});
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
	}

	render() {
		if (this.props.emailSent) {
			return (
				<div className="home-page  page-register fill--pond flx flx-col flx-center-all">
		         	<div className="koi-view ta-left flx flx-col">
						<div className="koi-big-header mrgn-bottom-md color--utsuri opa-30">
		    				Almost Done
		  				</div>
						<div className="co-post-title mrgn-bottom-md">
		    				Check your email
		  				</div>
		  				<div className="co-type-body color--black mrgn-bottom-md">
		  					 You should have receieved a verification email (check spam folder). Click back on the link in the email to complete the sign up process.
		  				</div>
		  				<div>
		  					<Link className="text-hover color--utsuri opa-40" to='/login'>Click here to login</Link> or <Link className="text-hover color--utsuri opa-40" onClick={this.onResendVerification}>click here to send another verification email</Link>
		  				</div>
		  			</div>
		  		</div>
			)
		}
		else {
			return (
				<div className="home-page page-common page-register fill--pond flx flx-col flx-center-all">
		         	<div className="koi-view header-push ta-left flx flx-col">
						<div className="koi-big-header mrgn-bottom-md color--utsuri opa-30">
		    				Join Koi
		  				</div>
		  				<div className="co-post-title mrgn-bottom-md color--black">
		    				Enter your email address
		  				</div>
			            <div className="DN co-type-body color--black mrgn-bottom-md">
						This is your team/company name (ie "Tesla", "Nike")
						</div>
						
			            <form>


							<fieldset className="field-wrapper">
								
		                      <input
		                        className="input--underline edit-itinerary__name"
		                        type="text"
		                        placeholder="'kd@warriors.com'"
		                        required
		                        value={this.props.email}
		                        maxLength="42"
		                        onChange={this.changeEmail} />
		                    </fieldset>

		                    <ListErrors errors={this.props.errors}></ListErrors>
		                    <EmailTakenError emailTaken={this.props.emailTaken} />
		                    
		                    <div className="flx flx-row flx-just-end w-100">
		                    	<Link onClick={()=>browserHistory.goBack()} activeClassName="active" className="vb mrgn-top-md fill--gray color--black mrgn-right-sm">
		                    	   Cancel
		                    	</Link>
								<div
								className="vb mrgn-top-md fill--seaweed color--white"
								type="button"
								disabled={this.props.inProgress}
								onClick={this.submitForm}>
								    	
									Submit

								</div>
			                 </div>
				        </form>

			       
			    </div>
		    </div>
			)
		}
	}
}

export default connect(mapStateToProps, Actions)(EnterEmail);