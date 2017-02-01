import React from 'react';
import { Link } from 'react-router';

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

  let likeText = ' Likes';
  if (props.likesCount === 1) {
    likeText = ' Like'
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.isLiked) {
      props.unLike(props.authenticated, props.review);
    } else {
      props.like(props.authenticated, props.review);
    }
  };

  return (
    <div
      className="cta-wrapper roow roow-col"
      onClick={handleClick}>
      <div className={classes}>
      </div>
      {props.likesCount} {likeText}
    </div>
  );
};

export default LikeReviewButton;