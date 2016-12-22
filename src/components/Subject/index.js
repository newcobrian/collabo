'use strict';

import SubjectMeta from './SubjectMeta';
import CommentContainer from './CommentContainer';
import { Link } from 'react-router';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import marked from 'marked';
import Firebase from 'firebase'
import * as Actions from '../../actions';

const mapStateToProps = state => ({
  ...state.subject,
  currentUser: state.common.currentUser
});

/*const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: 'ARTICLE_PAGE_LOADED', payload }),
  onUnload: () =>
    dispatch({ type: 'ARTICLE_PAGE_UNLOADED' })
    // fetchArticle: payload =>
    //   dispatch({ type: 'FETCH_ARTICLE', payload }),
});*/

class Subject extends React.Component {
  componentWillMount() {
    // this.props.onLoad(Promise.all([
    //   agent.Articles.get(this.props.params.id),
    //   agent.Comments.forArticle(this.props.params.id)
    // ]));
    this.props.getSubject(this.props.params.sid);
    this.props.getReview(this.props.params.rid);
    this.props.getComments(this.props.params.rid);
  }

  componentWillUnmount() {
    this.props.unloadSubject(this.props.params.sid);
    this.props.unloadReview(this.props.params.rid);
    this.props.unloadComments(this.props.params.rid);
  }

  render() {
    if (!this.props.subject) {
      return null;
    }
    if (!this.props.review) {
      return null;
    }

    // const markup = { __html: marked(this.props.article.body) };
    const canModify = false;
    // const canModify = this.props.currentUser &&
      // this.props.currentUser.username === this.props.article.author.username;
    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{this.props.subject.title}</h1>
            <SubjectMeta
              subject={this.props.subject}
              canModify={canModify} /> 

          </div>
        </div>

        <div className="container page">

          <div className="row article-content">

          <div className="article-meta">
        <img src={this.props.review.rater.image} />
        <Link to={`@${this.props.review.rater.username}`} className="author"> 
          <div>Reviewer: {this.props.review.rater.username}</div>
        </Link>
        <div>Timestamp: {new Date(this.props.review.lastModified).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})} </div>
        <div>Rating: {this.props.review.rating}</div>
        <div>Caption: {this.props.review.caption}</div>


      {/*      <div className="col-xs-12">

              <div>{this.props.review.description}></div>

              <ul className="tag-list">
                {
                  this.props.subject.tagList.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}>
                        {tag}
                      </li>
                    );
                  })
                }
              </ul> */}

            </div>
          </div>

          <hr />

          <div className="article-actions">
          </div>

          <div className="row">
            <CommentContainer
                comments={this.props.comments || []}
                errors={this.props.commentErrors}
                reviewId={this.props.params.rid}
                currentUser={this.props.currentUser} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Subject);