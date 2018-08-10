import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import { REVIEW_TYPE } from '../../constants'
import ProfilePic from './../ProfilePic';
import ProxyImage from './../ProxyImage'
import Textarea from 'react-textarea-autosize';
import { MentionsInput, Mention } from 'react-mentions'

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
        const commentBody = ''.concat(this.state.body);
        this.setState({ body: '' });
        this.props.onThreadCommentSubmit(this.props.authenticated, this.props.userInfo, this.props.type, this.props.commentObject, commentBody, this.props.threadId, this.props.project, this.props.orgName);
      }
    }
  }

  render() {
    return (
      <form className="comment-wrapper comment-form flx flx-row flx-just-center flx-align-start" onSubmit={this.createComment}>

            {/*<Textarea className="comment-input font--beta input--overline w-100"
              placeholder="Add a comment..."
              value={this.state.body}
              onChange={this.setBody}
              rows="1"
              cols="10"
              wrap="hard">
            </Textarea>*/}

            <MentionsInput 
              className="comment-input font--beta input--overline w-100"
              rows="1"
              cols="10"
              wrap="hard"
              value={this.state.body} 
              onChange={this.setBody}
              displayTransform={id => `@${id}`}
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

            <button className="comment-send vb vb--xs vb--outline fill--primary opa-100 color--white" onClick={this.createComment}>
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