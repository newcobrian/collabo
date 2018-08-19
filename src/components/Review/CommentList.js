import Comment from './Comment';
import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { isEqual, uniq } from 'lodash';
import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';
var linkify = require('linkify-it')();

const mapStateToProps = state => ({
  googleDocs: state.review.googleDocs,
  isGoogleAuthored: state.auth.isGoogleAuthored
});

class CommentList extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { comments } = this.props;
    this.initGoogleDocsMetaData(comments);
  }

  componentWillReceiveProps (nextProps) {
    const { comments, isGoogleAuthored } = this.props;
    if (!isEqual(comments, nextProps.comments) || !isGoogleAuthored && nextProps.isGoogleAuthored) {
      this.initGoogleDocsMetaData(nextProps.comments);
    }
  }

  initGoogleDocsMetaData (comments) {
    const { googleDocs, updateGoogleDocsMeta } = this.props;
    if (!comments || comments.length < 1) {
      return;
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
      const request = window.gapi.client.drive.files.get({
        fileId: id,
        fields: 'webViewLink, iconLink, id, shared, thumbnailLink, permissions, name'
      });
      request.execute((data) => {
        updateGoogleDocsMeta(id, data);
      })
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