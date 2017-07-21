import TipPreview from './TipPreview';
import React from 'react';

const TipList = props => {
  if (!props.tipList) {
    return (
      <div className="status-module flx flx-row flx-just-center w-100 v2-type-body3">This guide is empty</div>
    );
  }

  if (props.tipList.length === 0) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
          Click 'Edit' to add some tips
      </div>
    );
  }

  return (
    <div className="">
      {
        props.tipList.map((tipItem, index) => {
          return (
            <TipPreview review={tipItem}
              key={tipItem.priority || tipItem.id} 
              authenticated={props.authenticated}
              like={props.like} 
              unLike={props.unLike}
              userInfo={props.userInfo}
              showModal={props.showModal}
              deleteComment={props.deleteComment}
              itineraryId={props.itineraryId}
              itinerary={props.itinerary}
              index={index+1}
            />
          );
        })
      }
    </div>
  );
};

export default TipList;