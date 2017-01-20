import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import * as Actions from '../actions';
import * as Constants from '../constants';

const mapStateToProps = state => ({

});

class Inbox extends React.Component {
  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
  	return (
  		<div>
  		</div>
  	);
  }
}

export default connect(mapStateToProps, Actions)(Inbox);