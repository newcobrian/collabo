import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import { REVIEW_TYPE } from '../../constants'
import ProfilePic from './../ProfilePic';
import ProxyImage from './../ProxyImage'
import Textarea from 'react-textarea-autosize';


// const mapDispatchToProps = dispatch => ({
//   onSubmit: payload =>
//     dispatch({ type: 'ADD_COMMENT', payload })
// });

const mapStateToProps = state => ({
  userInfo: state.common.userInfo
});

class CommentInput extends React.Component {
  constructor() {
    super();
    this.state = {
      body: ''
    };

    this.setBody = ev => {
      this.setState({ body: ev.target.value });
    };
 
    this.createComment = ev => {
      ev.preventDefault();
      // const payload = agent.Comments.create(this.props.reviewId,
      //   { body: this.state.body });
      if (this.state.body !== '') {
        const commentBody = ''.concat(this.state.body);
        this.setState({ body: '' });
        this.props.onThreadCommentSubmit(this.props.authenticated, this.props.userInfo, this.props.type, this.props.commentObject, commentBody, this.props.threadId, this.props.project, this.props.org);
      }
    };
  }

  render() {
    return (
      <form className="comment-wrapper comment-form flx flx-row flx-just-center flx-align-start" onSubmit={this.createComment}>

          {/**<ProfilePic src={this.props.userInfo.image} className="user-image user-image-sm center-img" />**/}

            <Textarea className="comment-input font--beta input--overline w-100"
              placeholder="Add a comment..."
              value={this.state.body}
              onChange={this.setBody}
              rows="1"
              cols="10"
              wrap="hard">
            </Textarea>

            <button className="comment-send vb vb--xs vb--outline fill--primary opa-100 color--white" onClick={this.createComment}>
              Post
              <i className="material-icons color--primary md-18 color--primary DN">send</i>
            </button>



        
      </form>
    );
  }
}

export default connect(mapStateToProps, Actions)(CommentInput);