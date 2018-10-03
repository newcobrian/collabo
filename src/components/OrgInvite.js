import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';
import OrgHeader from './OrgHeader';
import InviteForm from './InviteForm';

const mapStateToProps = state => ({
  authenticated: state.common.authenticated
});

class OrgInvite extends React.Component {
	constructor() {
		super();

		this.submitForm = invites => {
			this.props.inviteUsersToOrg(this.props.authenticated, this.props.params.orgname.toLowerCase(), invites);
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

			    	<div className="project-header text-left flx flx-col flx-align-start w-100">
				    	<OrgHeader />
				    	{/* HEADER START */}
				    </div>

					{/* FORM START */}
		            <div className="content-wrapper header-push ta-left flx flx-col">
			            <InviteForm onInviteSubmit={this.submitForm} />
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