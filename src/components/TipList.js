import TipPreview from './TipPreview';
import React from 'react';

const TipList = props => {
  if (!props.reviewList) {
    return (
      <div className="article-preview roow roow-center-all">Loading...</div>
    );
  }

  if (props.reviewList.length === 0) {
    return (
      <div className="article-preview roow roow-center-all">
        Empty itinerary.
      </div>
    );
  }

  return (
    <div className="">
      {
        props.reviewList.map(reviewItem => {
          // console.log('review item comments = ' + JSON.stringify(reviewItem))
          return (
            <TipPreview review={reviewItem}
              key={reviewItem.priority} 
              authenticated={props.authenticated}
              like={props.like} 
              unLike={props.unLike}
              userInfo={props.userInfo}
              showModal={props.showModal}
              deleteComment={props.deleteComment}
            />
          );
        })
      }
    </div>
  );
};

export default TipList;