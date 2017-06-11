import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import ProxyImage from './ProxyImage';
import ListErrors from './ListErrors';
import * as Constants from '../constants';
import { CREATE_PAGE } from '../actions';
import Geosuggest from 'react-geosuggest';

const SubjectInfo = props => {
	const renderImage = image => {
		if (image) {
			return (
				<ProxyImage src={image}/>
			)
		}
		else return null;
	}
	if (props.subject) {
		return (
			<div>
				<div className="flx flx-row-top">
					<div className="subject-image create-subject-image">{renderImage(props.image)}</div>
				</div>
			</div>
		)
	}
	else return null;
}

const mapStateToProps = state => ({
  ...state.create,
  authenticated: state.common.authenticated
});

class Create extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value, CREATE_PAGE);

	    this.changeTitle = updateFieldEvent('title');
	    this.suggestSelect = result => {
	    	let geoData = {
	    		label: result.label,
	    		placeId: result.placeId,
	    		location: result.location
	    	}
	    	this.props.onUpdateCreateField('geo', geoData, CREATE_PAGE);
	    }
	    this.changeGeo = value => {
	    	this.props.onUpdateCreateField('geo', value, CREATE_PAGE)	;
	    }
	    this.changeDescription = updateFieldEvent('description');

		this.submitForm = ev => {
	      ev.preventDefault();

	      if (!this.props.title) {
	        this.props.createSubmitError('itinerary name', CREATE_PAGE);
	      }
	      else if (!this.props.geo || !this.props.geo.placeId) {
	        this.props.createSubmitError('location', CREATE_PAGE);
	      }
	      else {
		   	let itinerary = {};
	    	itinerary.title = this.props.title;
	    	itinerary.geo = this.props.geo;
	    	if (this.props.description) itinerary.description = this.props.description;

		    this.props.setInProgress();
		    this.props.onCreateItinerary(this.props.authenticated, itinerary);
		  }
    	}

    	this.getUserLocation= () => {
    		if (navigator.geolocation) {
		      let watchId = navigator.geolocation.watchPosition(this.props.showPosition);
		      this.props.setWatchPositionId(watchId);
		    }
    	}
	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}
    	else {
	    	// this.props.onCreateLoad(this.props.authenticated);
	    	this.getUserLocation();
    	}
    	this.props.sendMixpanelEvent('Create itinerary page loaded');
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
		if (this.props.watchId) navigator.geolocation.clearWatch(this.props.watchId);
	}

	// renderRating(subject, review) {
	// 	if (subject && review) {
	// 		return (
	// 			<div className="popup-overlay flx flx-center-all">
	// 				<div className="create-popup">
	// 					<SubjectInfo subject={this.props.subject} image={this.props.image} />
	// 					<div className="">
	// 				      	<fieldset className="form-group no-margin">
	// 					        <div className={'rating-container rating-wrapper-' + this.props.rating}>
	//                                 <div className="flx flx-row-right">
	//                                   <button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//                                   <button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//                                   <button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//         							<button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//         							<button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="v2-type-h3">&nbsp; :Rate it</div>
	//                                 </div>
	//                             </div>
	// 					      </fieldset>

	// 					      <fieldset className="form-group">
	// 					        <textarea
	// 					          className="form-control caption"
	// 					          rows="3"
	// 					          placeholder={review.caption}
	// 					          value={this.props.caption}
	// 					          onChange={this.changeCaption}>
	// 					        </textarea>
	// 					      </fieldset>
	// 					  </div>
	// 				    <div className="flx flx-row-right">
	// 						  <a href="#/create">
	// 						  <button className="bttn-style bttn-sm bttn-subtle-gray"
	// 						  	disabled={this.props.inProgress}
	// 						  	onClick={this.onCancelClick}>
	// 					        Cancel
	// 					       </button>
	// 					       </a>
	// 					      <button
	// 					        className="bttn-style bttn-sm bttn-submit box-shadow"
	// 					        type="button"
	// 					        disabled={this.props.inProgress}
	// 					        onClick={this.submitForm}>
	// 					        Submit New Review
	// 			      		</button>
	// 			      	</div>
	// 			     </div>
 //      			</div>
	// 		)
	// 	}
	// 	else if (subject) {
	// 		return (
	// 			<div className="popup-overlay flx flx-center-all">
	// 				<div className="create-popup">
	// 					<SubjectInfo subject={this.props.subject} image={this.props.image} />
	// 					<div className="">
	// 				      	<fieldset className="form-group no-margin">
	// 					        <div className={'rating-container rating-wrapper-' + this.props.rating}>
	//                                 <div className="flx flx-row-right">
	//                                   <button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//                                   <button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//                                   <button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//         							<button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="rating-divider"></div> 
	//         							<button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}><ProxyImage src={this.props.userImage}/></button>
	//                                   <div className="v2-type-h3">&nbsp; :Rate it</div>
	//                                 </div>
	//                             </div>
	// 					      </fieldset>

	// 					      <fieldset className="form-group">
	// 					        <textarea
	// 					          className="form-control caption"
	// 					          rows="3"
	// 					          placeholder="Add a comment"
	// 					          value={this.props.caption}
	// 					          onChange={this.changeCaption}>
	// 					        </textarea>
	// 					      </fieldset>
	// 					  </div>
	// 					  <div className="flx flx-row-right">
	// 						  <a href="#/create">
	// 						  	<button className="bttn-style bttn-sm bttn-subtle-gray"
	// 						  	disabled={this.props.inProgress}
	// 						  	onClick={this.onCancelClick}>
	// 					        Cancel
	// 					       </button>
	// 					       </a>
	// 					      <button
	// 					        className="bttn-style bttn-sm bttn-submit box-shadow"
	// 					        type="button"
	// 					        disabled={this.props.inProgress}
	// 					        onClick={this.submitForm}>
	// 					        Submit Review
	// 			      		</button>
	// 			      	</div>
	// 	      		</div>
	// 	    	</div>
	// 	    )
	// 	}
	// 	else return (
	// 		<div className="form-wrapper flx flx-col-left v2-form">
 //              <form>
 //                <fieldset>
 //                  <div className="flx flx-row-top">

 //                    <fieldset className="form-group">

 //                    <div className="upload-wrapper">
	//                     <div className="upload-overlay dis-no">Upload Image</div>
	//                     <div className="fileUpload">
	//                     	<input
	//                       className="form-control upload-image-button"
	//                       type="file"
	//                       accept="image/*" 
	//                       onChange={this.changeFile} />

	//                       </div>
	//                  </div> 
	                 
 //                  </fieldset>

 //                  </div>
 //                  <fieldset className="form-group no-margin">
 //                    <div className="pdding-all-md">
 //                      <select className='react-textselect-input' onChange={this.changeTag} value={this.props.tagInput}>
 //                        <option selected disabled>Choose a category</option>
 //                        {Constants.TAG_LIST.map(item => {
 //                          return (
 //                                <option value={item} key={item}>{item}</option>
 //                            );
 //                        })}
 //                      </select>
 //                     {/***} <SelectTag options={Constants.TAG_LIST} handler={this.changeTag} value={this.props.tag} />  **}
 //                    </div>
 //                  </fieldset>
 //                  <fieldset className="form-group no-margin">
 //                    <div className={'rating-container rating-wrapper-' + this.props.rating}>
 //                        <div className="flx flx-row-right">
 //                          <button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}><ProxyImage src={this.props.userImage}/></button>
 //                          <div className="rating-divider"></div> 
 //                          <button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}><ProxyImage src={this.props.userImage}/></button>
 //                          <div className="rating-divider"></div> 
 //                          <button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}><ProxyImage src={this.props.userImage}/></button>
 //                          <div className="rating-divider"></div> 
	// 						<button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}><ProxyImage src={this.props.userImage}/></button>
 //                          <div className="rating-divider"></div> 
	// 						<button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}><ProxyImage src={this.props.userImage}/></button>
 //                          <div className="v2-type-h3">&nbsp; :Rate it</div>
 //                        </div>
 //                    </div>
 //                  </fieldset>

 //                  <div className="">
 //                  <fieldset className="form-group">
 //                    <textarea
 //                      className="form-control caption"
 //                      rows="3"
 //                      placeholder="Compose a quick comment..."
 //                      value={this.props.caption}
 //                      onChange={this.changeCaption}>
 //                    </textarea>
 //                   </fieldset>
 //                  <fieldset className="form-group">
 //                    <input
 //                      className="form-control subtle-input"
 //                      type="text"
 //                      placeholder="website link (optional)"
 //                      value={this.props.url}
 //                      onChange={this.changeURL} />
 //                  </fieldset>
 //                  </div>



 //                  <button
 //                    className="bttn-style bttn-submit"
 //                    type="button"
 //                    disabled={this.props.inProgress}
 //                    onClick={this.submitForm}>
 //                    Submit Review
 //                  </button>

 //                </fieldset>
 //              </form>

 //            </div>
	// 	);
	// }

	render() {
		return (
			<div className="flx flx-col flx-center-all page-common editor-page create-page">
				<div className="page-title-wrapper center-text">
				  <div className="v2-type-page-header">Create New Itinerary</div>
				  <div className="v2-type-body2 opa-60 mrgn-top-sm DN"></div>
				</div>
				<div className="flx flx-col flx-center-all create-wrapper mrgn-top-sm">
					<ListErrors errors={this.props.errors}></ListErrors>
		            <div className="form-wrapper flx flx-col-left">
			            <form>
							<fieldset className="field-wrapper">
								<label>Itinerary Name</label>
		                      <input
		                        className="input--underline edit-itinerary__name"
		                        type="text"
		                        placeholder="My Dope Vacation 2018"
		                        required
		                        value={this.props.title}
		                        onChange={this.changeTitle} />
		                    </fieldset>
		                    <fieldset className="field-wrapper">
		                    	<label>Location</label>
		                    	<Geosuggest 
		                    	  className="input--underline"
								  /*types={['(regions)']}*/
								  placeholder="Pick a city or country"
								  required
								  onChange={this.changeGeo}
								  onSuggestSelect={this.suggestSelect}/>
		                    </fieldset>
							<fieldset className="field-wrapper">
								<label>Short Description</label>
		                      <textarea
		                        className="input--underline"
		                        type="text"
		                        rows="6"
		                        placeholder="What's the story behind this itinerary?"
		                        required
		                        value={this.props.description}
		                        onChange={this.changeDescription} />
		                    </fieldset>

		                    <div
		                    className="vb w-100 vb--create mrgn-top-md"
		                    type="button"
		                    disabled={this.props.inProgress}
		                    onClick={this.submitForm}>
		                    Next
		                  </div>
				        </form>
				    </div>
				</div>
		    </div>
	    )
	}
}

export default connect(mapStateToProps, Actions)(Create);