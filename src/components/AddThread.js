import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import ListErrors from './ListErrors';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import OrgHeader from './OrgHeader';
import Sidebar from 'react-sidebar';
import ProjectList from './ProjectList';

const mql = window.matchMedia(`(min-width: 800px)`);

const mapStateToProps = state => ({
  ...state.addThread,
  authenticated: state.common.authenticated,
  currentUser: state.common.currentUser,
  sidebarOpen: state.common.sidebarOpen
});

class AddThread extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ADD_THREAD_PAGE);

	    this.changeTitle = updateFieldEvent('title');
	    
	    this.changeBody = value => {
	    	this.props.onUpdateCreateField('body', value, Constants.ADD_THREAD_PAGE)
	    }

	    this.changeConvertedBody = value => {

	    }

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.title) {
	        this.props.createSubmitError('Please add a post title', Constants.ADD_THREAD_PAGE);
	      }
	      else {
	      	let storableBody = Helpers.convertEditorStateToStorable(this.props.body)
		   	let thread = Object.assign({}, {title: this.props.title}, { body: storableBody } )
		    this.props.setInProgress();
		    this.props.onAddThread(this.props.authenticated, this.props.params.pid, thread, this.props.params.orgname);
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

    	this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.ADD_THREAD_PAGE)
    	this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.ADD_THREAD_PAGE);
	    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.ADD_THREAD_PAGE)
	    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
	    this.props.loadOrgList(this.props.authenticated, Constants.ADD_THREAD_PAGE)
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
		this.props.unloadOrgList(this.props.authenticated, Constants.ADD_THREAD_PAGE)
	    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
	    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.ADD_THREAD_PAGE)
	    this.props.unloadOrg(Constants.ADD_THREAD_PAGE);
	}

	render() {
		if(this.props.invalidOrgUser) {
	      return (
	        <div>
	          You don't have permission to view this team. <Link to='/'>Go Home</Link>
	        </div>
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

						<div className="page-common page-add-thread flx flx-col flx-center-all">
								

								<div className="project-header text-left flx flx-col flx-align-start w-100">
							    	<OrgHeader />
							    	{/* HEADER START */}
							    	<div className="co-type-h1 mrgn-top-sm mrgn-left-md">Post a New Thread</div>
							    </div>


							  <div className="content-wrapper header-push ta-left flx flx-col">
							  		<div className="co-type-body opa-40 color--black mrgn-bottom-md">
							  		Share discussions, ideas, links to files, meeting notes, etc here.
							  		<br/>
							  		We'll keep them organized, updated and easily accessible for you.</div>
									            <form>

													<fieldset className="field-wrapper">
														<label>Post Title</label>
								                      <input
								                        className="input--underline edit-itinerary__name v2-type-body3"
								                        type="text"
								                        placeholder="My new post"
								                        required
								                        value={this.props.title}
								                        maxLength="42"
								                        onChange={this.changeTitle} />
								                    </fieldset>
													<fieldset className="field-wrapper">
														<label>Body (Optional)</label>
								                      {/*<textarea
								                        className="input--underline v2-type-body3"
								                        type="text"
								                        rows="20"
								                        placeholder="Start writing here..."
								                        required
								                        value={this.props.body}
								                        onChange={this.changeBody} />*/}
								                        <Editor
													        editorState={this.props.body}
													        wrapperClassName="demo-wrapper"
													        editorClassName="demo-editor"
													        onEditorStateChange={this.changeBody}
													        mention={{
												              separator: ' ',
												              trigger: '@',
												              suggestions: this.props.usersList,
												            }}
													    />

								                    </fieldset>

								                    <ListErrors errors={this.props.errors}></ListErrors>
								                    
								                     <div
								                        className="vb vb--create w-100 color--white fill--light-green"
								                        type="button"
								                        disabled={this.props.inProgress}
								                        onClick={this.submitForm}>
								                        	<div className="flx flx-row flx-center-all ta-center">
								    	                    	<div className="flx-grow1 mrgn-left-md color--green">Create Post</div>
								    							<img className="flx-item-right DN" src="/img/icons/icon32_next.png"/>
								    						</div>
								                      </div>
								                    
										        </form>
										        
								{/* END CONTAINER */}
								<Link onClick={this.onGoBackClick} activeClassName="active" className="nav-module create nav-editor mrgn-top-md flx flx-center-all opa-50 w-100">
			                      	<div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
			                          <i className="material-icons color--black md-18 opa-100 mrgn-right-xs DN">arrow_back_ios</i>
			                          <div className="co-type-body mrgn-left-xs">Cancel</div>
			                        </div>
		                    	</Link>
						    </div>
				    	</div>
				    </div>
			    </Sidebar>
			</div>
		)
	}
}

export default connect(mapStateToProps, Actions)(AddThread);