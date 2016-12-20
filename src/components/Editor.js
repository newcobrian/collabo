import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import * as Actions from '../actions'

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
    this.changeImage = updateFieldEvent('image');
    this.changeRating = updateFieldEvent('rating');
    this.changeCaption = updateFieldEvent('caption');
    this.changeTagInput = updateFieldEvent('tagInput');

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
        image: this.props.image
        // body: this.props.body,
        // tagList: this.props.tagList
      };

      const review = {
        rating: this.props.rating,
        caption: this.props.caption
      }

      this.props.onReviewSubmit(subject, review);
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
        this.props.onUnload();
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
    this.props.onUnload();
  }

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Item Title"
                      value={this.props.title}
                      onChange={this.changeTitle} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Item description"
                      value={this.props.description}
                      onChange={this.changeDescription} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL of item picture"
                      value={this.props.image}
                      onChange={this.changeImage} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="number"
                      min="-3"
                      max="3"
                      placeholder="Your Rating"
                      value={this.props.rating}
                      onChange={this.changeRating} />
                  </fieldset>

                  <fieldset className="form-group">
                    <textarea
                      className="form-control"
                      rows="8"
                      placeholder="Add a caption"
                      value={this.props.caption}
                      onChange={this.changeCaption}>
                    </textarea>
                  </fieldset>

               {/*     <div className="tag-list">
                      {
                        (this.props.tagList || []).map(tag => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i  className="ion-close-round"
                                  onClick={this.removeTagHandler(tag)}>
                              </i>
                              {tag}
                            </span>
                          );
                        })
                      }
                    </div>
                  </fieldset>   */ }

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}>
                    Submit Review
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(Editor);