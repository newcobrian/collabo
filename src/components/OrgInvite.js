import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';
import OrgHeader from './OrgHeader';
import InviteForm from './InviteForm';
import ProjectList from './ProjectList';
import Sidebar from 'react-sidebar';

const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
  authenticated: state.common.authenticated,
  sidebarOpen: state.common.sidebarOpen
});

class OrgInvite extends React.Component {
	constructor() {
		super();

		this.submitForm = invites => {
			this.props.inviteUsersToOrg(this.props.authenticated, this.props.params.orgname.toLowerCase(), invites);
    	}

    	this.mediaQueryChanged = () => {
	      this.props.setSidebar(mql.matches);
	    }
	}

	componentDidMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

    	this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE);
	    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
	    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
	    this.props.loadProjectNames(this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
	    this.props.loadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)

    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		this.props.unloadProjectNames(this.props.orgId, Constants.ORG_SETTINGS_PAGE)
	    this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
	    this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId)
	    this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.ORG_SETTINGS_PAGE)
	    this.props.unloadOrg(Constants.ORG_SETTINGS_PAGE);

		this.props.onCreateUnload();
	}

	render() {
		return (
			<div>
		        <Sidebar
		            sidebar={<ProjectList />}
		            open={this.props.sidebarOpen}
		            onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
		            styles={{ sidebar: {
		                  borderRight: "1px solid rgba(0,0,0,.1)",
		                  boxShadow: "none", 
		                  zIndex: "100"
		                },
		                overlay: mql.matches ? {
		                  backgroundColor: "rgba(255,255,255,1)"
		                } : {
		                  zIndex: 12,
		                  backgroundColor: "rgba(0, 0, 0, 0.5)"
		                },
		              }}
		            >

	              	<div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>
	                	<div className="page-common page-profile flx flx-col flx-align-center profile-page">
	                
			                <div className="project-header text-left flx flx-col flx-align-start w-100">
			                    <OrgHeader />
			                </div>

	                  		<div className="koi-view threadlist header-push ta-left flx flx-col w-100">

								{/* FORM START */}
					            <div className="content-wrapper header-push ta-left flx flx-col">
						            <InviteForm onInviteSubmit={this.submitForm} />
							    </div>
								{/* FORM END */}
					
							</div>
						</div>
					</div>
				</Sidebar>
							
			</div>	
			    


		)
	}
}

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(Create));

export default connect(mapStateToProps, Actions)(OrgInvite);