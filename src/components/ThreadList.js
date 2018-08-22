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
  if (props.emptyThreadFeed) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        This project has no threads yet. Why don't you add one?
      </div>
    )
  }
  else if (!props.threads) {
    return (
      <div className="status-module flx flx-col flx-center-all v2-type-body3">
        Loading threads...
      </div>
    );
  }

  return (
    <div className="threadlist header-push w-100 flx flx-col flx-center-all">
      {
        props.threads.map((threadItem, index) => {
          return (
            <ThreadPreview thread={threadItem}
              orgName={props.orgName}
              projectId={threadItem.projectId}
              key={threadItem.threadId} 
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              deleteComment={props.deleteComment}
              index={index+1}
              projectNames={props.projectNames}
            />
          );
        })
      }
    </div>
  );
};

export default ThreadList; 