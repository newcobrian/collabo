import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';

const mapStateToProps = state => ({
	...state.followers
});

class Follow extends React.Component {
	componentWillMount() {
		Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + this.props.params.username + '/').once('value', snapshot => {
	      if (snapshot.exists()) {
	        let userId = snapshot.val().userId;
	        this.props.getFollowers(userId);
	      }
	    });
	}

	componentWillUnmount() {
	}

	render() {
		if (!this.props.followers) {
		    return (
		      <div className="article-preview">Loading...</div>
		    );
		  }

	    return (
	    	<div>
		      {
		        this.props.followers.map(follower => {
		          	return (
		          		<div>
				          	<div>
				          		<Link
						          to={`@${follower.username}`}
						          className="comment-author">
						          <img src={follower.image} className="comment-author-img" />
						        </Link>
						    </div>
						    <div>
							   	<Link
						          to={`@${follower.username}`}
						          className="comment-author">
						          {follower.username}
						        </Link>
						    </div>
						</div>
          			)
		      	})
		      }
		    </div>
		);
	}
}

export default connect(mapStateToProps, Actions)(Follow);
