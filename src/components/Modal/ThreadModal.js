import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import ProfilePic from './../ProfilePic'
import DisplayTimestamp from './../DisplayTimestamp'
import LikeReviewButton from './../LikeReviewButton'
import RichTextEditor from './../RichTextEditor'
import CommentContainer from './../Review/CommentContainer'

const BodySection = props => {
  if (!props.bodyText) return null;
  else if (props.isEditMode && props.canModify) {
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
      <div>
        <RichTextEditor
            editorState={props.bodyText}
            wrapperClass="demo-wrapper"
            editorClass="demo-editor pdding-all-md brdr-all brdr--primary"
            onChange={props.updateText}
            usersList={props.usersList}
            toolbarHidden={true}
            readOnly={true}
          />
      {/*<div dangerouslySetInnerHTML={{ __html: Helpers.convertEditorStateToHTML(props.bodyText) || '' }}>
          </div>*/}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class ThreadModal extends React.Component {
  constructor() {
    super()

    const updateThreadFieldEvent = (field, value, thread) =>
      this.props.updateThreadField(this.props.authenticated, this.props.thread.threadId, thread, this.props.orgName, field, value)

    this.saveBody = thread => ev => {
      ev.preventDefault()
      updateThreadFieldEvent('body', this.props.bodyText, thread)
    }

    this.updateText = value => {
      this.props.onUpdateCreateField('bodyText', value, Constants.THREAD_MODAL)
    }

    this.onEditorStateChange = (editorState) => {
      this.props.changeEditorState(editorState)
    }

    this.onEditClick = mode => ev => {
      ev.preventDefault()
      this.props.setEditMode(mode)
    }

    this.onDeleteClick = ev => {
      ev.preventDefault()
      this.props.showDeleteModal(this.props.thread.threadId, this.props.thread, this.props.orgName, Constants.THREAD_MODAL)
    }

    this.onGoBackClick = ev => {
      ev.preventDefault();
      browserHistory.goBack()
    }
  }

  componentDidMount() {
    this.props.loadThreadLikes(this.props.thread.threadId, Constants.THREAD_MODAL);

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'thread modal' });
  }

  componentWillUnmount() {
    this.props.unloadThreadLikes(this.props.thread.threadId, Constants.THREAD_MODAL);
  }

  render() {
    if (!this.props.thread) {
      return (
        <LoadingSpinner message="Loading thread" />
        )
    }
    else {
      let thread = this.props.thread
      // let createdBy = this.props.createdBy
      let createdBy = this.props.orgUserData && this.props.orgUserData[thread.userId] ? this.props.orgUserData[thread.userId] : { username: '', image: '', fullName: ''}
      let canModify = this.props.authenticated === this.props.thread.userId ? true : false

      return (
      <div className="page-common page-thread flx flx-row flx-m-col flx-just-start">

        <div className={"thread-body header-push-mini left-text flx flx-col flx-align-center"}>
          
          <Link onClick={this.onGoBackClick} activeClassName="active" className="nav-module create nav-editor flx flx-align-start mrgn-top-sm w-100">
            <div className="nav-text flx flx-row flx-align-center opa-60 mrgn-bottom-md">
              <i className="material-icons color--black md-18 opa-100 mrgn-right-xs">arrow_back_ios</i>
              <div className="co-type-body mrgn-left-xs">Back to list</div>
            </div>
          </Link>
          <div className="thread-view w-100">
            <div className={"tp-wrapper flx flx-row"}>   
              <div className="tp-container b--primary--10 flx flx-col flx-align-start">   
                <div className="thread-row-wrapper flx flx-row">
                  <div className="thread-content-wrapper w-100">
                    <div className="co-type-thread-title">{thread.title}</div>
                    <div className="flx flx-row w-100 flx-align-center brdr-bottom pdding-bottom-sm mrgn-bottom-md">
                      <span className="thread-timestamp">Posted by {createdBy.username}
                        <Link
                          to={'/' + this.props.orgName + '/user/' + createdBy.username}
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
                      <span className="thread-timestamp mrgn-left-md">Last updated:&nbsp;
                        <DisplayTimestamp timestamp={thread.lastModified} />
                      </span>
                    </div>
                    <div className="co-type-body opa-90 w-100 mrgn-top-sm">
                      <BodySection
                        bodyText={this.props.bodyText}
                        updateText={this.updateText}
                        canModify={canModify}
                        thread={thread}
                        saveBody={this.saveBody}
                        onEditClick={this.onEditClick}
                        onDeleteClick={this.onDeleteClick}
                        isEditMode={this.props.isEditMode}
                        usersList={this.props.usersList}
                          />
                    </div>
                    <div className="cta-wrapper vb--outline--none flx flx-row flx-align-center mrgn-top-sm">
                      <LikeReviewButton
                        authenticated={this.props.authenticated}
                        isLiked={this.props.likes && this.props.likes[this.props.authenticated] ? true : false}
                        likesCount={Object.keys(this.props.likes || {}).length}
                        objectId={this.props.thread.threadId}
                        thread={thread}
                        likeObject={thread}
                        type={Constants.THREAD_TYPE}
                        orgName={this.props.orgName} />
                    </div>
                    {/* this.renderChanges(this.props.updates, this.props.userId, this.props.comments, this.props.thread.threadId, this.props.googleDocs) */}

                  </div>
                </div>
            </div>


              <div className="comment-row-wrapper flx flx-row" id='guidecommentcontainer' name='guidecommentcontainer'>
                <div className="co-thread-reply-wrapper">
                  <CommentContainer
                    authenticated={this.props.authenticated}
                    comments={this.props.comments || {}}
                    errors={this.props.commentErrors}
                    commentObject={thread}
                    threadId={this.props.thread.threadId}
                    thread={this.props.thread}
                    project={this.props.project}
                    orgName={this.props.orgName}
                    usersList={this.props.orgMembers}
                    orgUserData={this.props.orgUserData}
                    type={Constants.THREAD_TYPE}
                    deleteComment={this.props.onDeleteThreadComment} />
                    </div>
                  </div>
              </div>

         
              </div>
          </div>

        </div>
      );
    }
  }
}

export default connect(mapStateToProps, Actions)(ThreadModal);