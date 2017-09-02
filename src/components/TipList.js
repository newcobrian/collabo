import TipPreview from './TipPreview';
import React from 'react';


const mapStateToProps = state => ({
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const TipList = props => {
  if (!props.tipList) {
    return (
      <div className="status-module flx flx-row flx-just-center w-100 v2-type-body3"></div>
    );
  }

  if (props.tipList.length === 0 && props.canModify) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
          Add some tips!
      </div>
    );
  }
  else if (props.tipList.length === 0) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
          This guide is empty.
      </div>
    );
  }

  return (
    <div className="w-100 flx flx-col flx-center-all">
      {
        props.tipList.map((tipItem, index) => {
          return (
            <TipPreview tip={tipItem}
              key={tipItem.priority || tipItem.key} 
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