import ThreadPreview from './ThreadPreview';
import React from 'react';
import * as Constants from '../constants';

const mapStateToProps = state => ({
  ...state.project,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const ThreadList = props => {
  if (!props.threads) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        This project has no threads yet. Why don't you add one?
      </div>
    );
  }

  if (props.threads.length === 0) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        This project has no threads yet. Why don't you add one?
      </div>
    )
  }

  return (
    <div className="w-100 flx flx-col flx-center-all">
      {
        props.threads.map((threadItem, index) => {
          return (
            <ThreadPreview thread={threadItem}
              key={threadItem.threadId} 
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

export default ThreadList; 