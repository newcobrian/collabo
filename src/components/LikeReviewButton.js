import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

const mapStateToProps = state => ({
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
      classes += 'cta-icon cta-liked';
    } else {
      // classes += ' btn-outline-secondary';
      classes += 'cta-icon cta-like opa-60';
    }

    let likeText = '';
    if (this.props.likesCount === 1) {
      likeText = ''
    }
    // took out Likes and Like above for now

    const handleLikeClick = ev => {
      ev.preventDefault();
      if (this.props.isLiked) {
        this.props.unLikeReview(this.props.authenticated, this.props.type, this.props.likeObject, this.props.itineraryId);
      } else {
        this.props.likeReview(this.props.authenticated, this.props.type, this.props.likeObject, this.props.itineraryId);
      }
    };
 
    return (
      <div className="cta-container flx flx-row flx-center-all">
        <div onClick={handleLikeClick} className={classes}></div>
        <div className="v2-type-body1 weight-500 ta-left">{this.props.likesCount ? this.props.likesCount : 0} </div>
        <div className="like-text v2-type-body1 weight-500 mrgn-left-xs">Likes</div>
      </div>

    );
  }
};

export default connect(mapStateToProps, Actions)(LikeReviewButton);
