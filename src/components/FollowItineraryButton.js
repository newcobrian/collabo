import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

const mapStateToProps = state => ({
});

class FollowItineraryButton extends React.Component {
  constructor() {
    super()
  }

  render() {
    if (this.props.canModify) {
      return null;
    }
    
    let classes = 'vb vb--sm vb--follow mrgn-top-xs ta-center';
    // if (props.user.following) {
    if (this.props.isFollowingItinerary) {
      classes += ' vb--following vb--outline color--gray';
    } else {
      classes += ' color--white fill--primary';
    }

    const handleClick = ev => {
      ev.preventDefault();
      if (this.props.isFollowingItinerary) {
        this.props.unfollowItinerary(this.props.authenticated, this.props.itinerary.id);
      } else {
        this.props.followItinerary(this.props.authenticated, this.props.itinerary);
      }
    };

    return (
      <button
        className={classes}
        onClick={handleClick}>
        <i className="ion-plus-round DN"></i>
        {this.props.isFollowingItinerary ? 'Unsubscribe' : 'Subscribe to guide'} {/*props.user.username*/}
      </button>
    );
  }
}

export default connect(mapStateToProps, Actions)(FollowItineraryButton)