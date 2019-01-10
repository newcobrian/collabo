import ActivityPreview from './ActivityPreview';
import React from 'react';
import * as Constants from '../constants';

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
      <div className="threadlist threadlist-loading w-100 flx flx-col flx-center-all ta-center h-100 fill--white color--black">
          <div className="loading-koi mrgn-bottom-md">
            <img className="center-img" src="/img/loading-graphic.png"/>
          </div>
          <div className="w-100 ta-center co-type-body">Loading activity...</div>
        </div>
    );
  }

  return (
    <div className="w-100 flx flx-col flx-center-all">
      {
        props.feed.map((activity, index) => {
          return (
            <ActivityPreview activity={activity}
              orgURL={props.orgURL}
              key={activity.activityId} 
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              index={index+1}
              profile={props.profile}
            />
          );
        })
      }
    </div>
  );
};

export default ActivityList; 