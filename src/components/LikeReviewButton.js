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
      classes += 'koi-ico koi-ico-like-active mrgn-right-sm';
    } else {
      // classes += ' btn-outline-secondary';
      classes += 'koi-ico koi-ico-like- mrgn-right-sm';
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
        this.props.likeReview(this.props.authenticated, this.props.type, this.props.objectId, this.props.thread, this.props.userInfo, this.props.orgName, this.props.likeObject);
      }
    };

    return (
      <div className="flx flx-row flx-center-all">
        <div onClick={handleLikeClick} className={classes}></div>
        <div className="v2-type-body1 weight-500 ta-left">{this.props.likesCount ? this.props.likesCount : 0} </div>
      </div>

    );
  }
};

export default connect(mapStateToProps, Actions)(LikeReviewButton);
