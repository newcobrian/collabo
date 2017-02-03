import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';

const mapStateToProps = state => ({
  ...state.editor
});

// const mapDispatchToProps = dispatch => ({
//   onAddTag: () =>
//     dispatch({ type: 'ADD_TAG' }),
//   onLoad: payload =>
//     dispatch({ type: 'EDITOR_PAGE_LOADED', payload }),
//   onRemoveTag: tag =>
//     dispatch({ type: 'REMOVE_TAG', tag }),
//   onSubmit: payload =>
//     dispatch({ type: 'ARTICLE_SUBMITTED', payload }),
//   onUnload: payload =>
//     dispatch({ type: 'EDITOR_PAGE_UNLOADED' }),
//   onUpdateField: (key, value) =>
//     dispatch({ type: 'UPDATE_FIELD_EDITOR', key, value })
// });

class Editor extends React.Component {
  constructor() {
    super();

    const updateFieldEvent =
      key => ev => this.props.onUpdateField(key, ev.target.value);
    this.changeTitle = updateFieldEvent('title');
    this.changeDescription = updateFieldEvent('description');
    this.changeURL = updateFieldEvent('url');
    this.changeImage = updateFieldEvent('image');
    // this.changeRating = updateFieldEvent('rating');
    this.changeCaption = updateFieldEvent('caption');
    this.changeTagInput = updateFieldEvent('tagInput');

    this.onRatingsChange = rating => ev => {
      ev.preventDefault();
      this.props.onUpdateField('rating', rating);
    }

    this.watchForEnter = ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        this.props.onAddTag();
      }
    };

    this.removeTagHandler = tag => () => {
      this.props.onRemoveTag(tag);
    };

    this.submitForm = ev => {
      ev.preventDefault();
      const subject = {
        title: this.props.title,
        description: this.props.description,
        image: this.props.image,
        url: this.props.url
        // body: this.props.body,
        // tagList: this.props.tagList
      };

      const review = {
        rating: this.props.rating,
        caption: this.props.caption
      }

      this.props.onReviewSubmit(null, subject, review);
      // const slug = { slug: this.props.articleSlug };
      // const promise = this.props.articleSlug ?
      //   agent.Articles.update(Object.assign(article, slug)) :
      //   agent.Articles.create(article);

      // this.props.onSubmit(promise);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.slug !== nextProps.params.slug) {
      if (nextProps.params.slug) {
        this.props.onEditorUnload();
        return this.props.onEditorLoad();
        // return this.props.onLoad(agent.Articles.get(this.props.params.slug));
      }
      this.props.onEditorLoad();
      // this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.params.slug) {
      return this.props.onEditorLoad();
      // return this.props.onLoad(agent.Articles.get(this.props.params.slug));
    }
    this.props.onEditorLoad(null);
    // this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onEditorUnload();
  }

  render() {
    return (
      <div className="roow roow-col roow-center-all page-common editor-page">
            <div className="page-title-wrapper roow roow-col center-text">
              <div className="text-page-title">What's Good?</div>
              <div className="text-page-subtitle">Recommend something cool to your friends. Or warn the world against something bad! Pass on the knowledge.</div>
            </div>

            <div className="form-wrapper roow roow-col-left">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
              Product details:
                <fieldset>

                  <fieldset className="form-group no-margin">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Product Name"
                      value={this.props.title}
                      onChange={this.changeTitle} />
                  </fieldset>

                  <fieldset className="form-group no-margin">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Description"
                      value={this.props.description}
                      onChange={this.changeDescription} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="website link"
                      value={this.props.url}
                      onChange={this.changeURL} />
                  </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL of item picture"
                      value={this.props.image}
                      onChange={this.changeImage} />
                  </fieldset> 

                  Your Review:
                  <fieldset className="form-group no-margin">
                    <div className={'rating-container rating-wrapper-' + this.props.rating}>
                        <div className="roow roow-row-space-around">
                          <div className="square-wrapper"><button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}></button></div>
                          <div className="square-wrapper"><button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}></button></div>
                          <div className="square-wrapper"><button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}></button></div>
                          <div className="square-wrapper"><button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}></button></div>
                          <div className="square-wrapper"><button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}></button></div>
                        </div>
                        <div className="roow roow-row-space-around">
                          <div className="rating-description">WTF</div>
                          <div className="rating-description">Weak</div>
                          <div className="rating-description">Meh</div>
                          <div className="rating-description">Coo</div>
                          <div className="rating-description">Lit as Fuck</div>
                        </div>
                    </div>
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control caption"
                      rows="3"
                      placeholder="Add a comment"
                      value={this.props.caption}
                      onChange={this.changeCaption}>
                    </textarea>
                  </fieldset>


                  <button
                    className="bttn-style bttn-submit"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}>
                    Submit Review
                  </button>

                </fieldset>
              </form>

            </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Editor);