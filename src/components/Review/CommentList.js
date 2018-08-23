import Comment from './Comment';
import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { isEqual, uniq } from 'lodash';
import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';
import { CHANGE_DETECTION_DEBOUNCE_TIME } from '../../constants';
var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  googleDocs: state.review.googleDocs,
  isGoogleAuthored: state.auth.isGoogleAuthored,
  token: state.review.token,
  updates: state.firebase.ordered.updates,
});

class CommentList extends React.Component {
  constructor (props) {
    super(props);
    this.applyChangeTimer = null;
  }

  componentDidMount () {
    const { comments, isGoogleAuthored } = this.props;
    this.initGoogleDocsData(comments, isGoogleAuthored);
  }

  componentWillReceiveProps (nextProps) {
    const { comments, isGoogleAuthored, updates, token } = this.props;
    if (!isEqual(comments, nextProps.comments)) {
      this.initGoogleDocsData(nextProps.comments, isGoogleAuthored);
    }

    if (!isGoogleAuthored && nextProps.isGoogleAuthored) {
      this.initGoogleDocsData(comments, nextProps.isGoogleAuthored, true);
    }

    if (!isEqual(comments, nextProps.comments) ||
        (!isGoogleAuthored && nextProps.isGoogleAuthored) ||
        (!isLoaded(updates) && isLoaded(nextProps.updates))) {
        this.watchChanges(nextProps.comments, nextProps.updates, nextProps.isGoogleAuthored);
    }
    if (!isEqual(comments, nextProps.comments) ||
        (!token && nextProps.token) ||
        (!isGoogleAuthored && nextProps.isGoogleAuthored) ||
        (isLoaded(updates) && !isEqual(updates, nextProps.updates))) {
        this.startGettingChanges(nextProps.comments, nextProps.updates, nextProps.isGoogleAuthored, nextProps.token);
    }
  }

  getFileIds (comments) {
    return Object.keys(comments).reduce((totalLinks, commentId) => {
      const links = getLinks(comments[commentId].body).filter((l) => isGoogleDocLink(l));
      if (!links || links.length < 1) {
        return totalLinks;
      }
      const ids = [];
      links.forEach(link => {
        const fileId = getFileId(link);
        if (fileId) {
          ids.push(fileId);
        }
      });
      return totalLinks.concat(ids);
    }, []);
  }

  initGoogleDocsData (comments, isGoogleAuthored, needRefetch) {
    const { googleDocs, updateGoogleDocsMeta, token, updateGoogleDocsPageToken } = this.props;
    if (!comments || comments.length < 1) {
      return;
    }
    if (!token && isGoogleAuthored) {
      const tokenRequest = window.gapi.client.drive.changes.getStartPageToken();
      tokenRequest.execute((res) => {
        updateGoogleDocsPageToken(res.startPageToken);
        this.getChanges(res.startPageToken);
      });
    }

    const fileIds = this.getFileIds(comments);
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

  watchChanges (comments, updates, isGoogleAuthored) {
    if (!isGoogleAuthored || !comments || !isLoaded(updates)) {
      return;
    }
    const fileIds = this.getFileIds(comments);
    const newFileIds = uniq(fileIds).filter((id) => !updates && !updates[id]);
    if (!newFileIds || newFileIds.length < 1) {
      return;
    }
    newFileIds.forEach((id) => {
      const watchRequest = window.gapi.client.drive.files.watch({
        fileId: id,
        resource: {
          id,
          type: 'web_hook',
          address: 'https://collabo-bc9b2.firebaseapp.com/watchFile'
        }
      });
      watchRequest.execute();
    })
  }

  startGettingChanges (comments, updates, isGoogleAuthored, token) {
    if (!comments || !isLoaded(updates) || !isGoogleAuthored || !token) {
      return;
    }
    this.getChanges(token);
  }

  getChanges (token) {
    const { updateGoogleDocsChanges } = this.props;
    const changeListRequest = window.gapi.client.drive.changes.list({
      pageToken: token,
      fields: '*'
    });
    changeListRequest.execute((res) => {
      if (res.changes && res.changes.length > 0) {
        clearTimeout(this.applyChangeTimer);
        this.applyChangeTimer = setInterval(() => updateGoogleDocsChanges(res.changes), CHANGE_DETECTION_DEBOUNCE_TIME);
      }
      if (res.newStartPageToken && token !== res.newStartPageToken) {
        this.getChanges(res.newStartPageToken);
      }
    })
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