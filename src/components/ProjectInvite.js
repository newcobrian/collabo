import React  from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProfilePic from './ProfilePic';
import ProjectHeader from './ProjectHeader';
import ProjectList from './ProjectList';
import ProjectInfo from './ProjectInfo';
import Sidebar from 'react-sidebar';

const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
	...state.projectInvite,
	currentUser: state.common.currentUser,
	authenticated: state.common.authenticated,
	invalidOrgUser: state.common.invalidOrgUser,
  	sidebarOpen: state.common.sidebarOpen
});

class ProjectInvite extends React.Component {
	constructor() {
		super()

		this.mediaQueryChanged = () => {
	      this.props.setSidebar(mql.matches);
	    }
	}

	componentDidMount() {
		if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

    	this.props.loadSidebar(mql);
    	mql.addListener(this.mediaQueryChanged);

    	this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_INVITE_PAGE);
	    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.PROJECT_INVITE_PAGE)
	    
	    this.props.loadProject(this.props.params.pid, Constants.PROJECT_INVITE_PAGE);
	    this.props.loadProjectMemberCheck(this.props.params.pid, this.props.params.orgname)
	    // this.props.loadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_INVITE_PAGE)

		this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_INVITE_PAGE);
		// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'friend selector'});
	}

	componentWillUnmount() {
		this.props.unloadOrgUsers(this.props.params.orgname, Constants.PROJECT_INVITE_PAGE);
		// this.props.unloadProjectMembers(this.props.params.pid, this.props.params.orgname, Constants.PROJECT_PAGE)
		this.props.unloadOrgList(this.props.authenticated, Constants.PROJECT_INVITE_PAGE)
	    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
	    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_INVITE_PAGE)
	    this.props.unloadOrg(Constants.PROJECT_INVITE_PAGE);
	}

	toggleCheckbox = label => ev => {
	  this.props.onUpdateFriendsCheckbox(label, this.props.selectedUsers)
	}

	handleFormSubmit = formSubmitEvent => {
	  formSubmitEvent.preventDefault();
	  
	  this.props.inviteOrgUsersToProject(this.props.authenticated, this.props.params.orgname, this.props.params.pid, this.props.selectedUsers)
	  // this.props.onFriendSelectorSubmit(this.props.authenticated, this.props.selectedUsers, this.props.review, this.props.path);
	}

	render() {
		const { usersList, projectMemberCheck } = this.props;

	    return (
	    	<div>
	          <Sidebar
	              sidebar={<ProjectList />}
	              open={this.props.sidebarOpen}
	              onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
	              styles={{ sidebar: {
	                    borderRight: "1px solid rgba(255,171,140,.4)",
	                    boxShadow: "none",
	                    zIndex: "100"
	                  },
	                  overlay: mql.matches ? {
	                    backgroundColor: "rgba(255,255,255)"
	                  } : {
	                    zIndex: 12,
	                    backgroundColor: "rgba(0, 0, 0, 0.5)"
	                  },
	                }}
	              >

	              	<div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>

		                <div className="page-common page-places flx flx-row flx-align-start">
		                  
		                    <ProjectHeader 
		                      orgName={this.props.params.orgname}
		                      projectId={this.props.params.pid}
		                      project={this.props.project}
		                    />
		                    <div className="threadlist-outer flx flx-row">              
		                      	<div className="threadlist-wrapper flx flx-col flx-align-start w-100 h-100">

		    	
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
						    </div>

						    {/*<ProjectInfo 
		                        className="threadlist-wrapper flx flx-col flx-align-start w-100 h-100"
		                        projectMembers={this.props.projectMembers}
		                        project={this.props.project}
		                        projectId={this.props.params.pid}
		                        orgName={this.props.params.orgname} />*/}

						</div>
					</div>
				</Sidebar>
			</div>

		);
	}
}

export default connect(mapStateToProps, Actions)(ProjectInvite);