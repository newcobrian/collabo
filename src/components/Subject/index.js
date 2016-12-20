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
  }

  componentWillUnmount() {
    this.props.unloadSubject(this.props.params.sid);
  }

  render() {
    console.log(JSON.stringify(this.props.subject));
    if (!this.props.subject) {
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
            <div className="col-xs-12">

              <div>{this.props.subject.description}></div>

          {/*}    <ul className="tag-list">
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
                slug={this.props.params.id}
                currentUser={this.props.currentUser} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Subject);