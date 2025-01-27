import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';
import * as Helpers from '../helpers';
import { Link, browserHistory } from 'react-router';
import UniversalSearchBar from './UniversalSearchBar';
import LoadingSpinner from './LoadingSpinner';
import ProfilePic from './ProfilePic';
import DisplayTimestamp from './DisplayTimestamp';
import RenderDebounceInput from './RenderDebounceInput';
import CommentContainer from './Review/CommentContainer';
import ProjectList from './ProjectList';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoggedOutMessage from './LoggedOutMessage';
import OrgHeader from './OrgHeader';
import LikeReviewButton from './LikeReviewButton';
import RichTextEditor from './RichTextEditor';
import InvalidOrg from './InvalidOrg'
import AttachmentsList from './AttachmentsList'
import AttachmentsPreview from './AttachmentsPreview'
import Select from 'react-select'

const DiscussionTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.changeTab(Constants.DISCUSSION_TAB, Constants.THREAD_PAGE);
  }

  return (
    <div className="nav-item">
      <a  href=""
          className={ props.tab === Constants.DISCUSSION_TAB ? 'koi-type-h2b mrgn-right-md opa-100 color--utsuri active' : 'koi-type-h2b color--utsuri mrgn-right-md opa-50' }
          onClick={clickHandler}>
        {props.count > 0 ? + props.count : ''} Replies
      </a>
    </div>
  );
};

const FilesTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.changeTab(Constants.FILES_TAB, Constants.THREAD_PAGE);
  }

  return (
    <div className="nav-item">
      <a  href=""
          className={ props.tab === Constants.FILES_TAB ? 'koi-type-h2b color--utsuri mrgn-bottom-md opa-100 active' : 'koi-type-h2b color--utsuri mrgn-bottom-md opa-50' }
          onClick={clickHandler}>
        {props.count > 0 ?  + props.count : ''} Files
      </a>
    </div>
  );
};

const SubSection = props => {
  if (props.tab === Constants.FILES_TAB) {
    const handleChange = selectedOption => {
      props.onChangeFileSort(selectedOption.value)
    }

    return (
      <div className="koi-type-body flx flx-col w-100">
        <div className="koi-type-body flx flx-row flx-align-center flx-just-start mrgn-bottom-sm w-100">
          <span className="flx-hold koi-type-label">Sort by: &nbsp;</span>
            <Select
              className='koi-drop'
              value={props.sortMethod}
              onChange={handleChange}
              options={Constants.FILE_SORTING_OPTIONS}
            />
        </div>

        {/*<SortDropdown attachments={props.attachments} />*/}

        <AttachmentsList 
          authenticated={props.authenticated}
          attachments={props.attachments} 
          orgUserData={props.orgUserData} 
          onDeleteFile={props.onDeleteFile} />
      </div>
    )
  }
  else { // if (props.tab === Constants.DISCUSSION_TAB) {
    return (
      <CommentContainer
        authenticated={props.authenticated}
        comments={props.comments || {}}
        errors={props.commentErrors}
        commentObject={props.thread}
        threadId={props.threadId}
        thread={props.thread}
        project={props.project}
        org={props.org}
        usersList={props.usersList}
        orgUserData={props.orgUserData}
        type={Constants.THREAD_TYPE}
        deleteComment={props.deleteComment}
        onDeleteFile={props.onDeleteFile} />
    )
  }
}

const BodySection = props => {
  if (props.isEditMode && props.canModify) {
    // return (
    //   <div>
    //     <ReactQuill 
    //         value={props.body || ''}
    //         onChange={props.updateText} />
    //   <div><Link onClick={props.onEditClick(false)}>Cancel</Link></div>
    //   <div><Link onClick={props.saveBody(props.thread)}>Save</Link></div>
    //   </div>
    //   )
    return (
      <div className="flx flx-col">
        <div className="w-100">
          <RichTextEditor
            editorState={props.bodyText}
            wrapperClass="demo-wrapper"
            editorClass="demo-editor pdding-all-md brdr-all brdr--primary"
            onChange={props.updateText}
            usersList={props.usersList}
          />
        </div>
        <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
          <div className="w-auto thread-timestamp color--black mrgn-right-md">
            <Link onClick={props.onEditClick(false)}>Cancel</Link>
          </div>
          <div className="w-auto thread-timestamp color--secondary">
            <Link onClick={props.saveBody(props.thread)}>Save</Link>
          </div>
        </div> 
      </div>
    )
  }
  else if (props.canModify) {
    return (
      <div className="flx flx-col">
        <div className="w-100">
          <RichTextEditor
            editorState={props.bodyText}
            wrapperClass="demo-wrapper"
            editorClass="demo-editor pdding-all-md brdr-all brdr--primary"
            onChange={props.updateText}
            usersList={props.usersList}
            toolbarHidden={true}
            readOnly={true}
          />
        </div>
          {/*<textarea
            disabled
            value={draftToHtml(convertToRaw(props.bodyText.getCurrentContent()))}
          />>*/}
          <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
            <div className="w-auto thread-timestamp color--black mrgn-right-md">
              <Link onClick={props.onDeleteClick}>Delete</Link>
            </div>
            <div className="w-auto thread-timestamp color--secondary">
              <Link onClick={props.onEditClick(true)}>Edit</Link>
            </div>
          </div>

      </div>
    )
  }
  else {
    return (
      <div className="flx flx-col">
        <div className="w-100">
          <RichTextEditor
              editorState={props.bodyText}
              wrapperClass="demo-wrapper"
              editorClass="demo-editor pdding-all-md brdr-all brdr--primary"
              onChange={props.updateText}
              usersList={props.usersList}
              toolbarHidden={true}
              readOnly={true}
            />
        </div>
          <div className="w-100 flx flx-row mrgn-top-md w-auto flx-item-right">
            <div className="w-auto thread-timestamp color--black mrgn-right-md">
              <Link onClick={props.onDeleteClick}>Delete</Link>
            </div>
            <div className="w-auto thread-timestamp color--secondary">
              <Link onClick={props.onEditClick(true)}>Edit</Link>
            </div>
          </div>
      {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(props.bodyText) || '' }}>
          </div>*/}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.thread,
  userInfo: state.common.userInfo,
  org: state.projectList.org,
  authenticated: state.common.authenticated,
  invalidOrgUser: state.common.invalidOrgUser
})

const mapDispatchToProps = {
  updateThreadField: Actions.updateThreadField,
  onUpdateCreateField: Actions.onUpdateCreateField,
  changeEditorState: Actions.changeEditorState,
  setEditMode: Actions.setEditMode,
  showDeleteModal: Actions.showDeleteModal,
  onDeleteThreadComment: Actions.onDeleteThreadComment,
  changeTab: Actions.changeTab,
  deleteAttachmentFile: Actions.deleteAttachmentFile,
  sortFiles: Actions.sortFiles,
  updateThreadLastSeen: Actions.updateThreadLastSeen
}

class ThreadBody extends React.Component {
  constructor() {
    super()

    const updateThreadFieldEvent = (field, value, thread) =>
      this.props.updateThreadField(this.props.authenticated, this.props.threadId, thread, this.props.org, field, value)

    this.saveBody = thread => ev => {
      ev.preventDefault()
      updateThreadFieldEvent('body', this.props.bodyText, thread)
    }

    this.updateText = value => {
      this.props.onUpdateCreateField('bodyText', value, Constants.THREAD_PAGE)
    }

    this.onEditorStateChange = (editorState) => {
      this.props.changeEditorState(editorState)
    }

    this.onEditClick = mode => ev => {
      ev.preventDefault()
      this.props.setEditMode(mode, Constants.THREAD_PAGE)
    }

    this.onDeleteClick = ev => {
      ev.preventDefault()
      this.props.showDeleteModal(this.props.threadId, this.props.thread, this.props.org.url, Constants.THREAD_PAGE)
    }

    this.onGoBackClick = ev => {
      ev.preventDefault();
      browserHistory.goBack()
    }

    this.onProjectInviteClick = (project) => {
      this.props.showProjectInviteModal(this.props.thread.projectId, this.props.project, this.props.org.id, this.props.org, this.props.orgMembers)
    }
  }

  componentDidMount() {
    this.props.updateThreadLastSeen(this.props.authenticated, this.props.org.id, this.props.thread.projectId, this.props.threadId)
  }

  render() {
    if (!this.props.thread) {
    return null
    }
    else {
      const { authenticated, threadId, thread, project, comments, commentErrors, org, 
        orgMembers, orgUserData, bodyText, likes, attachments, tab, sortOption } = this.props

      let createdBy = orgUserData && orgUserData[thread.userId] ? orgUserData[thread.userId] : { username: '', image: '', fullName: ''}
      let canModify = authenticated === thread.userId ? true : false

      const onDeleteFile = (attachmentId) => {
        this.props.deleteAttachmentFile(authenticated, attachmentId)
      }

      const onChangeFileSort = method => {
        this.props.sortFiles(method, Constants.THREAD_PAGE)
      }

      return (
        <div className={"thread-body fill--mist left-text flx flx-col flx-align-center"}>
            <div className="thread-view w-100">
              <div className={"tp-wrapper flx flx-row flx-m-col fill--mist"}>   
                <div className="tp-container b--primary--10 flx flx-col flx-align-start mrgn-top-sm">   
                  <div className="thread-row-wrapper flx flx-row">
                    <div className="thread-content-wrapper w-100">
                      <div className="co-type-thread-title color--black mrgn-bottom-xs">{thread.title}</div>
                      <div className="flx flx-row w-100 flx-align-center mrgn-bottom-x color--black opa-50 mrgn-bottom-sm">
                        <span className="koi-type-caption">Posted by {createdBy.username}
                          <Link
                            to={'/' + org.url + '/user/' + createdBy.username}
                            className="show-in-list">
                          <div className="flx flx-row flx-just-start flx-align-center mrgn-bottom-sm">
                              <div className="tip__author-photo flx-hold mrgn-right-sm">
                                <ProfilePic src={createdBy.image} className="user-image user-image-sm center-img" />
                              </div> 
                              <div className="color--black">
                                {createdBy.username}
                              </div>
                          </div>
                        </Link> 
                        </span>
                        <span className="koi-type-caption mrgn-left-md">Last updated:&nbsp;
                          <DisplayTimestamp timestamp={thread.lastModified} />
                        </span>
                      </div>
                      <div className="cta-wrapper vb--outline--none flx flx-row flx-align-center brdr-bottom pdding-bottom-sm">
                        <LikeReviewButton
                          authenticated={authenticated}
                          isLiked={likes && likes[authenticated] ? true : false}
                          likesCount={Object.keys(likes || {}).length}
                          objectId={threadId}
                          thread={thread}
                          likeObject={thread}
                          type={Constants.THREAD_TYPE}
                          org={org} />
                      </div>
                      <div className="co-type-body color--black w-100 mrgn-top-sm opa-90">
                        <BodySection
                          bodyText={bodyText}
                          updateText={this.updateText}
                          canModify={canModify}
                          thread={thread}
                          saveBody={this.saveBody}
                          onEditClick={this.onEditClick}
                          onDeleteClick={this.onDeleteClick}
                          isEditMode={this.props.isEditMode}
                          usersList={this.props.orgMembers}
                            />
                      </div>
                      
                      {/* this.renderChanges(this.props.updates, this.props.userId, this.props.comments, this.props.params.tid, this.props.googleDocs) */}
                      <AttachmentsPreview 
                        authenticated={authenticated} 
                        uploaderId={thread.userId}
                        attachments={thread.attachments} 
                        onDeleteFile={onDeleteFile} />
                    </div>
                  </div>
              </div>


                <div className="comment-row-wrapper flx flx-col">
                  <div className="flx flx-row flx-align-center flx-just-start w-100 mrgn-bottom-sm mrgn-top-lg">
                    <DiscussionTab tab={tab} changeTab={this.props.changeTab} count={thread.commentsCount} />
                    <FilesTab tab={tab} changeTab={this.props.changeTab} count={this.props.attachmentCount} />
                  </div>

                  <div className="co-thread-reply-wrapper">
                    
                      <SubSection
                        tab={tab}
                        authenticated={authenticated}
                        comments={comments || {}}
                        errors={commentErrors}
                        commentObject={thread}
                        threadId={threadId}
                        thread={thread}
                        project={project}
                        org={org}
                        usersList={orgMembers}
                        orgUserData={orgUserData}
                        deleteComment={this.props.onDeleteThreadComment}
                        attachments={attachments}
                        onDeleteFile={onDeleteFile}
                        onChangeFileSort={onChangeFileSort}
                        sortOption={sortOption} />

                  </div>
                </div>
              </div>

           
            </div>
        </div>
      )
    }
  }
}

// export default ThreadBody
export default connect(mapStateToProps, mapDispatchToProps)(ThreadBody);