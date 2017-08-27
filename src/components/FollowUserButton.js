import React from 'react';

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }
  
  let classes = 'vb vb--sm vb--follow mrgn-top-xs';
  // if (props.user.following) {
  if (props.user.isFollowing) {
    classes += ' vb--following vb--outline--gray color--gray';
  } else {
    classes += ' vb--outline--none color--white fill--primary';
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
    <button
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round DN"></i>
      {props.user.isFollowing ? 'Unfollow' : 'Follow'} {/*props.user.username*/}
    </button>
  );
}

export default FollowUserButton;