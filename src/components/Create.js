import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import FirebaseSearchInput from './FirebaseSearchInput'
import ProxyImage from './ProxyImage';
import ListErrors from './ListErrors';
import * as Constants from '../constants';

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
				<div className="roow roow-row-top">
					<div className="subject-image create-subject-image">{renderImage(props.image)}</div>
				</div>
			</div>
		)
	}
	else return null;
}

const EditorLink = props => {
	if (props.subject) return null;
	else {
		return (
			<Link to='Editor' className="create-new-link flex-item-right">Can't find something? Create it here...</Link>
		)
	}
}

const mapStateToProps = state => ({
  ...state.create,
  authenticated: state.common.authenticated
});

class Create extends React.Component {
	constructor() {
		super();

	    const updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value);
	    this.changeCaption = updateFieldEvent('caption');
	    this.changeTagInput = updateFieldEvent('tagInput');
	    // from editor
	    this.changeTitle = updateFieldEvent('title');
	    this.changeDescription = updateFieldEvent('description');
	    this.changeURL = updateFieldEvent('url');

	    this.onRatingsChange = rating => ev => {
	      ev.preventDefault();
	      this.props.onUpdateCreateField('rating', rating);
	    }

		this.searchInputCallback = result => {
			this.props.loadCreateSubject(this.props.authenticated, result);
		}

		this.submitForm = ev => {
	      ev.preventDefault();

	      if (!this.props.subjectId && !this.props.title) {
	        this.props.createSubmitError('product name');
	      }
	      else if (this.props.rating !== 0 && !this.props.rating) {
	        this.props.createSubmitError('rating');
	      }
	      else {
		    const ratingObject = {
		      rating: this.props.rating,
		    }
		    if (this.props.caption) ratingObject.caption = this.props.caption;

		    let reviewId = this.props.review ? this.props.review.reviewId : null;

		   	let subject = {};
		   	if (this.props.subject) {
		   		subject = this.props.subject;
		    }
		    else {
		    	// if this is a new subject the user is entering in the form
		    	subject.title = this.props.title;
		    	if (this.props.url) subject.url = this.props.url;
		   		if (this.props.tagInput) {
		          subject.tags = {};
		          subject.tags[this.props.tagInput] = true;
		        }
		   	}
		    this.props.setInProgress();
		    this.props.onCreateSubmit(this.props.subjectId, subject, ratingObject, reviewId, this.props.image, this.props.imageFile);
		  }
    	}

    	this.onCancelClick = ev => {
    		ev.preventDefault();

    		this.props.loadCreateSubject(this.props.authenticated, null);
    	}

    	this.getUserLocation= () => {
    		if (navigator.geolocation) {
		      let watchId = navigator.geolocation.watchPosition(this.props.showPosition);
		      this.props.setWatchPositionId(watchId);
		    }
    	}

    	// more from Editor
    	this.changeFile = ev => {
	      this.props.onUpdateCreateField('imageFile', ev.target.files[0]);
	    }

	    this.changeTag = ev => {
	      ev.preventDefault();
	      this.props.onUpdateCreateField('tagInput', ev.target.value);
	    }

	}

	componentWillMount() {
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}
    	else {
	    	this.props.onCreateLoad(this.props.authenticated);
	    	this.getUserLocation();
    	}
    	this.props.sendMixpanelEvent('Create page loaded');
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
		if (this.props.watchId) navigator.geolocation.clearWatch(this.props.watchId);
	}

	renderRating(subject, review) {
		if (subject && review) {
			return (
				<div className="popup-overlay roow roow-center-all">
					<div className="create-popup">
						<SubjectInfo subject={this.props.subject} image={this.props.image} />
						<div className="">
					      	<fieldset className="form-group no-margin">
						        <div className={'rating-container rating-wrapper-' + this.props.rating}>
	                                <div className="roow roow-row-right">
	                                  <button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	                                  <button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	                                  <button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	        							<button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	        							<button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="v2-type-h3">&nbsp; :Rate it</div>
	                                </div>
	                            </div>
						      </fieldset>

						      <fieldset className="form-group">
						        <textarea
						          className="form-control caption"
						          rows="3"
						          placeholder={review.caption}
						          value={this.props.caption}
						          onChange={this.changeCaption}>
						        </textarea>
						      </fieldset>
						  </div>
					    <div className="roow roow-row-right">
							  <a href="#/create">
							  <button className="bttn-style bttn-sm bttn-subtle-gray"
							  	disabled={this.props.inProgress}
							  	onClick={this.onCancelClick}>
						        Cancel
						       </button>
						       </a>
						      <button
						        className="bttn-style bttn-sm bttn-submit box-shadow"
						        type="button"
						        disabled={this.props.inProgress}
						        onClick={this.submitForm}>
						        Submit New Review
				      		</button>
				      	</div>
				     </div>
      			</div>
			)
		}
		else if (subject) {
			return (
				<div className="popup-overlay roow roow-center-all">
					<div className="create-popup">
						<SubjectInfo subject={this.props.subject} image={this.props.image} />
						<div className="">
					      	<fieldset className="form-group no-margin">
						        <div className={'rating-container rating-wrapper-' + this.props.rating}>
	                                <div className="roow roow-row-right">
	                                  <button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	                                  <button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	                                  <button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	        							<button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="rating-divider"></div> 
	        							<button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}><img src="../img/profile_temp.png"/></button>
	                                  <div className="v2-type-h3">&nbsp; :Rate it</div>
	                                </div>
	                            </div>
						      </fieldset>

						      <fieldset className="form-group">
						        <textarea
						          className="form-control caption"
						          rows="3"
						          placeholder="Add a comment"
						          value={this.props.caption}
						          onChange={this.changeCaption}>
						        </textarea>
						      </fieldset>
						  </div>
						  <div className="roow roow-row-right">
							  <a href="#/create">
							  	<button className="bttn-style bttn-sm bttn-subtle-gray"
							  	disabled={this.props.inProgress}
							  	onClick={this.onCancelClick}>
						        Cancel
						       </button>
						       </a>
						      <button
						        className="bttn-style bttn-sm bttn-submit box-shadow"
						        type="button"
						        disabled={this.props.inProgress}
						        onClick={this.submitForm}>
						        Submit Review
				      		</button>
				      	</div>
		      		</div>
		    	</div>
		    )
		}
		else return (
			<div className="form-wrapper roow roow-col-left v2-form">
              <form>
                <fieldset>
                  <div className="roow roow-row-top">

                    <fieldset className="form-group">

                    <div className="upload-wrapper">
	                    <div className="upload-overlay dis-no">Upload Image</div>
	                    <div className="fileUpload">
	                    	<input
	                      className="form-control upload-image-button"
	                      type="file"
	                      accept="image/*" 
	                      onChange={this.changeFile} />

	                      </div>
	                 </div> 
	                 
                  </fieldset>

                  </div>
                  <fieldset className="form-group no-margin">
                    <div className="pdding-all-md">
                      <select className='react-textselect-input' onChange={this.changeTag} value={this.props.tagInput}>
                        <option selected disabled>Choose a category</option>
                        {Constants.TAG_LIST.map(item => {
                          return (
                                <option value={item} key={item}>{item}</option>
                            );
                        })}
                      </select>
                     {/***} <SelectTag options={Constants.TAG_LIST} handler={this.changeTag} value={this.props.tag} />  ***/}
                    </div>
                  </fieldset>
                  <fieldset className="form-group no-margin">
                    <div className={'rating-container rating-wrapper-' + this.props.rating}>
                        <div className="roow roow-row-right">
                          <button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}><img src="../img/profile_temp.png"/></button>
                          <div className="rating-divider"></div> 
                          <button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}><img src="../img/profile_temp.png"/></button>
                          <div className="rating-divider"></div> 
                          <button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}><img src="../img/profile_temp.png"/></button>
                          <div className="rating-divider"></div> 
							<button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}><img src="../img/profile_temp.png"/></button>
                          <div className="rating-divider"></div> 
							<button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}><img src="../img/profile_temp.png"/></button>
                          <div className="v2-type-h3">&nbsp; :Rate it</div>
                        </div>
                    </div>
                  </fieldset>

                  <div className="">
                  <fieldset className="form-group">
                    <textarea
                      className="form-control caption"
                      rows="3"
                      placeholder="Compose a quick comment..."
                      value={this.props.caption}
                      onChange={this.changeCaption}>
                    </textarea>
                   </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control subtle-input"
                      type="text"
                      placeholder="website link (optional)"
                      value={this.props.url}
                      onChange={this.changeURL} />
                  </fieldset>
                  </div>



                  <button
                    className="bttn-style bttn-submit"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}>
                    Submit Review
                  </button>

                </fieldset>
              </form>

            </div>
		);
	}

	render() {
		return (
			<div className="roow roow-col roow-center-all page-common editor-page create-page">
				<div className="page-title-wrapper center-text">
				  <div className="v2-type-h2 subtitle">Review something real quick</div>
				</div>
				<div className="bx-shadow default-card-white roow roow-col roow-center-all create-wrapper mrgn-top-sm">
					<ListErrors errors={this.props.errors}></ListErrors>
		            <div className="form-wrapper roow roow-col-left">
			            <form>
							<fieldset className="form-group no-margin main-search-field">
				                <FirebaseSearchInput value={this.props.title} className="form-control main-search-inner" callback={this.searchInputCallback}
				                latitude={this.props.latitude} longitude={this.props.longitude} />
				            </fieldset>
				        </form>
				    </div>

					{this.renderRating(this.props.subject, this.props.review)}
				</div>
		    </div>
	    )
	}
}

export default connect(mapStateToProps, Actions)(Create);