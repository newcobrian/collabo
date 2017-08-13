import React from 'react';

const LikeReviewButton = props => {
  // let classes = 'btn btn-sm action-btn';
  let classes = '';
  if (props.isLiked) {
    // classes += ' btn-secondary';
    classes += 'favorite';
  } else {
    // classes += ' btn-outline-secondary';
    classes += 'favorite_border';
  }

  let likeText = '';
  if (props.likesCount === 1) {
    likeText = ''
  }
  // took out Likes and Like above for now

  const handleClick = ev => {
    ev.preventDefault();
    if (props.isLiked) {
      props.unLike(props.authenticated, props.type, props.likeObject);
    } else {
      props.like(props.authenticated, props.type, props.likeObject, props.itineraryId);
    }
  };

  return (
    <div className="cta-container flx flx-row flx-center-all">
      <div onClick={handleClick} className={'mrgn-right-sm material-icons color--' + classes}>{classes}</div>
      <div className="v2-type-body1 weight-500 ta-left">{props.likesCount ? props.likesCount : 0} {likeText}</div>
    </div>

  );
};

export default LikeReviewButton;