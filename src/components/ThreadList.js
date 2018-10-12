import ThreadPreview from './ThreadPreview';
import React from 'react';
import * as Constants from '../constants';
import { Link } from 'react-router'

const mapStateToProps = state => ({
  ...state.project,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const ThreadList = props => {
  if (props.emptyThreadFeed) {
    return (
      <div className="threadlist brdr-right b--primary--20 threadlist-loading header-push w-100 flx flx-col flx-center-all ta-center color--black opa-60">
        This list has no threads yet. <Link to={'/' + props.orgName + '/addthread/' + (props.projectId ? props.projectId : '')}>Click here to add one?</Link>
      </div>
    )
  }
  else if (!props.threads) {
    return (
      <div className="threadlist threadlist-loading header-push w-100 flx flx-col flx-center-all ta-center h-100 fill--white color--primary">
        <div className="loading-koi mrgn-bottom-md">
          <img className="center-img" src="/img/logomark.png"/>
        </div>
        <div className="w-100 ta-center co-type-body">Loading threads...</div>
      </div>
    );
  }

  return (
    <div className="threadlist brdr-right b--primary--20 header-push w-100 flx flx-col flx-align-center">
      {
        props.threads.map((threadItem, index) => {
          // only show posts from projects that user belongs to
          if (props.projectCheck && props.projectCheck[threadItem.projectId]) {
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
          }
          else return null
        })
      }
    </div>
  );
};

export default ThreadList; 