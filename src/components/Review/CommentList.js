import Comment from './Comment';
import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { isEqual, uniq } from 'lodash';
import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';
import { CHANGE_DETECTION_DEBOUNCE_TIME, CHANGE_DETECTION_INTERVAL } from '../../constants';
var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  googleDocs: state.review.googleDocs,
  isGoogleAuthored: state.auth.isGoogleAuthored,
  token: state.review.token
});

class CommentList extends React.Component {
  constructor (props) {
    super(props);
    this.applyChangeTimer = null;
  }

  componentDidMount () {
    const { comments, isGoogleAuthored } = this.props;
    this.initGoogleDocsMetaData(comments, isGoogleAuthored);
  }

  componentWillReceiveProps (nextProps) {
    const { comments, isGoogleAuthored } = this.props;
    if (!isEqual(comments, nextProps.comments) || !isGoogleAuthored && nextProps.isGoogleAuthored) {
      this.initGoogleDocsMetaData(nextProps.comments, nextProps.isGoogleAuthored);
    }
  }

  initGoogleDocsMetaData (comments, isGoogleAuthored) {
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

    const fileIds = Object.keys(comments).reduce((totalLinks, commentId) => {
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
    const newFileIds = uniq(fileIds).filter((id) => !googleDocs || !googleDocs[id] || !googleDocs[id].meta);
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
      })
    })
  }

  getChanges (token) {
    const { updateGoogleDocsMessage } = this.props;
    const changeListRequest = window.gapi.client.drive.changes.list({
      pageToken: token,
      fields: '*'
    });
    changeListRequest.execute((res) => {
      if (res.changes.length > 0) {
        clearTimeout(this.applyChangeTimer);
        this.applyChangeTimer = setInterval(() => updateGoogleDocsMessage(res.changes), CHANGE_DETECTION_DEBOUNCE_TIME);
      }
      if (res.newStartPageToken) {
        setTimeout(() => this.getChanges(res.newStartPageToken), CHANGE_DETECTION_INTERVAL);
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

export default connect(mapStateToProps, Actions)(CommentList);