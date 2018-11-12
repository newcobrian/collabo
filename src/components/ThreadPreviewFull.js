import React from 'react';
import { Link } from 'react-router';
import * as Constants from '../constants';
import CommentContainer from './Review/CommentContainer';
import DisplayTimestamp from './DisplayTimestamp';
import LikeReviewButton from './LikeReviewButton';
import ProfilePic from './ProfilePic';


// const UpdateSection = props => {
//   if (!props.thread) return null
//   else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
//     return (
//       <div className="mrgn-right-xs opa-80 color--black">
//         created a new thread.
//       </div>
//     )
//   }
//   else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
//     return (
//       <div className="mrgn-right-xs opa-80 color--black">
//         edited the post. 
//       </div>
//     )
//   }
//   else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
//     return (
//       <div className="mrgn-right-xs opa-80 color--black">
//         added a comment
//       </div>
//     )
//   }
//   else return null;
// }

// const UpdateIcon = props => {
//   if (!props.thread) return null
//   else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
//     return (
//       <div className="co-icon-wrapper flx flx-center-all">
//         <img className="center-img" src="/img/icon_post.png"/>
//         {/**<div className="feed-gem circle"></div>**/}
//         {/**<i className="material-icons color--primary md-24">assignment</i>**/}
//       </div>
//     )
//   }
//   else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
//     return (
//       <div className="co-icon-wrapper flx flx-center-all">
//         <img className="center-img" src="/img/icon_edit.png"/>
//         {/**<div className="feed-gem square"></div>**/}
//         {/**<i className="material-icons color--primary md-24">edit</i>**/}
//       </div>
//     )
//   }
//   else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
//     return (
//       <div className="co-icon-wrapper flx flx-center-all">
//         <img className="center-img" src="/img/icon_comment.png"/>
//         {/**<div className="feed-gem diamond"></div>**/}
//         {/**<i className="material-icons color--primary md-24">comment</i>**/}
//       </div>
//     )
//   }
//   else return (
//     <div className="co-icon-wrapper flx flx-center-all">
//       <div className="feed-gem"></div>
//     </div>
//     )
// }

var Scroll = require('react-scroll');
var Element = Scroll.Element;
var linkify = require('linkify-it')();

const UpdateSection = props => {
  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="mrgn-right-xs opa-80 color--black">
        created a new thread.
      </div>
    )
  } 
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="mrgn-right-xs opa-80 color--black">
        edited the post. 
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="mrgn-right-xs opa-80 color--black">
        added a comment
      </div>
    )
  }
  else return null;
}

const UpdateIcon = props => {
  if (!props.thread) return null
  else if (props.thread.lastUpdate === Constants.NEW_THREAD_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <img className="center-img" src="/img/icon_post.png"/>
        {/**<div className="feed-gem circle"></div>**/}
        {/**<i className="material-icons color--primary md-24">assignment</i>**/}
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.EDIT_THREAD_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <img className="center-img" src="/img/icon_edit.png"/>
        {/**<div className="feed-gem square"></div>**/}
        {/**<i className="material-icons color--primary md-24">edit</i>**/}
      </div>
    )
  }
  else if (props.thread.lastUpdate === Constants.COMMENT_TYPE) {
    return (
      <div className="co-icon-wrapper flx flx-center-all">
        <img className="center-img" src="/img/icon_comment.png"/>
        {/**<div className="feed-gem diamond"></div>**/}
        {/**<i className="material-icons color--primary md-24">comment</i>**/}
      </div>
    )
  }
  else return (
    <div className="co-icon-wrapper flx flx-center-all">
      <div className="feed-gem"></div>
    </div>
    )
}


const ProjectLabel = props => {
  if (!props.projectId || !props.projectNames) {
    return null
  }
  else return (
    <div className="koi-project-name">
      <Link className="text-hover color--black koi-type-bold" to={'/' + props.orgURL + '/' + props.projectId}>
        {props.projectNames[props.projectId] ? props.projectNames[props.projectId].name : ''}
      </Link>
    </div> 
  )
}


 
// const CommentPreview = props => {
//   if (!props.thread) return null
//   else if (props.thread.commentsCount) {
//     return (
      
//       <div className="color--black thread-timestamp flx flx-row flx-align-center pdding-all-sm w-100">
//         <div>3 New&nbsp;&#xb7;&nbsp;</div>
//         <div>{props.thread.commentsCount} Replies&nbsp;&#xb7;&nbsp;</div>
//         <div>8 Participants&nbsp;&#xb7;&nbsp;</div>
//         <div className="text-hover flx-item-right">View All</div>
//       </div>

//     )
//   }
//   else return (
  
//     <div className="color--black thread-timestamp flx flx-row flx-align-center pdding-all-sm w-100">
//         <div>Be the first to respond</div>
//     </div>  
//     )
  
// }

// const ThreadPreviewFull = props => {
class ThreadPreviewFull extends React.Component {
  constructor() {
    super()

    this.openThread = ev => {
      ev.preventDefault()
      let threadURL = '/' + this.props.org.url + '/' + this.props.thread.projectId + '/' + this.props.thread.threadId
      window.history.pushState( {} , null, threadURL );
      this.props.showThreadModal(this.props.thread, this.props.project, this.props.org, this.props.orgMembers, this.props.orgUserData)
    }
  }

  render() {
    const { authenticated, thread, lastUpdater, orgUserData, org, projectNames, userInfo, commentErrors, project, deleteComment } = this.props
    const createdBy = orgUserData && orgUserData[thread.userId] ? orgUserData[thread.userId] : { username: '' }

    return (
      <div className="flx flx-col flx-align-center w-100">
      <div className="tp-wrapper tp-preview-full tp-full flx flx-row flx-m-col w-100">
          
          <div className="tp-container ql-editor flx flx-col flx-align-start bx-shadow">           
            
            <div className="thread-row-wrapper flx flx-row">
              <div className="thread-content-wrapper w-100">

                {/*<div className="flx flx-row flx-align-center w-100 mrgn-bottom-sm brdr-bottom pdding-bottom-sm">
                  <Link to={'/' + org.url + '/user/' + createdBy.username} className="tip__author-photo flx-hold mrgn-right-sm flx flx-row">
                    <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                  </Link>

                  <div className="flx flx-col flx-align-start">
                    <div className="flx flx-row co-type-body mrgn-left-xs">
                      <Link className="co-type-bold text-hover" to={'/' + org.url + '/user/' + lastUpdater.username}>{lastUpdater.username || ''}</Link> 
                      &nbsp;<UpdateSection thread={thread} />
                    </div>
                    
                  </div>
                  <div className="thread-timestamp color--black flx-item-right DN">
                    <DisplayTimestamp timestamp={thread.lastModified} />
                  </div>

                </div>*/}

                <div className="flx flx-row">
                  <Link to={'/' + org.url + '/user/' + createdBy.username} className="thread-creator-image flx-hold mrgn-right-sm flx flx-row mrgn-right-sm">
                    <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                  </Link>
                  <div className="flx flx-col w-100">
                    <div className="color--black thread-timestamp flx flx-row flx-align-center mrgn-bottom-xs w-100 opa-90">
                      <ProjectLabel className="color--black koi-type-bold" projectNames={projectNames} projectId={thread.projectId} orgURL={org.url} />&nbsp;&#xb7;&nbsp;
                      <div><Link to={'/' + org.url + '/user/' + createdBy.username} className="text-hover color--black">{createdBy.username}</Link></div>
                      <div className="flx-item-right opa-80"><DisplayTimestamp timestamp={thread.lastModified} /></div>
                    </div>
                    <Link className="color--black co-type-thread-title mrgn-bottom-xs text-hover" onClick={this.openThread} >
                    {/*<Link className="color--black" to={'/' + org.url + '/' + thread.projectId + '/' + thread.threadId }>*/}
                          {thread.title}
                    </Link>
                  </div>
                </div>
                {/*<div className="co-type-thread-body DN" dangerouslySetInnerHTML={{ __html: thread.body || '' }}></div>*/}

                

                <div className="cta-container flx flx-row flx-align-center mrgn-top-xs mrgn-bottom-sm">
                  <div className="koi-ico ico--bookmark mrgn-right-md opa-20 no-click DN"></div>
                  <LikeReviewButton
                    authenticated={authenticated}
                    isLiked={thread.likes && thread.likes[authenticated] ? true : false}
                    likesCount={Object.keys(thread.likes || {}).length}
                    objectId={thread.threadId}
                    thread={thread}
                    likeObject={thread}
                    type={Constants.THREAD_TYPE}
                    org={org} />
                </div>

                <div className="tip__caption mrgn-top-xs co-type-thread-body flx flx-col w-100 flx-align-start" dangerouslySetInnerHTML={{ __html: thread.body || '' }} />
                  {/*<div className="tip__caption color--gray ta-left flx flx-row" dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(Helpers.convertStoredToEditorState(thread.body)) || '' }} />*/}
                </div>
                

            </div>
            <Link onClick={this.openThread} className="show-all-button fill--white co-type-body co-type-bold color--utsuri ta-center">
              {/*to={`/${orgName}/${projectId}/${thread.threadId}`}*/}
              <span className="opa-30">Show full post</span>
            </Link>
          </div>

          {/*<ThreadPreviewCommentSection
            authenticated={authenticated}
            userInfo={userInfo}
            comments={thread.comments || {}}
            errors={commentErrors}
            commentObject={thread}
            threadId={thread.threadId}
            thread={thread}
            project={project}
            orgName={orgName}
            orgUserData={orgUserData}
            type={Constants.THREAD_TYPE}
            deleteComment={deleteComment} />*/}

          <div className="comment-row-wrapper flx flx-col">
            
            <Link onClick={this.openThread} className="discussion-info color--utsuri thread-timestamp flx flx-row flx-align-center w-100 opa-30">
              {/*<div>3 New&nbsp;&#xb7;&nbsp;</div>*/}
              <div>{this.props.thread.commentsCount} Total Replies&nbsp;&#xb7;&nbsp;</div>
              <div>8 Participants</div>
              <div className="flx-item-right">View All</div>
            </Link>

            <div className="co-thread-reply-wrapper">
              <CommentContainer
                authenticated={authenticated}
                userInfo={userInfo}
                comments={thread.comments || {}}
                errors={commentErrors}
                commentObject={thread}
                threadId={thread.threadId}
                thread={thread}
                project={project}
                org={org}
                orgUserData={orgUserData}
                type={Constants.THREAD_TYPE}
                deleteComment={deleteComment}
                openThread={this.openThread}
                isFeed={true} />
            </div>
          </div>
      </div>
      <div className="w-100 pdding-all-md flx flx-col flx-center-all">
        <div className="koi-ico ico--divider opa-20 no-click"></div>
      </div>
    </div>
    );
  }
}

export default ThreadPreviewFull;