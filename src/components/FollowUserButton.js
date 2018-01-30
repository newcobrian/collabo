import React from 'react';

const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }
  
  let classes = 'vb vb--xs vb--follow ta-center';
  // if (props.user.following) {
  if (props.user.isFollowing) {
    classes += ' vb--following vb--outline color--gray';
  } else {
    classes += ' color--black vb--outline fill--white';
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
      <i className="material-icons mrgn-right-sm color--primary flx-item-left">add</i>
      <div className="flx-item-left">{props.user.isFollowing ? 'Unsubscribe' : 'Subscribe'} {/*props.user.username*/}</div>
    </button>
  );
}

export default FollowUserButton;