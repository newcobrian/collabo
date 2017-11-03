import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

const mapStateToProps = state => ({
  authenticated: state.common.authenticated
});

class AddTagInput extends React.Component {
  constructor() {
    super();
    this.state = {
      tagInput: ''
    };

    this.onUpdateField = ev => {
      this.setState({ tagInput: ev.target.value });
    };

    this.onFormSubmit = ev => {
      ev.preventDefault();
      if (this.state.tagInput !== '') {
        const tagInput = ''.concat(this.state.tagInput.toLowerCase().trim());
        this.setState({ tagInput: '' });
        this.props.onAddTag(this.props.authenticated, this.props.tip, this.props.itineraryId, this.props.placeId, tagInput);
      }
    };
  }

  render() {
    return (
      <form className="comment-wrapper comment-form flx flx-row flx-just-center flx-align-start mrgn-bottom-sm" onSubmit={this.onFormSubmit}>
        <input type="text" 
          value={this.state.tagInput} 
          onChange={this.onUpdateField} 
          placeholder="Add categories here" />
        <button className="comment-send vb vb--sm vb--outline fill--white color--black" onClick={this.onFormSubmit}>
          Add
          <i className="material-icons color--primary md-18 color--primary DN">send</i>
        </button>
      </form>
    )
  }
}

export default connect(mapStateToProps, Actions)(AddTagInput);