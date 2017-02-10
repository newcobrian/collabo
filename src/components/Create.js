import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import FirebaseSearchInput from './FirebaseSearchInput'

const SubjectInfo = props => {
	const renderImage = image => {
		if (image) {
			return (
				<img src={image}/>
			)
		}
		else return null;
	}
	if (props.subject) {
		return (
			<div>
				<div className="text-subject-name">{props.subject.title}</div>
				<div className="roow roow-row-top">
					<div className="subject-image create-subject-image">{renderImage(props.subject.image)}</div>
					<div className="text-page-subtitle">{props.subject.description}</div>
					<div className="text-page-subtitle DN">{props.subject.url}</div>
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

	    this.onRatingsChange = rating => ev => {
	      ev.preventDefault();
	      this.props.onUpdateCreateField('rating', rating);
	    }

		this.searchInputCallback = result => {
			this.props.loadCreateSubject(this.props.authenticated, result);
		}

		this.submitForm = ev => {
	      ev.preventDefault();

	      const ratingObject = {
	        rating: this.props.rating,
	        caption: this.props.caption
	      }

	      let reviewId = this.props.review ? this.props.review.reviewId : null;
	      this.props.onReviewSubmit(this.props.subjectId, this.props.subject, ratingObject, reviewId);
    	}

    	this.onCancelClick = ev => {
    		ev.preventDefault();

    		this.props.loadCreateSubject(this.props.authenticated, null);
    	}

    	this.getUserLocation= () => {
    		if (navigator.geolocation) {
		      navigator.geolocation.watchPosition(this.props.showPosition);
		    }
    	}
	}

	// componentWillReceiveProps(nextProps) {
	//     if (this.props.id !== nextProps.id) {
	//       if (nextProps.id) {
	//         this.props.onCreateUnload();
	//         return this.props.onCreateLoad();
	//       }
	//       this.props.onEditorLoad();
	//     }
	// }

	componentWillMount() {
    	// if (this.props.id) {
     //  		return this.props.onCreateLoad(this.props.authenticated);
    	// }
    	if (!this.props.authenticated) {
    		this.props.askForAuth();
    	}
    	else {
	    	this.props.onCreateLoad(this.props.authenticated);
	    	this.getUserLocation();
    	}
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
	}

	renderRating(subject, review) {
		if (subject && review) {
			return (
				<div className="popup-overlay roow roow-center-all">
					<div className="create-popup">
						<SubjectInfo subject={this.props.subject} />
						<div className="box-shadow">
					      	<fieldset className="form-group no-margin">
						        <div className={'rating-container box-shadow rating-wrapper-' + this.props.rating}>
						            <div className="roow roow-row-space-around">
						              <div className="square-wrapper"><button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}></button></div>
						            </div>
						            <div className="roow roow-row-space-around">
						              <div className="rating-description">WTF</div>
						              <div className="rating-description">Weak</div>
						              <div className="rating-description">Meh</div>
						              <div className="rating-description">Coo</div>
						              <div className="rating-description">Lit as Fuck</div>
						            </div>
						        </div>
						      </fieldset>

						      <fieldset className="form-group gray-border">
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
						<SubjectInfo subject={this.props.subject} />
						<div className="box-shadow">
					      	<fieldset className="form-group no-margin">
						        <div className={'rating-container box-shadow rating-wrapper-' + this.props.rating}>
						            <div className="roow roow-row-space-around">
						              <div className="square-wrapper"><button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}></button></div>
						              <div className="square-wrapper"><button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}></button></div>
						            </div>
						            <div className="roow roow-row-space-around">
						              <div className="rating-description">WTF</div>
						              <div className="rating-description">Weak</div>
						              <div className="rating-description">Meh</div>
						              <div className="rating-description">Coo</div>
						              <div className="rating-description">Lit as Fuck</div>
						            </div>
						        </div>
						      </fieldset>

						      <fieldset className="form-group gray-border">
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
		else return null;
	}

	render() {
		return (
			<div className="roow roow-col roow-center-all page-common editor-page create-page">
	            <div className="page-title-wrapper roow roow-row center-text">
	              <div className="text-page-title">Search</div>
	              <a className="text-page-title unselected" href="#/editor">Create New</a>
	            </div>

	            <div className="form-wrapper roow roow-col-left">
		            <form>
						<fieldset className="form-group no-margin main-search-field gray-border">
			                <FirebaseSearchInput className="form-control main-search-inner" callback={this.searchInputCallback}
			                latitude={this.props.latitude} longitude={this.props.longitude} />
			            </fieldset>
			        </form>
			    </div>

				{this.renderRating(this.props.subject, this.props.review)}

		    </div>
	    )
	}
}

export default connect(mapStateToProps, Actions)(Create);