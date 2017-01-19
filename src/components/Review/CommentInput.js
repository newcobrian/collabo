import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import * as Actions from '../../actions';

// const mapDispatchToProps = dispatch => ({
//   onSubmit: payload =>
//     dispatch({ type: 'ADD_COMMENT', payload })
// });

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
      const commentBody = ''.concat(this.state.body);
      this.setState({ body: '' });
      this.props.onCommentSubmit(this.props.reviewId, commentBody);
    };
  }

  render() {
    return (
      <form className="comment-wrapper gray-border comment-form" onSubmit={this.createComment}>
        <div className="card-block">
          <textarea className="comment-input"
            placeholder="Write a comment..."
            value={this.state.body}
            onChange={this.setBody}
            rows="3">
          </textarea>
        </div>
        <div className="">
          <img
            src={this.props.currentUser.image}
            className="comment-author-img" />
          <button
            className="bttn-style bttn-submit"
            type="submit">
            Post Comment
          </button>
        </div>
      </form>
    );
  }
}

export default connect(() => ({}), Actions)(CommentInput);