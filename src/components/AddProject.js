import React from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import ListErrors from './ListErrors';
import { CREATE_PAGE } from '../actions';
import OrgHeader from './OrgHeader';
import ProfileInfo from './ProfileInfo'
import Sidebar from 'react-sidebar';
import ProjectList from './ProjectList';
import InvalidOrg from './InvalidOrg'
import LoggedOutMessage from './LoggedOutMessage';
// import Checkbox from 'material-ui/Checkbox';
// import getMuiTheme from 'material-ui/styles/getMuiTheme';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
 
const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
  ...state.addProject,
  authenticated: state.common.authenticated,
  sidebarOpen: state.common.sidebarOpen,
  invalidOrgUser: state.common.invalidOrgUser
});

class AddProject extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ADD_PROJECT_PAGE);

	    this.changeName = updateFieldEvent('name');
	    
	    this.changeDescription = updateFieldEvent('description');

	    this.togglePublic = key => ev => {
	    	this.props.onUpdateCreateField('isPublic', key, Constants.ADD_PROJECT_PAGE)
	    }

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.name) {
	        this.props.createSubmitError('Please name your list', Constants.ADD_PROJECT_PAGE);
	      }
	      else if (!(/^[A-Za-z0-9- ]+$/.test(this.props.name)))  {
	      	this.props.createSubmitError('Project names can only contain letters, numbers, spaces, and \'-\'', Constants.ADD_PROJECT_PAGE);
	      }
	      else {
		   	let project = {
		   		name: this.props.name,
		   		isPublic: this.props.isPublic ? true : false
		   	};

		    this.props.setInProgress();
		    this.props.onAddProject(this.props.authenticated, project, this.props.params.orgurl);
		  }
    	}

    	this.mediaQueryChanged = () => {
	      this.props.setSidebar(mql.matches);
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

		this.props.loadSidebar(mql);
    	mql.addListener(this.mediaQueryChanged);

	    let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
	    Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
		     if (!orgSnap.exists()) {
		        this.props.notAnOrgUserError(Constants.ADD_PROJECT_PAGE)
		     }
		     else {
		        let orgId = orgSnap.val().orgId
		    	this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgurl, orgSnap.val().name, Constants.ADD_PROJECT_PAGE);
		    	this.props.loadOrgUser(this.props.authenticated, orgId, Constants.ADD_PROJECT_PAGE)
		    	this.props.loadProjectList(this.props.authenticated, orgId, this.props.params.pid, Constants.ADD_PROJECT_PAGE)
			    this.props.loadThreadCounts(this.props.authenticated, orgId)
			    this.props.loadOrgList(this.props.authenticated, Constants.ADD_PROJECT_PAGE)
			    this.props.loadProjectNames(orgId, Constants.ADD_PROJECT_PAGE)
			}
		})

    	this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'add project'});
	}

	componentWillUnmount() {
		if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);

		if (this.props.authenticated && this.props.org && this.props.org.id) {
			this.props.unloadProjectNames(this.props.org.id, Constants.ADD_PROJECT_PAGE)
			this.props.unloadOrgList(this.props.authenticated, Constants.ADD_PROJECT_PAGE)
		    this.props.unloadThreadCounts(this.props.authenticated, this.props.org.id)
		    this.props.unloadProjectList(this.props.authenticated, this.props.org.id, Constants.ADD_PROJECT_PAGE)
		    this.props.unloadOrgUser(this.props.authenticated, this.props.org.id, Constants.ADD_PROJECT_PAGE)
		    this.props.unloadOrg(Constants.ADD_PROJECT_PAGE);
		}
		this.props.onCreateUnload();
	}

	render() {
		if (!this.props.authenticated) {
	      return (
	        <LoggedOutMessage />
	      )
	    }
	    if (this.props.invalidOrgUser) {
	      return (
	        <InvalidOrg/>
	        )
	    }

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

						<div className="page-common page-create-list flx flx-col flx-center-all">
							{/**}			
							<div>
						        <Script
						          url={url}
						          onCreate={this.handleScriptCreate.bind(this)}
						          onError={this.handleScriptError.bind(this)}
						          onLoad={this.handleScriptLoad.bind(this)}
						        /> 
						    </div> 
						    <div ref="GMap"></div>**/}
							<div className="project-header brdr-bottom b--primary--20 text-left flx flx-col flx-align-start w-100">
						    	<OrgHeader />
						    	{/*<div className="project-bar-wrapper w-100 flx flx-row flx-align-center mrgn-top-xs fill--white">
							    	<div className="co-type-page-title mrgn-left-md co-type-h1 flx flx-row flx-align-center color--black">Create a New List</div>
						    	</div>*/}

						    	<Link onClick={this.onGoBackClick} activeClassName="active" className="DN nav-module create nav-editor flx flx-center-all">
			                      <div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
			                          <i className="material-icons color--black md-18 opa-100 mrgn-right-xs">arrow_back_ios</i>
			                          <div className="co-type-body mrgn-left-xs">Cancel</div>
			                        </div>
			                    </Link>
						    </div>

						    {/* CONTAINER - START */}
					        <div className="koi-view header-push ta-left flx flx-col">
					        	<div className="illustration flx-hold flx flx-col flx-center-all">
					        	  <img className="center-img" src="/img/illu_createlist.png"/>
					        	</div>
					        	
			        			<div className="koi-type-page-title mrgn-bottom-md">
			        				Create a New Group
			        			</div>
						       	<div className="koi-type-body color--black mrgn-bottom-md opa-80">
						       	Use groups	 to organize your team communications and files (ie. "Design", "Marketing", etc)
						       	<br/>
						       	Access lists quickly in the left sidebar.</div>


					            <form>

									<fieldset className="field-wrapper">
										<label>List name</label>
				                      <input
				                        className="input--underline edit-itinerary__name brdr-all"
				                        type="text"
				                        placeholder="e.g. Marketing"
				                        required
				                        value={this.props.name}
				                        maxLength="42"
				                        onChange={this.changeName} />
				                    </fieldset>
									<fieldset className="field-wrapper DN">
									<div className="field-label">List Description</div>
				                      <textarea
				                        className="input--underline edit-itinerary__name brdr-all"
				                        type="text"
				                        rows="3"
				                        maxLength="184"
				                        placeholder="Add a description..."
				                        required
				                        value={this.props.description}
				                        onChange={this.changeDescription} />
				                    </fieldset>
				                    <fieldset className="field-wrapper mrgn-top-md">
					            		<label>
				                      <input
				                      	className="mrgn-left-xs DN"
				                        type="checkbox"
				                        checked={this.props.isPublic}
				                        onChange={this.togglePublic} />
				                        </label>

				                        <label className="koi-radio">
				                        	<div className="co-type-body co-type-bold">Public</div>
				                         	<div className="thread-timestamp">Anyone can join and view</div>
				                          	<input type="radio" value={true} checked={this.props.isPublic} onChange={this.togglePublic(true)}/>
				                          	<span className="checkmark"></span>
				                        </label>

				                        <label className="koi-radio">
				                        	<div className="co-type-body co-type-bold">Private</div>
				                         	<div className="thread-timestamp">Members must be invited</div>
				                          	<input type="radio" value={false} checked={!this.props.isPublic} onChange={this.togglePublic(false)}/>
				                          	<span className="checkmark"></span>
				                        </label>
				                    </fieldset>
				                    
				                    <ListErrors errors={this.props.errors}></ListErrors>
				                    
				                    <div className="flx flx-row flx-just-end w-100">
				                    	<Link onClick={this.onGoBackClick} activeClassName="active" className="vb vb--form-cta mrgn-top-md fill--mist color--black mrgn-right-sm">
				                    	   Cancel
				                    	</Link>
										<div
										className="vb vb--form-cta mrgn-top-md fill--seaweed color--white"
										type="button"
										disabled={this.props.inProgress}
										onClick={this.submitForm}>
										    	
											Create Group

										</div>
					                 </div>


						        </form>
						        

	    				        
						    </div>


							{/* END CONTAINER */}

					    </div>
					</div>
			    </Sidebar>
			</div>
		)
	}
}

export default connect(mapStateToProps, Actions)(AddProject);