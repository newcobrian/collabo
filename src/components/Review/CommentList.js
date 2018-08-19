import Comment from './Comment';
import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { isEqual, uniq } from 'lodash';
import superagent from 'superagent';
import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';
import { GOOGLE_DRIVE_API_ENDPOINT, GOOGLE_DRIVE_API_KEY } from '../../constants';
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
    const { googleDocs, updateGoogleDocs } = this.props;
    if (!comments || comments.length < 1) {
      return;
    }
    const fileIds = comments.reduce((totalLinks, comment) => {
      const links = getLinks(comment.body).filter((l) => isGoogleDocLink(l));
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
      superagent
        .get(`${GOOGLE_DRIVE_API_ENDPOINT}/v2/files/${id}?key=${GOOGLE_DRIVE_API_KEY}`)
        .then((res) => {
          updateGoogleDocs(id, res.body);
        });
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