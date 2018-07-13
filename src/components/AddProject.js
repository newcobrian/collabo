import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import ListErrors from './ListErrors';
import { CREATE_PAGE } from '../actions';
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
	        this.props.createSubmitError('project name', Constants.ADD_PROJECT_PAGE);
	      }
	      else {
		   	let project = {};
	    	project.name = this.props.name;

		    this.props.setInProgress();
		    this.props.onCreateProject(this.props.authenticated, project);
		  }
    	}
	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}

    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
	}

	render() {
		return (
			<div>
				<div className="flx flx-col flx-center-all page-common editor-page create-page">
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
					

				    {/* CONTAINER - START */}
			        <div className="hero-container">
	        			<div className="page-title-wrapper center-text DN">
	        	          <div className="v2-type-page-header">Create a new Project</div>
	        	          <div className="v2-type-body2 opa-60">This could be a list of top spots or plans for an upcoming trip</div>
	        	        </div>
			         	<div className="create-content flx flx-col flx-center-all ta-center">
							
							<div className="flx flx-col flx-center-all create-wrapper">
						
					            <div className="create-form-wrapper form-wrapper ta-left flx flx-col-left bx-shadow">
						            
						            <form>
						            	<div className="v2-type-page-header mrgn-bottom-sm">Add a New Project</div>

										<fieldset className="field-wrapper">
											<label>Name Your Project</label>
					                      <input
					                        className="input--underline edit-itinerary__name v2-type-body3"
					                        type="text"
					                        placeholder="My New Project"
					                        required
					                        value={this.props.name}
					                        maxLength="42"
					                        onChange={this.changeName} />
					                    </fieldset>
										<fieldset className="field-wrapper DN">
											<label>About (Optional)</label>
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
					                    className="vb vb--create w-100 mrgn-top-md color--white fill--primary"
					                    type="button"
					                    disabled={this.props.inProgress}
					                    onClick={this.submitForm}>
					                    	<div className="flx flx-row flx-center-all ta-center">
						                    	<div className="flx-grow1 mrgn-left-md">Create</div>
												<img className="flx-item-right" src="/img/icons/icon32_next.png"/>
											</div>
					                  </div>
							        </form>
							    </div>
						    </div>

						    <div className="v2-type-body2 mrgn-top-lg ta-center DN">
						    	<div>“Travel and change of place impart new vigor to the mind.”</div>
						    	<div>– Seneca</div>
						    </div>	

					  	</div>
					  	<div className="hero-bg">
						    <div className="hero-map opa-20">
						    </div>
						    <div className="hero-grid opa-10">
						    </div>
						</div>

						

					</div>	
					{/* END CONTAINER */}
					

			    </div>
			    

			</div>


		)
	}
}

// export default GoogleApiWrapper({
//   apiKey: Constants.GOOGLE_API_KEY
// }) (connect(mapStateToProps, Actions)(Create));

export default connect(mapStateToProps, Actions)(AddProject);