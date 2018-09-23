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
      <div className="threadlist threadlist-loading header-push w-100 flx flx-col ta-center color--black opa-60">
        This project has no posts yet. Why don't you add one?
      </div>
    )
  }
  else if (!props.threads) {
    return (
      <div className="threadlist threadlist-loading header-push w-100 flx flx-col ta-center h-100 fill--primary color--white">
        <div className="w-100 ta-center"> Loading threads...</div>
      </div>
    );
  }

  return (
    <div className="threadlist header-push w-100 flx flx-col flx-align-start">
      {
        props.threads.map((threadItem, index) => {
          return (
            <ThreadPreview 
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              thread={threadItem}
              orgName={props.orgName}
              projectId={threadItem.projectId}
              key={threadItem.threadId} 
              authenticated={props.authenticated}
              userInfo={props.userInfo}
              deleteComment={props.deleteComment}
              index={index+1}
              projectNames={props.projectNames}
              project={props.project}
              usersList={props.usersList}
              deleteComment={props.deleteComment}
            />
          );
        })
      }
    </div>
  );
};

export default ThreadList; 