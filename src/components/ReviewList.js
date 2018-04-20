import ReviewPreview from './ReviewPreview';
import React from 'react';


const mapStateToProps = state => ({
  ...state.profile,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const ReviewList = props => {
  if (!props.reviewList) {
    return (
      <div className="status-module flx flx-row w-100 v2-type-body2 opa-40 pdding-all-lg mrgn-top-lg ta-left DN">
        None of your friends have this on a guide yet
      </div>
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
    <div className="reviewpreview-wrapper w-100 flx flx-col flx-just-start flx-align-start">
      {
        props.reviewList.map((reviewItem, index) => {
          return (
            <ReviewPreview review={reviewItem}
              key={reviewItem.id} 
              authenticated={props.authenticated}
              userInfo={props.userInfo}

              showModal={props.showModal}
            />
          );
        })
      }
    </div>
  );
};

export default ReviewList; 