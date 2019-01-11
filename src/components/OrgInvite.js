import React from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
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
  org: state.projectList.org,
  sidebarOpen: state.common.sidebarOpen
});

class OrgInvite extends React.Component {
	constructor() {
		super();

		this.submitForm = invites => {
			this.props.inviteUsersToOrg(this.props.authenticated, this.props.org, invites);
    	}

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

	    let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
	    Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
	    	if (!orgSnap.exists()) {
	        	this.props.notAnOrgUserError(Constants.ORG_SETTINGS_PAGE)
	    	}
	    	else {
	        	let orgId = orgSnap.val().orgId
	        	let orgName = orgSnap.val().name
		    	this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgurl, orgName, Constants.ORG_SETTINGS_PAGE);
		    	this.props.loadOrgUser(this.props.authenticated, orgId, Constants.ORG_SETTINGS_PAGE)
			    this.props.loadProjectList(this.props.authenticated, orgId, Constants.ORG_SETTINGS_PAGE)
			    this.props.loadThreadCounts(this.props.authenticated, orgId)
			    this.props.loadProjectNames(orgId, Constants.ORG_SETTINGS_PAGE)
			    this.props.loadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)

			    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'org invite page', 'orgId': orgId });
			}
		})
	}

	componentWillUnmount() {
		if (this.props.org && this.props.org.id) {
			this.props.unloadProjectNames(this.props.org.id, Constants.ORG_SETTINGS_PAGE)
		    this.props.unloadThreadCounts(this.props.authenticated, this.props.org.id)
		    this.props.unloadProjectList(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE)
		}
		this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
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

	                  		<div className="koi-view header-push threadlist ta-left flx flx-col w-100 fill--white">
								{/* FORM START */}
					            <div className="content-wrapper ta-left flx flx-col">
					            	<div className="illustration flx-hold flx flx-col flx-center-all">
					            	  <img className="center-img" src="/img/illu_orginvite.png"/>
					            	</div>
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