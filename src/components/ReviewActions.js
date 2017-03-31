import { Link } from 'react-router';
import React from 'react';
import * as Actions from '../actions';
import { connect } from 'react-redux';

const ReviewActions = props => {
  const del = () => {
    props.deleteReview(props.authenticated, props.review.id, props.review.subjectId, props.reviewDetailPath);
  };

  if (props.canModify) {
    return (
      <span>

{/***}        <Link
          to={`/editor/${subject.slug}`}
          className="btn btn-outline-secondary btn-sm">
          <i className="ion-edit"></i> Edit Article
        </Link>
      ***/}

        <button className="bttn-style bttn-minimal" onClick={del}>
          <img src="../img/icon32_x.svg"/>
        </button>

      </span>
    );
  }

  return (
    <span>
    </span>
  );
};

export default connect(() => ({}), Actions)(ReviewActions);