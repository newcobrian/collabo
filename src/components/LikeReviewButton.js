import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

const mapStateToProps = state => ({
  userInfo: state.common.userInfo
});

class LikeReviewButton extends React.Component {
  constructor() {
    super();
  }

  render() {
    // let classes = 'btn btn-sm action-btn';
    let classes = '';
    if (this.props.isLiked) {
      // classes += ' btn-secondary';
      classes += 'material-icons mrgn-right-sm md-24 color--favorite';
    } else {
      // classes += ' btn-outline-secondary';
      classes += 'material-icons mrgn-right-sm md-24 opa-20';
    }

    let likeText = '';
    if (this.props.likesCount === 1) {
      likeText = ''
    }
    // took out Likes and Like above for now

    const handleLikeClick = ev => {
      ev.preventDefault();
      if (this.props.isLiked) {
        this.props.unlikeReview(this.props.authenticated, this.props.type, this.props.objectId, this.props.likeObject, this.props.userInfo);
      } else {
        let username = this.props.userInfo.username
        this.props.likeReview(this.props.authenticated, this.props.type, this.props.objectId, this.props.likeObject, this.props.userInfo);
      }
    };
 
    return (
      <div className="cta-container flx flx-row flx-center-all">
        <i onClick={handleLikeClick} className={classes}>Upvote</i>
        <div className="v2-type-body1 weight-500 ta-left">{this.props.likesCount ? this.props.likesCount : 0} </div>
      </div>

    );
  }
};

export default connect(mapStateToProps, Actions)(LikeReviewButton);
