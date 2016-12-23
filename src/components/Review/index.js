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
  ...state.review,
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

class Review extends React.Component {
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
        <div className="subject-name-wrapper">
              <h1>{this.props.subject.title}</h1>
        </div>
          <div className="roow subject-container">

            <div className="subject-global-wrapper">

              <SubjectMeta
              subject={this.props.subject}
              canModify={canModify} />


            </div>

            <div className="subject-info-wrapper roow roow-col roow-left">
              <div className="subject-info-box roow roow-col roow-left">
                <Link to={`@${this.props.review.rater.username}`} className="author"> 
                    <div className="reviewer-wrapper">
                      <div className="reviewer-name">
                        {this.props.review.rater.username}
                      </div>
                    </div>

                </Link>
                <div className="roow">
                    <div className="reviewer-image"><img src={this.props.review.rater.image} /></div>
                    <div className="star-graphic roow">
                        <div className="star">{this.props.review.rating}</div>
                    </div>
                </div>
                <div className="info">
                  <div className="subject-caption">
                    {this.props.review.caption}
                  </div>
                
                  <div className="review-timestamp">
                    {new Date(this.props.review.lastModified).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute:'2-digit'})}
                  </div>

                  
                </div>
              </div>
              <div className="cta-box">
              </div>
          </div>{/**** E N D subject-info-box ***/}
        </div>

<div className="roow roow-comments">
             <CommentContainer
                comments={this.props.comments || []}
                errors={this.props.commentErrors}
                reviewId={this.props.params.rid}
                currentUser={this.props.currentUser} />
</div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Review);