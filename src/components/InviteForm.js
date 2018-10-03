import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';

const mapStateToProps = state => ({
  ...state.inviteForm,
  authenticated: state.common.authenticated
});

class InviteForm extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.INVITE_FORM);

	    this.changeInvites = updateFieldEvent('invites');

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.invites) {
	        this.props.createSubmitError('Please add some email addresses to invite', Constants.INVITE_FORM);
	      }
	      else {
		   	let invites = this.props.invites ? this.props.invites.toLowerCase() : ''

		    this.props.setInProgress();
		    this.props.onInviteSubmit(invites);
		  }
    	}
	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
	}

	render() {
		return (
			<div className="page-common flx flx-col flx-center-all">

				{/* FORM START */}
	            <div className="content-wrapper header-push ta-left flx flx-col">
		            <form>
	                    <fieldset className="field-wrapper">
							<div className="field-label">Invite team members</div>
	                      <textarea
	                        className="input--underline v2-type-body3"
	                        type="text"
	                        rows="4"
	                        maxLength="184"
	                        placeholder="Add email addresses separated by commas..."
	                        required
	                        value={this.props.invites}
	                        onChange={this.changeInvites} />
	                    </fieldset>

	                    <ListErrors errors={this.props.errors}></ListErrors>
	                    
	                    <div
	                    className="vb vb--create w-100 mrgn-top-md fill--light-green"
	                    type="button"
	                    disabled={this.props.inProgress}
	                    onClick={this.submitForm}>
	                    	<div className="flx flx-row flx-center-all ta-center">
		                    	<div className="flx-grow1 mrgn-left-md color--green">Send invites</div>
							</div>
	                  </div>
			        </form>
			    </div>
				{/* FORM END */}
			</div>
		)
	}
}

export default connect(mapStateToProps, Actions)(InviteForm);