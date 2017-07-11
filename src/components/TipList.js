import TipPreview from './TipPreview';
import React from 'react';

const TipList = props => {
  if (!props.reviewList) {
    return (
      <div className="status-module flx flx-row flx-just-center w-100 v2-type-body3">No one has saved this yet</div>
    );
  }

  if (props.reviewList.length === 0) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
          Click 'Edit' to add some tips
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
              key={reviewItem.priority || reviewItem.id} 
              authenticated={props.authenticated}
              like={props.like} 
              unLike={props.unLike}
              userInfo={props.userInfo}
              showModal={props.showModal}
              deleteComment={props.deleteComment}
              itineraryId={props.itineraryId}
            />
          );
        })
      }
    </div>
  );
};

export default TipList;