import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../actions';
import { REVIEW_TYPE } from '../../constants'
import ProfilePic from './../ProfilePic';
import ProxyImage from './../ProxyImage'
import Textarea from 'react-textarea-autosize';
import { InstantSearch } from 'react-instantsearch/dom';
import { connectAutoComplete } from 'react-instantsearch/connectors';
import { Mention } from 'antd';
import 'antd/lib/mention/style/css';
import { connectSearchBox } from 'react-instantsearch-dom';

const { toContentState, toString } = Mention;

// const mapDispatchToProps = dispatch => ({
//   onSubmit: payload =>
//     dispatch({ type: 'ADD_COMMENT', payload })
// });

const mapStateToProps = state => ({
  userInfo: state.common.userInfo
});

const AsyncMention = ({ hits, refine, setBody, body }) => {
  // const changeBody = editorState => {
  //   setBody(toString(editorState))
  // }

  return (
    <Mention
      style={{ width: 500, height: 100 }}
      prefix="@"
      notFoundContent={'No suggestion'}
      placeholder="Add a comment here..."
      suggestions={hits.map(hit => hit.username)}
      onSearchChange={query => refine(query)}
      onChange={setBody}
      value={body}
      />
      )
}

// class AsyncMention extends React.Component {
//   constructor() {
//     super()
//     this.state = {
//       bodyContent: toContentState('hey dude')
//     }

//     this.updateBody = editorState => {
//       this.setState({body: editorState})
//     }
//   }

//   render() {
//     return (
//       <Mention
//         style={{ width: 500, height: 100 }}
//         prefix="@"
//         notFoundContent={'No suggestion'}
//         placeholder="Add a comment here..."
//         suggestions={this.props.hits.map(hit => hit.username)}
//         onSearchChange={query => this.props.refine(query)}
//         onChange={this.props.setBody}
//         value={this.state.bodyContent}
//         />
//     )
//   }
// }

const ConnectedAsyncMention = connectAutoComplete(AsyncMention);

class CommentInput extends React.Component {
  constructor() {
    super();
    this.state = {
      // body: toContentState('')
      body: ''
    };

    
    this.setBody = ev => {
      // this.setState({ body: editorState })
      this.setState({ body: ev.target.value })
    };
 
    this.createComment = ev => {
      ev.preventDefault();
      if (this.state.body !== '') {
        const commentBody = ''.concat(this.state.body);
        this.setState({ body: '' });
        this.props.onThreadCommentSubmit(this.props.authenticated, this.props.userInfo, this.props.type, this.props.commentObject, commentBody, this.props.threadId, this.props.project, this.props.org);
      }
      // ev.preventDefault();
      // let stringBody = ''.concat(toString(this.state.body))
      // if (stringBody !== '') {
      //   this.setState({ body: toContentState('') });
      //   this.props.onThreadCommentSubmit(this.props.authenticated, this.props.userInfo, this.props.type, this.props.commentObject, stringBody, this.props.threadId, this.props.project, this.props.org);
      // }
    }
  }

  render() {
    return (
      <form className="comment-wrapper comment-form flx flx-row flx-just-center flx-align-start" onSubmit={this.createComment}>

            {/*<InstantSearch
              appId="NFI90PSOIY"
              apiKey="03fbdcb4cee86d78bd04217626a3a52b"
              indexName="collabo-users"
            >
              <ConnectedAsyncMention setBody={this.setBody} body={this.state.body} />

            </InstantSearch>*/}

            <Textarea className="comment-input font--beta input--overline w-100"
              placeholder="Add a comment..."
              value={this.state.body}
              onChange={this.setBody}
              rows="1"
              cols="10"
              wrap="hard">
            </Textarea>

            <button className="comment-send vb vb--xs vb--outline fill--primary opa-100 color--white" onClick={this.createComment}>
              Post
              <i className="material-icons color--primary md-18 color--primary DN">send</i>
            </button>

            {/**<ProfilePic src={this.props.userInfo.image} className="user-image user-image-sm center-img" />

            **/}

        
      </form>
    );
  }
}

export default connect(mapStateToProps, Actions)(CommentInput);