import React from 'react';
import { Link } from 'react-router';

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }
  let classes = 'btn btn-sm action-btn';
  // if (props.user.following) {
  if (props.user.isFollowing) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.user.isFollowing) {
      props.unfollow(props.user.userId);
    } else {
      props.follow(props.user.userId);
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {props.user.isFollowing ? 'Unfollow' : 'Follow'} {props.user.username}
    </button>
  );
}

export default FollowUserButton;