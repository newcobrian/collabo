import Comment from './Comment';
import React from 'react';
import Firebase from 'firebase';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { isEqual, uniq } from 'lodash';
import { getFileIds } from '../../helpers';
var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  googleDocs: state.review.googleDocs,
  isGoogleAuthored: state.auth.isGoogleAuthored,
  isGoogleSDKLoaded: state.auth.isGoogleSDKLoaded
});

class CommentList extends React.Component {
  constructor (props) {
    super(props);
    this.applyChangeTimer = null;
  }

  componentDidMount () {
    const { comments, isGoogleAuthored, isGoogleSDKLoaded } = this.props;
    if (isGoogleSDKLoaded) {
      this.initGoogleDocsData(comments, isGoogleAuthored);
      this.watchChanges(comments, isGoogleAuthored);
    }
  }

  componentWillReceiveProps (nextProps) {
    const { comments, isGoogleAuthored, isGoogleSDKLoaded } = this.props;
    if (!isEqual(comments, nextProps.comments) ||
       (!isGoogleSDKLoaded && nextProps.isGoogleSDKLoaded) ||
       (!isGoogleAuthored && nextProps.isGoogleAuthored)) {
      if (nextProps.comments && nextProps.isGoogleSDKLoaded) {
        this.initGoogleDocsData(nextProps.comments, nextProps.isGoogleAuthored, nextProps.isGoogleAuthored);
        if (nextProps.isGoogleAuthored) {
          this.watchChanges(nextProps.comments, nextProps.isGoogleAuthored);
        }
      }
    }
  }

  initGoogleDocsData (comments, isGoogleAuthored, needRefetch) {
    const { googleDocs, updateGoogleDocsMeta } = this.props;
    if (!comments || comments.length < 1) {
      return;
    }
    
    const fileIds = getFileIds(comments);
    const newFileIds = needRefetch ? uniq(fileIds) : uniq(fileIds).filter((id) => !googleDocs || !googleDocs[id] || !googleDocs[id].meta);
    if (!newFileIds || newFileIds.length < 1) {
      return;
    }
    newFileIds.forEach((id) => {
      const getRequest = window.gapi.client.drive.files.get({
        fileId: id,
        fields: 'webViewLink, iconLink, id, shared, thumbnailLink, permissions, name'
      });
      getRequest.execute((data) => {
        updateGoogleDocsMeta(id, data);
      });
    })
  }

  watchChanges (comments, isGoogleAuthored) {
    if (!isGoogleAuthored || !comments) {
      return;
    }
    const fileIds = getFileIds(comments);
    const newFileIds = uniq(fileIds);
    if (!newFileIds || newFileIds.length < 1) {
      return;
    }
    const uid = Firebase.auth().currentUser.uid;
    if (uid) {
      newFileIds.forEach((id) => {
        const watchRequest = window.gapi.client.drive.files.watch({
          fileId: id,
          resource: {
            id: `${id}///${uid}`,
            type: 'web_hook',
            address: 'https://collabo-bc9b2.firebaseapp.com/watchFile'
          }
        });
        watchRequest.execute();
      })
    }
  }

  render () {
    const { comments, authenticated, userInfo, commentObject, orgName, deleteComment, threadId } = this.props;
    return (
      <div>
        {
          Object.keys(comments || {}).map(function (commentId) {
            return (
              <Comment
                comment={comments[commentId]}
                authenticated={authenticated}
                userInfo={userInfo}
                commentObject={commentObject}
                key={commentId}
                orgName={orgName}
                deleteComment={deleteComment}
                threadId={threadId} />
            );
          })
        }
      </div>
    );
  }
};

export default compose(
  firebaseConnect([
    "updates"
  ]),
  connect(mapStateToProps, Actions)
)(CommentList);