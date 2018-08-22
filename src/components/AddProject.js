import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import ListErrors from './ListErrors';
import { CREATE_PAGE } from '../actions';
import OrgHeader from './OrgHeader';
// import Geosuggest from 'react-geosuggest';
import ProfileInfo from './ProfileInfo'
// import Script from 'react-load-script';
// import {GoogleApiWrapper} from 'google-maps-react';
// import Map from 'google-maps-react';

// const SubjectInfo = props => {
// 	const renderImage = image => {
// 		if (image) {
// 			return (
// 				<ProxyImage src={image}/>
// 			)
// 		}
// 		else return null;
// 	}
// 	if (props.subject) {
// 		return (
// 			<div>
// 			<div className="flx flx-row-top">
// 				<div className="subject-image create-subject-image">{renderImage(props.image)}</div>
// 			</div>
// 			</div>
// 		)
// 	}
// 	else return null;
// }

const mapStateToProps = state => ({
  ...state.addProject,
  authenticated: state.common.authenticated
});

class AddProject extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ADD_PROJECT_PAGE);

	    this.changeName = updateFieldEvent('name');
	    
	    this.changeDescription = updateFieldEvent('description');

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.name) {
	        this.props.createSubmitError('Please add a project name', Constants.ADD_PROJECT_PAGE);
	      }
	      else {
		   	let project = {};
	    	project.name = this.props.name;

		    this.props.setInProgress();
		    this.props.onAddProject(this.props.authenticated, project, this.props.params.orgname);
		  }
    	}
	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

    	this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, this.props.params.pid, Constants.ADD_PROJECT_PAGE)
	    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
	    this.props.loadOrgList(this.props.authenticated, Constants.ADD_PROJECT_PAGE)
    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
		this.props.onCreateUnload();
		this.props.unloadOrgList(this.props.authenticated, Constants.ADD_PROJECT_PAGE)
	    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname)
	    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.ADD_PROJECT_PAGE)
	    this.props.unloadOrg(Constants.ADD_PROJECT_PAGE);
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
					<div className="project-header text-left flx flx-col flx-align-start w-100">
				    	<OrgHeader />
				    	{/* HEADER START */}
				    	<div className="co-type-h1 mrgn-top-sm mrgn-left-md">Add a New Group</div>
				    </div>

				    {/* CONTAINER - START */}
			        <div className="content-wrapper flx flx-col ta-center">
	        		
						
			            <div className="content-wrapper header-push ta-left flx flx-col">
				            
				            <form>
								<fieldset className="field-wrapper">
									<label>Group name</label>
			                      <input
			                        className="input--underline edit-itinerary__name v2-type-body3"
			                        type="text"
			                        placeholder="My New Group"
			                        required
			                        value={this.props.name}
			                        maxLength="42"
			                        onChange={this.changeName} />
			                    </fieldset>
								<fieldset className="field-wrapper DN">
								<div className="field-label">Group Name</div>
			                      <textarea
			                        className="input--underline v2-type-body3"
			                        type="text"
			                        rows="3"
			                        maxLength="184"
			                        placeholder="Add a description..."
			                        required
			                        value={this.props.description}
			                        onChange={this.changeDescription} />
			                    </fieldset>

			                    <ListErrors errors={this.props.errors}></ListErrors>
			                    
			                    <div
			                    className="vb vb--create w-100 mrgn-top-md color--white fill--light-green"
			                    type="button"
			                    disabled={this.props.inProgress}
			                    onClick={this.submitForm}>
			                    	<div className="flx flx-row flx-center-all ta-center">
				                    	<div className="flx-grow1 mrgn-left-md color--green">Add Group</div>
									</div>
			                  </div>
					        </form>
					    </div>
				    </div>

					{/* END CONTAINER */}
					

			    </div>
			    




		)
	}
}

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(Create));

export default connect(mapStateToProps, Actions)(AddProject);