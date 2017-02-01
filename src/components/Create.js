import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import FirebaseSearchInput from './FirebaseSearchInput'

const SubjectInfo = props => {
	const renderImage = image => {
		if (image) {
			return (
				<div className="subject-image">
					<img src={image}/>
              	</div>
			)
		}
		else return null;
	}
	if (props.subject) {
		return (
			<div>
				<div>Subject name: {props.subject.title}</div>
				<div>Subject description: {props.subject.description}</div>
				<div>Subject URL: {props.subject.url}</div>
				{renderImage(props.subject.image)}
			</div>
		)
	}
	else return null;
}

const EditorLink = props => {
	if (props.subject) return null;
	else {
		return (
			<Link to='Editor'>If you can't find a product, create it here...</Link>
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

	      const review = {
	        rating: this.props.rating,
	        caption: this.props.caption
	      }

	      this.props.onReviewSubmit(this.props.subjectId, this.props.subject, review);
    	};
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
    	this.props.onCreateLoad(this.props.authenticated);
	}

	componentWillUnmount() {
		this.props.onCreateUnload();
	}

	renderRating(subject, review) {
		if (subject && review) {
			return (
				<div>
					<div className={'rating-container roow roow-row-center rating-wrapper-' + review.rating}>
				        <div className="rating-graphic rating--2"></div>
				        <div className="rating-graphic rating--1"></div>
				        <div className="rating-graphic rating-0"></div>
				        <div className="rating-graphic rating-1"></div>
				        <div className="rating-graphic rating-2"></div>
			        </div>
			        <div> Your comment: {review.caption} </div>
      			</div>
			)
		}
		else if (subject) {
			return (
				<div>
			      	<fieldset className="form-group no-margin">
				        <div className={'rating-container rating-wrapper-' + this.props.rating}>
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


				      <button
				        className="bttn-style bttn-submit"
				        type="button"
				        disabled={this.props.inProgress}
				        onClick={this.submitForm}>
				        Submit Review
			      </button>
			    </div>
		    )
		}
		else return null;
	}

	render() {
		return (
			<div className="roow roow-col roow-center-all page-common editor-page">
	            <div className="page-title-wrapper roow roow-col center-text">
	              <div className="text-page-title">What's Good?</div>
	              <div className="text-page-subtitle">Recommend something cool to your friends. Or warn the world against something bad! Pass on the knowledge.</div>
	            </div>

	            <div className="form-wrapper roow roow-col-left">
		            <form>
						<fieldset className="form-group no-margin">
			                <FirebaseSearchInput className="form-control" callback={this.searchInputCallback} />
			            </fieldset>
			        </form>
			    </div>

			    <EditorLink subject={this.props.subject} />

			    <SubjectInfo subject={this.props.subject} />

			    {this.renderRating(this.props.subject, this.props.review)}

		    </div>
	    )
	}
}

export default connect(mapStateToProps, Actions)(Create);