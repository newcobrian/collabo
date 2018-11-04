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
import ThreadBody from './../ThreadBody'

const mapStateToProps = state => ({
  ...state.modal,
  ...state.thread,
  authenticated: state.common.authenticated
});

const mapDispatchToProps = {
  sendMixpanelEvent: Actions.sendMixpanelEvent,
  setAuthRedirect: Actions.setAuthRedirect,
  updateThreadField: Actions.updateThreadField,
  onUpdateCreateField: Actions.onUpdateCreateField,
  changeEditorState: Actions.changeEditorState,
  setEditMode: Actions.setEditMode,
  showDeleteModal: Actions.showDeleteModal,
  loadThreadLikes: Actions.loadThreadLikes,
  watchThreadComments: Actions.watchThreadComments,
  unloadThreadLikes: Actions.unloadThreadLikes,
  unwatchThreadComments: Actions.unwatchThreadComments,
  markThreadRead: Actions.markThreadRead,
  onDeleteThreadComment: Actions.onDeleteThreadComment,
  hideModal: Actions.hideModal,
  unloadThreadModal: Actions.unloadThreadModal
}

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
      this.props.setEditMode(mode, Constants.THREAD_MODAL)
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
    this.props.watchThreadComments(this.props.thread.threadId);

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'thread modal' });
  }

  componentWillUnmount() {
    this.props.unloadThreadLikes(this.props.thread.threadId, Constants.THREAD_MODAL);
    this.props.unwatchThreadComments(this.props.thread.threadId);
    this.props.unloadThreadModal()
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Close"
        className="vb vb--outline-none fill--white color--grey"
        onClick={handleClose}
        style={{}}
        labelStyle={{}}
      />,
    ];

    if (!this.props.thread) {
      return (
        <LoadingSpinner message="Loading thread" />
        )
    }
    else {
      const { authenticated, orgName, thread, threadId, project, orgMembers, orgUserData, bodyText, isEditMode, 
        likes, comments, commentErrors } = this.props
      // let createdBy = this.props.createdBy
      let createdBy = orgUserData && orgUserData[thread.userId] ? orgUserData[thread.userId] : 
        { username: '', image: '', fullName: ''}
      let canModify = authenticated === thread.userId ? true : false

      return (
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <Dialog
            fullScreen={false}
            actions={actions}
            open={(this.props.modalType === Constants.THREAD_MODAL) ? true : false}
            autoScrollBodyContent={false}
            onRequestClose={handleClose}
            lockToContainerEdges={false}
            modal={false}
            
            title={thread.title}

            titleClassName="co-type-h3 color--black"
            titleStyle={{display: "none"}}

            className="dialog dialog--save"
            style={{}}

            overlayClassName="dialog__overlay"
            overlayStyle={{}}
            
            paperClassName="dialog--paper"
            
            contentClassName="dialog--save__wrapper"
            contentStyle={{width: "auto", maxWidth: "none"}}
            
            bodyClassName="dialog--save__body"
            bodyStyle={{padding: "0px"}}

            actionsContainerClassName="dialog--save__actions"
            actionsContainerStyle={{}}
          >
         
            <ThreadBody
              authenticated={authenticated}
              orgName={orgName}
              thread={thread}
              threadId={thread.threadId}
              project={project}
              createdBy={createdBy}
              orgMembers={orgMembers}
              orgUserData={orgUserData}
              canModify={canModify}
              bodyText={this.props.bodyText}
              isEditMode={this.props.isEditMode}
              updateText={this.updateText}
              saveBody={this.saveBody}
              onEditClick={this.onEditClick}
              onDeleteClick={this.onDeleteClick}
              likes={likes}
              comments={comments}
              commentErrors={commentErrors}
              onDeleteThreadComment={this.props.onDeleteThreadComment}
              onBackClick={handleClose}
             />
          </Dialog>
        </MuiThemeProvider>
      );
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadModal);