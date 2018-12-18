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
      classes += 'koi-ico --24 ico--like--active mrgn-right-sm opa-100';
    } else {
      // classes += ' btn-outline-secondary';
      classes += 'koi-ico --24 ico--like mrgn-right-sm opa-100';
    }

    let likeText = '';
    if (this.props.likesCount === 1) {
      likeText = ''
    }
    // took out Likes and Like above for now

    const handleLikeClick = ev => {
      ev.preventDefault();
      
      if (this.props.isLiked) {
        this.props.unlikeReview(this.props.authenticated, this.props.type, this.props.objectId, this.props.thread, this.props.userInfo, this.props.likeObject);
      } else {
        let username = this.props.userInfo.username
        this.props.likeReview(this.props.authenticated, this.props.type, this.props.objectId, this.props.thread, this.props.org, this.props.likeObject);
      }
    };

    return (
      <div className="like-review-wrapper flx flx-row flx-just-start flx-align-center">
        <div onClick={handleLikeClick} className={classes}></div>
        <div className="co-type-data ta-left">{this.props.likesCount ? this.props.likesCount : 0} </div>
      </div>

    );
  }
};

export default connect(mapStateToProps, Actions)(LikeReviewButton);
