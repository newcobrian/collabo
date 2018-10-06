import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import OrgHeader from './OrgHeader';
import ListErrors from './ListErrors';
import Sidebar from 'react-sidebar';
import ProjectList from './ProjectList';
import { Link, browserHistory } from 'react-router';


const mql = window.matchMedia(`(min-width: 800px)`);


const mapStateToProps = state => ({
  ...state.inviteForm,
  authenticated: state.common.authenticated,
  sidebarOpen: state.common.sidebarOpen,

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
    	this.onGoBackClick = ev => {
    	  ev.preventDefault();
    	  browserHistory.goBack()
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
			<div className="koi-view header-push text-left flx flx-col flx-align-start w-100">
				
		            <form className="flx flx-col flx-align-start w-100">
	                    <fieldset className="field-wrapper">
							<div className="co-type-page-title mrgn-bottom-sm">Invite team members</div>
	                      <textarea
	                        className="input--underline edit-itinerary__name brdr-all"
	                        type="text"
	                        rows="4"
	                        maxLength="184"
	                        placeholder="Add email addresses separated by commas..."
	                        required
	                        value={this.props.invites}
	                        onChange={this.changeInvites} />
	                    </fieldset>

	                    <ListErrors errors={this.props.errors}></ListErrors>

	                    <div className="flx flx-row flx-just-end w-100">

		                    <Link onClick={this.onGoBackClick} activeClassName="active" className="vb vb--form-cta mrgn-top-md fill--gray color--black mrgn-right-sm">
		                       Cancel
		                    </Link>
		                    <div
		                    className="vb vb--form-cta mrgn-top-md fill--secondary color--white"
		                    type="button"
		                    disabled={this.props.inProgress}
		                    onClick={this.submitForm}>
		                    	Send Invites
		                  	</div>
	                  </div>

			        </form>

				{/* FORM END */}
			</div>
		)
	}
}

export default connect(mapStateToProps, Actions)(InviteForm);