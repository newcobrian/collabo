import React from 'react';
import { connect } from 'react-redux';
import { uniq } from 'lodash';
import * as Actions from '../../actions';
import { REVIEW_TYPE } from '../../constants'
import ProfilePic from './../ProfilePic';
import ProxyImage from './../ProxyImage'
import Textarea from 'react-textarea-autosize';
import { MentionsInput, Mention } from 'react-mentions'
// import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';

const mapStateToProps = state => ({
});

class CommentInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // body: toContentState('')
      body: props.comment ? props.comment.body : ''
    };
    
    this.setBody = ev => {
      // this.setState({ body: editorState })
      this.setState({ body: ev.target.value })
    };
 
    this.createComment = ev => {
      ev.preventDefault();
      if (this.state.body !== '') {
        // clean the comment body for @ mentions markup
        let pattern = /\B@[$][|][{][a-z0-9_-]+(\1)[}][|][$]/gi;
        const commentBody = ''.concat(this.state.body.replace(/\B@[$][|][{]([a-z0-9_-]+)[}][|][$]/gi, "@$1"))
        this.setState({ body: '' });

        // if theres a commentId already, then just update the comment
        if (this.props.commentId) {
          this.props.onThreadCommentUpdate(this.props.authenticated, this.props.commentObject, commentBody, this.props.threadId, this.props.org, this.props.commentId, this.props.parentId);
          this.props.toggleShowEdit()
        }
        // otherwise this is a new comment, create it
        else {
          this.props.onThreadCommentSubmit(this.props.authenticated, this.props.type, this.props.commentObject, commentBody, this.props.threadId, this.props.project, this.props.org, this.props.parentId);
        }

        // const links = getLinks(commentBody).filter((l) => isGoogleDocLink(l));
        // const ids = [];
        // if (links && links.length > 0) {
        //   links.forEach(link => {
        //     const fileId = getFileId(link);
        //     if (fileId) {
        //       ids.push(fileId);
        //     }
        //   });
        // }
        // if (ids.length > 0) {
        //   const newIds = uniq(ids);
        //   if (newIds.length > 0) {
        //     this.props.updateGoogleDocsChanges(newIds.map((id) => ({
        //       from: 'ui',
        //       userInfo: this.props.userInfo,
        //       threadId: this.props.threadId,
        //       fileId: id,
        //       added: (new Date()).toString()
        //     })), this.props.threadId)  
        //   }
        // }
      }
    }
  }

  render() {
    return (
      <form className="comment-wrapper comment-form flx flx-row flx-just-center" onSubmit={this.createComment}>

            {/*<Textarea className="comment-input font--beta input--overline w-100"
              placeholder="Add a comment..."
              value={this.state.body}
              onChange={this.setBody}
              rows="1"
              cols="10"
              wrap="hard">
            </Textarea>*/}

            <MentionsInput 
              className="comment-input co-type-body input--overline w-100 fill--white"
              rows="2"
              cols="2"
              wrap="hard"
              placeholder="Reply..."
              value={this.state.body} 
              onChange={this.setBody}
              displayTransform={id => `@${id}`}
              markup='@$|{__display__}|$'
              >

                <Mention
                  trigger="@"
                  data={this.props.usersList || []}
                  appendSpaceOnAdd={true}
                  renderSuggestion={(suggestion, search, highlightedDisplay) => (
                    <div className="user">@{highlightedDisplay}</div>
                  )}
                />
            </MentionsInput>

            <button className="koi-comment-post-button flx-item-right fill--white color--seaweed brdr-color--seaweed" onClick={this.createComment}>
              Post
            </button>
      </form>

    );
  }
}

export default connect(mapStateToProps, Actions)(CommentInput);