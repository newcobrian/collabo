import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class ReviewModal extends React.Component {
  render() {
    return (
      <div/>
        // <p>Review Modal {post.name}?</p>
        // <button onClick={() => {
        //   dispatch(deletePost(post.id)).then(() => {
        //     dispatch(hideModal())
        //   })
        // }}>
        //   Yes
        // </button>
        // <button onClick={() => dispatch(hideModal())}>
        //   Nope
        // </button>
      // </div>
      )
  }
}

export default connect(mapStateToProps, Actions)(ReviewModal);