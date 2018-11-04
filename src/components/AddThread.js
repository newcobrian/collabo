import React from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import ListErrors from './ListErrors';
import OrgHeader from './OrgHeader';
import Sidebar from 'react-sidebar';
import ProjectList from './ProjectList';
import RichTextEditor from './RichTextEditor';
import InvalidOrg from './InvalidOrg'
import LoggedOutMessage from './LoggedOutMessage';
// import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
 
const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
  ...state.addThread,
  authenticated: state.common.authenticated,
  sidebarOpen: state.common.sidebarOpen,
  invalidOrgUser: state.common.invalidOrgUser
});

class AddThread extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ADD_THREAD_PAGE);

	    this.changeTitle = updateFieldEvent('title');
	    
	    this.changeBody = (value) => {
	    	this.props.onUpdateCreateField('body', value, Constants.ADD_THREAD_PAGE)
	    }

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.title) {
	        this.props.createSubmitError('Please add a post title', Constants.ADD_THREAD_PAGE);
	      }
	      else if (!this.props.projectId) {
	        this.props.createSubmitError('Please select a project', Constants.ADD_THREAD_PAGE);
	      }
	      else {
	      	// let delta = new Delta(this.props.body)
	      	// console.log(delta)
	      	// let storableBody = Helpers.convertEditorStateToStorable(this.props.body)
	     //  	let bodyDelta = Helpers.convertEditorStateToStorable(this.props.body)
		   	let thread = Object.assign({}, {title: this.props.title}, { body: this.props.body } )
		    this.props.setInProgress();
		    this.props.onAddThread(this.props.authenticated, this.props.projectId, thread, this.props.params.orgname);
		  }
    	}

    	this.mediaQueryChanged = () => {
	      this.props.setSidebar(mql.matches);
	    }

	    this.onGoBackClick = ev => {
	      ev.preventDefault();
	      browserHistory.goBack()
	    }

	    this.onProjectChange = ev => {
	    	ev.preventDefault();
			this.props.changeAddThreadProject(ev.target.value, this.props.projectObject[ev.target.value])
	    }
	}

	componentDidMount() {
		if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

		this.props.loadSidebar(mql);
    	mql.addListener(this.mediaQueryChanged);

	    let lowerCaseOrgName = this.props.params.orgname ? this.props.params.orgname.toLowerCase() : ''
	    Firebase.database().ref(Constants.ORGS_BY_NAME_PATH + '/' + lowerCaseOrgName).once('value', orgSnap => {
		    if (!orgSnap.exists()) {
		        this.props.notAnOrgUserError(Constants.ADD_THREAD_PAGE)
		    }
		    else {
        		let orgId = orgSnap.val().orgId

		    	this.props.loadOrgMembers(orgId,  Constants.ADD_THREAD_PAGE)
		    	this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgname, Constants.ADD_THREAD_PAGE);
		    	this.props.loadOrgUser(this.props.authenticated, orgId, Constants.ADD_THREAD_PAGE)
		    	this.props.loadAddThreadProject(this.props.params.pid)
			    this.props.loadProjectList(this.props.authenticated, orgId, this.props.params.pid, Constants.ADD_THREAD_PAGE)
			    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
			    this.props.loadOrgList(this.props.authenticated, Constants.ADD_THREAD_PAGE)
			    this.props.loadProjectNames(orgId, Constants.ADD_THREAD_PAGE)
			}
		})

	    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'add thread'});
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
		if (this.props.authenticated && this.props.orgId) {
			this.props.unloadProjectNames(this.props.orgId, Constants.ADD_THREAD_PAGE)
			this.props.unloadOrgList(this.props.authenticated, Constants.ADD_THREAD_PAGE)
		    this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId)
		    this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.ADD_THREAD_PAGE)
		    this.props.unloadOrgMembers(this.props.orgId,  Constants.ADD_THREAD_PAGE)
		    this.props.unloadOrgUser(this.props.authenticated, this.props.orgId, Constants.ADD_THREAD_PAGE)
		    this.props.unloadOrg(Constants.ADD_THREAD_PAGE);
		}
	}

	render() {
		if(this.props.invalidOrgUser) {
	      <InvalidOrg/>
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

						<div className="page-common page-add-thread flx flx-col flx-center-all">
							<div className="project-header brdr-bottom b--primary--20 text-left flx flx-col flx-align-start w-100">
						    	<OrgHeader />
						    </div>


							  <div className="koi-view header-push ta-left flx flx-col">
							  	<div className="co-type-page-title mrgn-bottom-md">Compose a New Thread</div>
							  		<div className="co-type-body color--black mrgn-bottom-md">
							  		Share discussions, ideas, links to files, meeting notes, etc here.
							  		<br/>
							  		We'll keep them organized, updated and easily accessible for you.</div>
									            <form>

													<fieldset className="field-wrapper  mrgn-top-sm">
														<label>Post Title</label>
								                      <input
								                        className="input--underline edit-itinerary__name brdr-all"
								                        type="text"
								                        placeholder="My new post"
								                        required
								                        value={this.props.title}
								                        maxLength="42"
								                        onChange={this.changeTitle} />
								                    </fieldset>
								                    <fieldset className="field-wrapper mrgn-top-sm">
														<label>List</label>
									                      <select className="org-selector pdding-all-sm w-100 color--black brdr-all" onChange={this.onProjectChange}>
												            <option value={this.props.projectId}>{this.props.projectName}</option>
												            {
												            	Object.keys(this.props.projectObject || {}).map(function (projectId) {
													                return (
													                  <option className="color--black" key={projectId} value={projectId}>
													                  	{this.props.projectNames && this.props.projectNames[projectId] ? this.props.projectNames[projectId].name : ''}
													                  </option>  
													                )
												            }, this)}

												          </select>
								                    </fieldset>
													<fieldset className="field-wrapper mrgn-top-sm">
														<div className="flx flx-row flx-align-center"><label>Body</label> <span className="thread-timestamp mrgn-left-xs">(Optional)</span></div>
								                      {/*<textarea
								                        className="input--underline v2-type-body3"
								                        type="text"
								                        rows="20"
								                        placeholder="Start writing here..."
								                        required
								                        value={this.props.body}
								                        onChange={this.changeBody} />*/}

													<RichTextEditor
												        editorState={this.props.body}
												        wrapperClass="demo-wrapper"
												        editorClass="demo-editor"
												        onChange={this.changeBody}
												        usersList={this.props.orgMembers}
													    />

								                    </fieldset>

								                    <ListErrors errors={this.props.errors}></ListErrors>
								                    
								                    <div className="flx flx-row flx-just-end w-100">
								                    	<Link onClick={this.onGoBackClick} activeClassName="active" className="vb vb--form-cta mrgn-top-md fill--gray color--black mrgn-right-sm">
								                    	   Cancel
								                    	</Link>
														<div
														className="vb vb--form-cta mrgn-top-md fill--seaweed color--white"
														type="button"
														disabled={this.props.inProgress}
														onClick={this.submitForm}>

														   Create Post

														</div>
								                     </div>
								                    
										        </form>
										        
								{/* END CONTAINER */}
								
						    </div>
				    	</div>
				    </div>
			    </Sidebar>
			</div>
		)
	}
}

export default connect(mapStateToProps, Actions)(AddThread);