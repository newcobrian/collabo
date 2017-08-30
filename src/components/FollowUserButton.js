import React from 'react';

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }
  
  let classes = 'vb vb--sm vb--follow mrgn-top-xs ta-center';
  // if (props.user.following) {
  if (props.user.isFollowing) {
    classes += ' vb--following vb--outline color--gray';
  } else {
    classes += ' color--white fill--primary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.user.isFollowing) {
      props.unfollow(props.authenticated, props.user.userId);
    } else {
      props.follow(props.authenticated, props.user.userId);
    }
  };

  return (
    <div
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round DN"></i>
      {props.user.isFollowing ? 'Unfollow' : 'Follow'} {/*props.user.username*/}
    </div>
  );
}

export default FollowUserButton;