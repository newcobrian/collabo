import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';

// const mapDispatchToProps = dispatch => ({
//   onClick: (payload, commentId) =>
//     dispatch({ type: 'DELETE_COMMENT', payload, commentId })
// });

const DeleteButton = props => {
  const del = () => {
    // const payload = agent.Comments.delete(props.slug, props.commentId);
    props.deleteComment(props.commentObject, props.commentId, props.threadId, props.parentId);
  };

  if (props.show) {
    return (
      <span className="mod-options">
        <div className="font--alpha danger-hover mrgn-left-md opa-40" onClick={del}>Delete</div>
      </span>
    );
  }
  return null;
};

export default connect(() => ({}), Actions)(DeleteButton);