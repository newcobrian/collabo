import React from 'react';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ListErrors from './ListErrors';

const mapStateToProps = state => ({
  ...state.createOrg,
  authenticated: state.common.authenticated
});

class CreateOrg extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.CREATE_ORG_PAGE);

	    this.changeName = updateFieldEvent('name');

	    this.changeInvites = updateFieldEvent('invites');

		this.submitForm = ev => {
	      ev.preventDefault();
	      if (!this.props.name) {
	        this.props.createSubmitError('Please add a team name', Constants.CREATE_ORG_PAGE);
	      }
	      else if (this.props.name.length < 3) {
	      	this.props.createSubmitError('Team name must be at least 3 characters long', Constants.CREATE_ORG_PAGE);
	      }
		  else if(!(/^\w+$/i.test(this.props.name))) {
			this.props.createSubmitError('Your team name can only contain letters', Constants.CREATE_ORG_PAGE);
		  }
	      else {
		   	let org = Object.assign({}, {name: this.props.name} )
		   	// let invites = this.props.invites ? this.props.invites : ''
            
		    this.props.setInProgress();
		    this.props.onCreateOrg(this.props.authenticated, org);
		  }
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

    	// this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'create guide'});
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
	}

	render() {
		return (

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
						
					            <div className="create-form-wrapper form-wrapper ta-left flx flx-col-left">
						            
						            <form>
						            	<div className="co-type-h1 mrgn-left-sm mrgn-bottom-sm">Create your new team</div>

										<fieldset className="field-wrapper">
											<label>Team Name</label>
					                      <input
					                        className="input--underline edit-itinerary__name v2-type-body3"
					                        type="text"
					                        placeholder="Biz Co"
					                        required
					                        value={this.props.name}
					                        maxLength="42"
					                        onChange={this.changeName} />
					                    </fieldset>

					                    <fieldset className="DN field-wrapper">
											<label>Invite team members</label>
					                      <textarea
					                        className="input--underline v2-type-body3"
					                        type="text"
					                        rows="4"
					                        maxLength="184"
					                        placeholder="Add email addresses separated by commas..."
					                        required
					                        value={this.props.invites}
					                        onChange={this.changeInvites} />
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

							        <Link onClick={this.onGoBackClick} activeClassName="active" className="nav-module create nav-editor flx flx-center-all">
				                      	<div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
				                          <i className="material-icons color--black md-18 opa-100 mrgn-right-xs">arrow_back_ios</i>
				                          <div className="co-type-body mrgn-left-xs">Cancel</div>
				                        </div>
			                    	</Link>
							    </div>
						    </div>


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

export default connect(mapStateToProps, Actions)(CreateOrg);