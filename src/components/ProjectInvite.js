import React  from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic';

const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
	...state.projectInvite,
	currentUser: state.common.currentUser,
	authenticated: state.common.authenticated,
	invalidOrgUser: state.common.invalidOrgUser
});

class ProjectInvite extends React.Component {
	constructor() {
		super()
	}

	componentDidMount() {
		if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

	    this.props.loadProject(this.props.params.pid, Constants.PROJECT_INVITE_PAGE);
	    this.props.loadProjectMemberCheck(this.props.params.pid, this.props.params.orgname)
	    // this.props.loadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_INVITE_PAGE)

		this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_INVITE_PAGE);
		// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'friend selector'});
	}

	componentWillUnmount() {
		this.props.unloadOrgUsers(this.props.params.orgname, Constants.PROJECT_INVITE_PAGE);
		// this.props.unloadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_PAGE)
	}

	toggleCheckbox = label => ev => {
	  this.props.onUpdateFriendsCheckbox(label, this.props.selectedUsers)
	}

	handleFormSubmit = formSubmitEvent => {
	  formSubmitEvent.preventDefault();
	  
	  this.props.inviteOrgUsersToProject(this.props.authenticated, this.props.orgId, this.props.params.orgname, this.props.params.pid, this.props.selectedUsers)
	  // this.props.onFriendSelectorSubmit(this.props.authenticated, this.props.selectedUsers, this.props.review, this.props.path);
	}

	render() {
		console.log('org = ' + JSON.stringify(this.props.org))
		console.log(JSON.stringify(this.props.project))
		const { usersList, projectMemberCheck } = this.props;

	    return (
	    	<div>
	          

		    	
	    	  <div className="v2-type-h2 subtitle">Select users to invite</div>
	    	  <Link className="caption-link-subtle" onClick={() => browserHistory.goBack()}>No, thanks.</Link>

		    	<form onSubmit={this.handleFormSubmit}>
			      {
			        (usersList || []).map(teammate => {
			        	// if user isn't a team member, let user select them
			        	//this.props.projectMembers[teammate.userId]
			        	if (!projectMemberCheck[teammate.userId]) {
				          	return (
				          		<div className="roow roow-row mrgn-bottom-sm pdding-all-sm list-row default-card-white bx-shadow" key={teammate.userId}>
						          	<div>
							        	<input
								            name={teammate.userId}
								            type="checkbox"
								            onChange={this.toggleCheckbox(teammate.userId)} />
		            				</div>
						          	<div className="">
							          	<div className="reviewer-photo center-img">
							          		<ProfilePic src={teammate.image} />
							        	</div>
								    </div>
								    <div className="roow roow-col-left">
									    <div>
									        {teammate.username}
									    </div>
							        </div>
							        
								</div>
		          			)
				        }
				        // otherwise just show username
				        else {
				        	return (
				        		<div className="roow roow-row mrgn-bottom-sm pdding-all-sm list-row default-card-white bx-shadow" key={teammate.userId}>
						          	<div className="">
							          	<div className="reviewer-photo center-img">
							          		<ProfilePic src={teammate.image} />
							        	</div>
								    </div>
								    <div className="roow roow-col-left">
									    <div>
									        {teammate.username} - joined
									    </div>
							        </div>
							        
								</div>
				        	)
				        }
			      	})
			      }
			      <div className="roow roow-row send-wrapper">
		      		<button className="bttn-style bttn-primary mrgn-right" type="submit">Invite</button>
		     	  </div>
			    </form> 
	    	</div>
		);
	}
}

export default connect(mapStateToProps, Actions)(ProjectInvite);