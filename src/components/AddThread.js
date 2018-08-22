import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import ListErrors from './ListErrors';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import OrgHeader from './OrgHeader';


const mapStateToProps = state => ({
  ...state.addThread,
  authenticated: state.common.authenticated,
  currentUser: state.common.currentUser,
});

class AddThread extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ADD_THREAD_PAGE);

	    this.changeTitle = updateFieldEvent('title');
	    
	    // this.changeBody = updateFieldEvent('body');
	    this.changeBody = value => {
	    	this.props.onUpdateCreateField('body', value, Constants.ADD_THREAD_PAGE)
	    }

	    this.changeConvertedBody = value => {

	    }

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.title) {
	        this.props.createSubmitError('Please add a thread title', Constants.ADD_THREAD_PAGE);
	      }
	      else {
	      	let storableBody = Helpers.convertEditorStateToStorable(this.props.body)
		   	let thread = Object.assign({}, {title: this.props.title}, { body: storableBody } )
		    this.props.setInProgress();
		    this.props.onAddThread(this.props.authenticated, this.props.params.pid, thread, this.props.params.orgname);
		  }
    	}
	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}
    	this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.ADD_THREAD_PAGE)
    	this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.ADD_THREAD_PAGE);
	    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.ADD_THREAD_PAGE)
	    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
	    this.props.loadOrgList(this.props.authenticated, Constants.ADD_THREAD_PAGE)
    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
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

			<div className="page-common flx flx-col flx-center-all">
					

					<div className="project-header text-left flx flx-col flx-align-start w-100">
				    	<OrgHeader />
				    	{/* HEADER START */}
				    	<div className="co-type-h1 mrgn-top-sm mrgn-left-md">Post a New Thread</div>
				    </div>


				  <div className="content-wrapper header-push ta-left flx flx-col">

						            <form>

										<fieldset className="field-wrapper">
											<label>Thread Title</label>
					                      <input
					                        className="input--underline edit-itinerary__name v2-type-body3"
					                        type="text"
					                        placeholder="My new thread"
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
					    	                    	<div className="flx-grow1 mrgn-left-md color--green">Post Thread</div>
					    							<img className="flx-item-right DN" src="/img/icons/icon32_next.png"/>
					    						</div>
					                      </div>
					                    
							        </form>
							        
					{/* END CONTAINER */}
					

			    </div>
			    </div>
			    


		)
	}
}

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(Create));

export default connect(mapStateToProps, Actions)(AddThread);