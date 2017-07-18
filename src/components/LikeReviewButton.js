import React from 'react';

const LikeReviewButton = props => {
  // let classes = 'btn btn-sm action-btn';
  let classes = '';
  if (props.isLiked) {
    // classes += ' btn-secondary';
    classes += 'cta-icon cta-liked';
  } else {
    // classes += ' btn-outline-secondary';
    classes += 'cta-icon cta-like';
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
    <div className="cta-container flx flx-row flx-just-end flx-align-center">
      <div onClick={handleClick} className={classes}></div>
      <div className="v2-type-body1 ta-left">{props.likesCount ? props.likesCount : 0} {likeText}</div>
    </div>

  );
};

export default LikeReviewButton;