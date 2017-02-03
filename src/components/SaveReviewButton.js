import React from 'react';
import { Link } from 'react-router';

const SaveReviewButton = props => {
    let classes = '';
  if (props.isLiked) {
    classes += 'cta-icon cta-saved';
  } else {
    classes += 'cta-icon cta-save';
  }

  let saveText = 'Save';
  if (props.isSaved) {
    saveText = 'Unsave';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.isSaved) {
      props.unSave(props.authenticated, props.review);
    } else {
      props.save(props.authenticated, props.review);
    }
  };
                    
  return (
    <div
      className="cta-wrapper roow roow-col"
      onClick={handleClick}>
        <div className={classes}></div>
        {saveText}
    </div>
  );
};

export default SaveReviewButton;