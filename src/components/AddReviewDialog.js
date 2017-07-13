import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

class AddReviewDialog extends React.Component {
	constructor() {
		super();

		this.updateFieldEvent =
	      key => ev => this.props.onUpdateCreateField(key, ev.target.value);
	    this.changeCaption = updateFieldEvent('caption');
	    this.changeTagInput = updateFieldEvent('tagInput');

	    this.onRatingsChange = rating => ev => {
	      ev.preventDefault();
	      this.props.onUpdateCreateField('rating', rating);
	    }
	}
	

	componentWillMount() {
	}

	componentWillUnmount() {
	}

	render() {
		if (props.subject && props.review) {
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
		else return null;
	}
}

export default connect(mapStateToProps, Actions)(AddReviewDialog);