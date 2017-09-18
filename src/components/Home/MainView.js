import ReviewList from '../ReviewList';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import ItineraryList from './../ItineraryList';
import ItineraryPreview from './../ItineraryPreview';

const mapStateToProps = state => ({
  ...state.home,
  authenticated: state.common.authenticated
});

const MainView = props => {
  return (
    <div className="feed-wrapper fill--light-gray">


    </div>
  );
};

export default connect(mapStateToProps, Actions)(MainView);