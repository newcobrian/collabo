import React  from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';

const mapStateToProps = state => ({
	...state.friendSelector,
	currentUser: state.common.currentUser,
	authenticated: state.common.authenticated
});

class FriendSelector extends React.Component {
	componentWillMount() {
		if (!this.props.review) {
			this.props.emptyFriendSelector();
		}
		this.props.getFriends(this.props.authenticated);
		this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'friend selector'});
	}

	componentWillUnmount() {
		this.props.unmountFriendSelector(this.props.selectedFriends);
	}

	toggleCheckbox = label => ev => {
	  this.props.onUpdateFriendsCheckbox(label, this.props.selectedFriends)
	}

	handleFormSubmit = formSubmitEvent => {
	  formSubmitEvent.preventDefault();
	  this.props.onFriendSelectorSubmit(this.props.authenticated, this.props.selectedFriends, this.props.review, this.props.path);
	}

	render() {
		// for (let i = 0; i < this.props.selectedFriends.length; i++) {
		// 	console.log(this.props.selectedFriends.)
		// }

		if (!this.props.friends) {
		    return (
		      <div className="article-preview">Loading...</div>
		    );
		  }
	    return (
	    	<div className="roow roow-col-left page-common send-page">
		    	<div className="page-title-wrapper center-text">
		    	  <div className="v2-type-h2 subtitle">Select friends to send this review:</div>
		    	  <Link className="caption-link-subtle" to={'/'}>No, thanks.</Link>
		    	</div>

			    	<form onSubmit={this.handleFormSubmit}>
				      {
				        this.props.friends.map(friend => {
				          	return (
				          		<div className="roow roow-row mrgn-bottom-sm pdding-all-sm list-row default-card-white bx-shadow" key={friend.id}>
						          	<div>
							        	<input
								            name={friend.id}
								            type="checkbox"
								            onChange={this.toggleCheckbox(friend.id)} />
		            				</div>
						          	<div className="">
							          	<div className="reviewer-photo center-img">
							          		<ProxyImage src={friend.image} className="comment-author-img" />
							        	</div>
								    </div>
								    <div className="roow roow-col-left">
									    <div>
									        {friend.username}
									    </div>
							        </div>
							        
								</div>
		          			)
				      	})
				      }
				      <div className="roow roow-row send-wrapper">
			      		<button className="bttn-style bttn-primary mrgn-right" type="submit">Send & Post</button>
			     	  </div>
				    </form> 
		    </div>
		);
	}
}

export default connect(mapStateToProps, Actions)(FriendSelector);