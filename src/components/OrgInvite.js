import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';
import OrgHeader from './OrgHeader';


const mapStateToProps = state => ({
  ...state.orgInvite,
  authenticated: state.common.authenticated
});

class OrgInvite extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ORG_INVITE_PAGE);

	    this.changeInvites = updateFieldEvent('invites');

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.invites) {
	        this.props.createSubmitError('Please add some email addresses to invite', Constants.ORG_INVITE_PAGE);
	      }
	      else {
		   	let invites = this.props.invites ? this.props.invites.toLowerCase() : ''

		    this.props.setInProgress();
		    this.props.inviteUsersToOrg(this.props.authenticated, this.props.org.orgId, this.props.params.orgname.toLowerCase(), invites);
		  }
    	}
	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}
    	this.props.loadOrgInvitePage(this.props.authenticated, this.props.params.orgname.toLowerCase())

    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		this.props.unloadOrgInvitePage(this.props.params.orgname.toLowerCase());
		this.props.onCreateUnload();
	}

	render() {
		return (

				<div className="page-common flx flx-col flx-center-all">

			    	<div className="project-header text-left flx flx-col flx-align-start w-100">
				    	<OrgHeader />
				    	{/* HEADER START */}
				    	<div className="co-type-h1 mrgn-top-sm mrgn-left-md">Add a New Group</div>
				    </div>

					{/* FORM START */}
		            <div className="content-wrapper header-push ta-left flx flx-col">
			            <form>
							<fieldset className="DN field-wrapper">
								<label>Organization Name</label>
		                      <input
		                        className="input--underline edit-itinerary__name v2-type-body3"
		                        type="text"
		                        placeholder="Biz Co"
		                        required
		                        value={this.props.name}
		                        maxLength="42"
		                        onChange={this.changeName} />
		                    </fieldset>

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

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(Create));

export default connect(mapStateToProps, Actions)(OrgInvite);