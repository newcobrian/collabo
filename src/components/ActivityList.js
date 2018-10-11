import ActivityPreview from './ActivityPreview';
import React from 'react';
import * as Constants from '../constants';

const mapStateToProps = state => ({
  ...state.project,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const ActivityList = props => {
  if (props.emptyActivityFeed) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        This user hasn't done anything yet
      </div>
    )
  }
  else if (!props.feed) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        Loading activity feed...
      </div>
    );
  }

  return (
    <div className="w-100 flx flx-col flx-center-all">
      {
        props.feed.map((activity, index) => {
          return (
            <ActivityPreview activity={activity}
              orgName={props.orgName}
              key={activity.activityId} 
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              index={index+1}
            />
          );
        })
      }
    </div>
  );
};

export default ActivityList; 