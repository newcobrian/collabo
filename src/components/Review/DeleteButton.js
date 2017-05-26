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
    props.delete(props.review, props.commentId);
  };

  if (props.show) {
    return (
      <span className="DN mod-options">
        <i className="ion-trash-a" onClick={del}></i>
      </span>
    );
  }
  return null;
};

export default connect(() => ({}), Actions)(DeleteButton);