import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import { REVIEW_TYPE } from '../../constants'
import ProxyImage from './../ProxyImage'

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
      this.props.onCommentSubmit(this.props.authenticated, this.props.userInfo, this.props.type, this.props.commentObject, commentBody, this.props.itineraryId);
    };
  }

  render() {
    return (
      <form className="comment-wrapper comment-form flx flx-row flx-row-left" onSubmit={this.createComment}>
{/**}        <ProxyImage
            src={this.props.userInfo.image}
            className="comment-author-img center-img" />
**/}
        <button
          className="DN bttn-style bttn-submit bttn-subject-comment slim-version"
          type="submit">
          <i className="ion-plus"></i>
        </button>

          <div className="cta-icon cta-comment-sm mrgn-right-md"></div>

          <input className="comment-input input--overline w-100"
            placeholder="Leave a comment..."
            value={this.state.body}
            onChange={this.setBody}
            rows="1">
          </input>


        
      </form>
    );
  }
}

export default connect(() => ({}), Actions)(CommentInput);