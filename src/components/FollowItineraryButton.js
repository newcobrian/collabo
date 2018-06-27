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
    
    let classes = 'vb vb--xs vb--follow ta-center';
    // if (props.user.following) {
    if (this.props.isFollowingItinerary) {
      classes += ' vb--following vb--outline color--gray';
    } else {
      classes += ' vb--outline fill--white color--black';
    }

    const handleClick = ev => {
      ev.preventDefault();
      if (!this.props.hideSubscribeTip) {
        this.props.closeSubscribeTooltip(this.props.authenticated)
      }
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
        <i className="material-icons flx-item-left color--primary DN">add</i>
        <div className="flx-item-left">{this.props.isFollowingItinerary ? 'Subscribed' : 'Subscribe'} {/*props.user.username*/}</div>
      </button>
    );
  }
}

export default connect(mapStateToProps, Actions)(FollowItineraryButton)