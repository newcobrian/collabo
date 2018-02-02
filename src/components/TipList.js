import TipPreview from './TipPreview';
import React from 'react';
import * as Constants from '../constants';



const mapStateToProps = state => ({
  ...state.itinerary,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const TipList = props => {
  if (!props.tipList) {
    if (props.dataType === Constants.RECOMMENDATIONS_TYPE) {
      return (
        <div className="status-module flx flx-col flx-center-all v2-type-body3">
          No recommendations yet
        </div>
        )
    }
    else return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        No tips yet
      </div>
    );
  }

  if (props.tipList.length === 0 && props.canModify) {
    if (props.dataType === Constants.RECOMMENDATIONS_TYPE) {
      return (
        <div className="status-module flx flx-col flx-center-all v2-type-body3">
          No recommendations yet
        </div>
        )
    }
    else return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        Nothing here yet. Add something above.
      </div>
    );
  }

  else if (props.tipList.length === 0) {
    return (
      <div className="status-module flx flx-row flx-just-center w-100 v2-type-body3">
        Add your recommendations above.
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
              userInfo={props.userInfo}
              showModal={props.showModal}
              deleteComment={props.deleteComment}
              itineraryId={props.itineraryId}
              itinerary={props.itinerary}
              index={index+1}
              selectedMarker={props.selectedMarker}
              onSelectActiveTip={props.onSelectActiveTip}
              dataType={props.dataType}
              changeRating={props.changeRating}
              changeCaption={props.changeCaption}
              deleteRec={props.deleteRec}
            />
          );
        })
      }
    </div>
  );
};

export default TipList; 