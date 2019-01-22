import ThreadPreviewFull from './ThreadPreviewFull';
import ThreadPreview from './ThreadPreview';
import React from 'react';
import * as Constants from '../constants';
import { Link } from 'react-router'
import VisibilitySensor from "react-visibility-sensor";

const mapStateToProps = state => ({
  ...state.project,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

const ThreadList = props => {
  const onThreadVisible = (projectId, threadId, isUnread, title) => isVisible => {
    if (isVisible && isUnread) {
      // console.log('updating ' + title)
      props.markThreadRead(props.authenticated, props.org.id, projectId, threadId)
    }
  }

  if (props.emptyThreadFeed) {
    return (
      <div className="threadlist brdr-right b--primary--20 threadlist-loading header-push w-100 flx flx-col flx-center-all ta-center color--black">
        This group has no posts yet.
        <Link to={'/' + props.org.url + '/addthread/' + (props.projectId ? props.projectId : '')}>
        Click the lilypad to post one</Link>
        <Link to={'/' + props.org.url + '/addthread/' + (props.projectId ? props.projectId : '')} className="illustration square-sm flx flx-col flx-center-all mrgn-top-sm">
          <img className="center-img" src="/img/illu_lilypad.png"/>
        </Link>
      </div>
    )
  }
  else if (!props.threads) {
    return (
      <div className="threadlist threadlist-loading header-push w-100 flx flx-col flx-center-all ta-center h-100 fill--mist color--black">
        <div className="loading-koi mrgn-bottom-md">
          <img className="center-img" src="/img/loading-graphic.png"/>
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
            // let lastUpdateUser = threadItem.lastUpdater && props.usersList[threadItem.lastUpdater] ? props.usersList[threadItem.lastUpdater] : 
            //   Object.assign({}, {
            //     userId: null,
            //     username: '',
            //     image: ''
            //   })

            //   if(threadItem.threadId === '-LPU_RbrLfRKzqg0o5TN') {
            //     console.log(JSON.stringify(threadItem.lastUpdater))
            //     console.log(JSON.stringify(lastUpdateUser))
            //     console.log(JSON.stringify(props.usersList[threadItem.lastUpdater]))
            //   }

            let lastUpdater = props.orgUserData && props.orgUserData[threadItem.lastUpdater] ? props.orgUserData[threadItem.lastUpdater] : { username: '' }
            let isUnread = props.unreadThreads && props.unreadThreads[threadItem.projectId] && props.unreadThreads[threadItem.projectId][threadItem.threadId]

            if (props.showListView) {
              return (
                <ThreadPreview
                  authenticated={props.authenticated}
                  userInfo={props.userInfo}
                  thread={threadItem}
                  org={props.org}
                  projectId={threadItem.projectId}
                  key={threadItem.threadId} 
                  authenticated={props.authenticated}
                  userInfo={props.userInfo}
                  deleteComment={props.deleteComment}
                  index={index+1}
                  projectNames={props.projectNames}
                  project={props.project}
                  deleteComment={props.deleteComment}
                  lastUpdater={lastUpdater}
                  orgMembers={props.orgMembers}
                  orgUserData={props.orgUserData}
                  showThreadModal={props.showThreadModal}
                  isUnread={isUnread}
                />
              );
            }
            else {
              return (
                <VisibilitySensor 
                  key={threadItem.threadId} 
                  partialVisibility={true}
                  minTopValue={200}
                  delayedCall={true}
                  intervalDelay={1000}
                  onChange={onThreadVisible(threadItem.projectId, threadItem.threadId, isUnread, threadItem.title)}>
                  <ThreadPreviewFull
                    authenticated={props.authenticated}
                    userInfo={props.userInfo}
                    thread={threadItem}
                    org={props.org}
                    projectId={threadItem.projectId}
                    key={threadItem.threadId} 
                    authenticated={props.authenticated}
                    userInfo={props.userInfo}
                    deleteComment={props.deleteComment}
                    index={index+1}
                    projectNames={props.projectNames}
                    project={props.project}
                    deleteComment={props.deleteComment}
                    lastUpdater={lastUpdater}
                    orgMembers={props.orgMembers}
                    orgUserData={props.orgUserData}
                    showThreadModal={props.showThreadModal}
                    onDeleteFile={props.onDeleteFile}
                    isUnread={isUnread} />
                </VisibilitySensor>
              );
            }
          }
          else return null
        })
      }
    </div>
  );
};

export default ThreadList; 