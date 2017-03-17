import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import SelectTag from './SelectTag';
import * as Constants from '../constants';

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
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
    // this.changeImage = updateFieldEvent('image');
    // this.changeImage = onUpdateField('image', ev.target.files[0]);
    // this.changeRating = updateFieldEvent('rating');
    this.changeCaption = updateFieldEvent('caption');
    // this.changeTagInput = updateFieldEvent('tagInput');

    this.onRatingsChange = rating => ev => {
      ev.preventDefault();
      this.props.onUpdateField('rating', rating);
    }

    this.changeFile = ev => {
      this.props.onUpdateField('image', ev.target.files[0]);
    }

    this.watchForEnter = ev => {
      if (ev.keyCode === 13) {
        ev.preventDefault();
        this.props.onAddTag();
      }
    };

    this.changeTag = ev => {
      ev.preventDefault();
      this.props.onUpdateField('tagInput', ev.target.value);
    }

    this.removeTagHandler = tag => () => {
      this.props.onRemoveTag(tag);
    };

    this.submitForm = ev => {
      ev.preventDefault();

      if (!this.props.title) {
        this.props.editorSubmitError('product name');
      }
      else if (this.props.rating !== 0 && !this.props.rating) {
        this.props.editorSubmitError('rating');
      }
      else {
        const subject = {
          title: this.props.title
        };

        if (this.props.url) subject.url = this.props.url;
        if (this.props.tagInput) {
          subject.tags = {};
          subject.tags[this.props.tagInput] = true;
        }

        const review = {
          rating: this.props.rating
        }
        if (this.props.caption) review.caption = this.props.caption;

        this.props.setInProgress();
        this.props.onEditorSubmit(subject, this.props.image, review, this.props.tagInput);
      }
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
            <div className="page-title-wrapper roow roow-row center-text">
              <a className="text-page-title unselected" href="#/create">Search</a>
              <div className="text-page-title">Create New</div>
            </div>

            <div className="form-wrapper roow roow-col-left">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
              
                <fieldset>
                  <div className="roow roow-row-top">
                    <fieldset className="form-group no-margin apple">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Product Name"
                        required
                        value={this.props.title}
                        onChange={this.changeTitle} />
                    </fieldset>

                    <fieldset className="form-group">
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*" 
                      onChange={this.changeFile} />
                  </fieldset>

                  </div>
                  <fieldset className="form-group no-margin">
                    <div>
                      <select className='react-textselect-input' onChange={this.changeTag} value={this.props.tagInput}>
                        <option selected disabled>Choose a category</option>
                        {Constants.TAG_LIST.map(item => {
                          return (
                                <option value={item} key={item}>{item}</option>
                            );
                        })}
                      </select>
                     {/***} <SelectTag options={Constants.TAG_LIST} handler={this.changeTag} value={this.props.tag} />  ***/}
                    </div>
                  </fieldset>
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

                  <div className="gray-border">
                  <fieldset className="form-group">
                    <textarea
                      className="form-control caption"
                      rows="3"
                      placeholder="Compose a quick comment..."
                      value={this.props.caption}
                      onChange={this.changeCaption}>
                    </textarea>
                   </fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control subtle-input"
                      type="text"
                      placeholder="website link (optional)"
                      value={this.props.url}
                      onChange={this.changeURL} />
                  </fieldset>
                  </div>



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