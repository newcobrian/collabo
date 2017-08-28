import ReviewPreview from './ReviewPreview';
import React from 'react';


const mapStateToProps = state => ({
  ...state.review,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const ReviewList = props => {
  if (!props.reviewList) {
    return (
      <div className="status-module flx flx-row flx-just-center w-100 v2-type-body3"></div>
    );
  }

  else if (props.reviewList.length === 0) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
          This is empty.
      </div>
    );
  }

  return (
    <div className="reviewpreview-wrapper w-100 flx flx-col flx-center-all">
      {
        props.reviewList.map((reviewItem, index) => {
          return (
            <ReviewPreview tip={reviewItem}
              key={reviewItem.reviewId} 
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              showModal={props.showModal}
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

export default ReviewList; 