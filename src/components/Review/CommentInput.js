import React from 'react';
import { connect } from 'react-redux';
import { uniq } from 'lodash';
import * as Actions from '../../actions';
import { REVIEW_TYPE } from '../../constants'
import ProfilePic from './../ProfilePic';
import ProxyImage from './../ProxyImage'
import Textarea from 'react-textarea-autosize';
import { MentionsInput, Mention } from 'react-mentions'
import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';

const mapStateToProps = state => ({
  userInfo: state.common.userInfo
});

class CommentInput extends React.Component {
  constructor() {
    super();
    this.state = {
      // body: toContentState('')
      body: ''
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
        this.props.onThreadCommentSubmit(this.props.authenticated, this.props.userInfo, this.props.type, this.props.commentObject, commentBody, this.props.threadId, this.props.project, this.props.orgName);

        const links = getLinks(commentBody).filter((l) => isGoogleDocLink(l));
        const ids = [];
        if (links && links.length > 0) {
          links.forEach(link => {
            const fileId = getFileId(link);
            if (fileId) {
              ids.push(fileId);
            }
          });
        }
        if (ids.length > 0) {
          const newIds = uniq(ids);
          if (newIds.length > 0) {
            this.props.updateGoogleDocsChanges(newIds.map((id) => ({
              from: 'ui',
              userInfo: this.props.userInfo,
              threadId: this.props.threadId,
              fileId: id,
              added: (new Date()).toString()
            })), this.props.threadId)  
          }
        }
      }
    }
  }

  render() {
    return (
      <form className="comment-wrapper comment-form flx flx-col flx-just-center" onSubmit={this.createComment}>

            {/*<Textarea className="comment-input font--beta input--overline w-100"
              placeholder="Add a comment..."
              value={this.state.body}
              onChange={this.setBody}
              rows="1"
              cols="10"
              wrap="hard">
            </Textarea>*/}

            <MentionsInput 
              className="comment-input font--beta input--overline w-100 pdding-all-sm brdr-all brdr--primary"
              rows="6"
              cols="10"
              wrap="hard"
              placeholder="Reply here..."
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

            <button className="flx-item-right mrgn-top-sm comment-send vb vb--xs fill--primary opa-100 color--white" onClick={this.createComment}>
              Post
              <i className="material-icons color--primary md-18 color--primary DN">send</i>
            </button>

            {/**<ProfilePic src={this.props.userInfo.image} className="user-image user-image-sm center-img" />

            **/}

        
      </form>
    );
  }
}

export default connect(mapStateToProps, Actions)(CommentInput);