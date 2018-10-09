import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';
import LoggedOutMessage from './LoggedOutMessage';

const mapStateToProps = state => ({
  ...state.createOrg,
  authenticated: state.common.authenticated
});

class CreateOrg extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.CREATE_ORG_PAGE);

	    this.changeName = updateFieldEvent('name');

	    this.changeInvites = updateFieldEvent('invites');

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.name) {
	        this.props.createSubmitError('Please add a team name', Constants.CREATE_ORG_PAGE);
	      }
	      else if (this.props.name.length < 3) {
	      	this.props.createSubmitError('Team name must be at least 3 characters long', Constants.CREATE_ORG_PAGE);
	      }
		  else if(!(/^[a-zA-Z\s]*$/.test(this.props.name))) {
			this.props.createSubmitError('Your team name can only contain letters', Constants.CREATE_ORG_PAGE);
		  }
	      else {
		   	let org = Object.assign({}, {name: this.props.name} )
		   	// let invites = this.props.invites ? this.props.invites : ''
            
		    this.props.setInProgress();
		    this.props.onCreateOrg(this.props.authenticated, org);
		  }
    	}

    	this.onGoBackClick = ev => {
	      ev.preventDefault();
	      browserHistory.goBack()
	    }
	}

	componentDidMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
	}

	render() {
		if (!this.props.authenticated) {
	      return (
	        <LoggedOutMessage />
	      )
	    }
		return (
			<div className="page-common page-create-org flx flx-col flx-center-all">
	         	<div className="koi-view header-push ta-left flx flx-col">
					<div className="co-post-title mrgn-bottom-md">
	    				Create your new team
	  				</div>
		            <div className="co-type-body color--black mrgn-bottom-md">
					This is your team/company name (ie "Tesla", "Bonniecylde")
					</div>
					
		            <form>


						<fieldset className="field-wrapper">
							<label>Team Name</label>
	                      <input
	                        className="input--underline edit-itinerary__name brdr-all"
	                        type="text"
	                        placeholder="Biz Co"
	                        required
	                        value={this.props.name}
	                        maxLength="42"
	                        onChange={this.changeName} />
	                    </fieldset>

	                    <fieldset className="DN field-wrapper">
							<label>Invite team members</label>
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
	                    
	                    <div className="flx flx-row flx-just-end w-100">
	                    	<Link onClick={()=>browserHistory.goBack()} activeClassName="active" className="vb vb--form-cta mrgn-top-md fill--gray color--black mrgn-right-sm">
	                    	   Cancel
	                    	</Link>
							<div
							className="vb vb--form-cta mrgn-top-md fill--secondary color--white"
							type="button"
							disabled={this.props.inProgress}
							onClick={this.submitForm}>
							    	
								Create List

							</div>
		                 </div>
			        </form>

		       
		    </div>
	    </div>






		)
	}
}

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(Create));

export default connect(mapStateToProps, Actions)(CreateOrg);