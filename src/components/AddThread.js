import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';

const mapStateToProps = state => ({
  ...state.addThread,
  authenticated: state.common.authenticated
});

class AddThread extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ADD_THREAD_PAGE);

	    this.changeTitle = updateFieldEvent('title');
	    
	    this.changeBody = updateFieldEvent('body');

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.title) {
	        this.props.createSubmitError('Please add a thread title', Constants.ADD_THREAD_PAGE);
	      }
	      else {
		   	let thread = Object.assign({}, {title: this.props.title} )
		   	if (this.props.body) thread.body = this.props.body

		    this.props.setInProgress();
		    this.props.onAddThread(this.props.authenticated, this.props.params.pid, thread);
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
			         	<div className="create-content flx flx-col flx-center-all ta-center">
							
							<div className="flx flx-col flx-center-all create-wrapper">
						
					            <div className="create-form-wrapper form-wrapper ta-left flx flx-col-left bx-shadow">
						            
						            <form>
						            	<div className="v2-type-page-header mrgn-bottom-sm">Start a new thread</div>

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
					                      <textarea
					                        className="input--underline v2-type-body3"
					                        type="text"
					                        rows="20"
					                        placeholder="Start writing here..."
					                        required
					                        value={this.props.body}
					                        onChange={this.changeBody} />
					                    </fieldset>

					                    <ListErrors errors={this.props.errors}></ListErrors>
					                    
					                    <div
					                    className="vb vb--create w-100 mrgn-top-md color--white fill--primary"
					                    type="button"
					                    disabled={this.props.inProgress}
					                    onClick={this.submitForm}>
					                    	<div className="flx flx-row flx-center-all ta-center">
						                    	<div className="flx-grow1 mrgn-left-md">Save</div>
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

export default connect(mapStateToProps, Actions)(AddThread);