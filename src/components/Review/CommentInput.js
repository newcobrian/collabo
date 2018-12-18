import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { uniq } from 'lodash';
import * as Actions from '../../actions';
import * as Constants from '../../constants'
import { checkAttachmentsCompleted } from '../../helpers'
import ProfilePic from './../ProfilePic';
import ProxyImage from './../ProxyImage'
import ListErrors from './../ListErrors'
import Textarea from 'react-textarea-autosize';
import { MentionsInput, Mention } from 'react-mentions'
import Dropzone from 'react-dropzone'
import Firebase from 'firebase'
// import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';

const UploadList = props => {
  if (props.attachments) {
    return (
      <ul className="w-100">
        {
          props.attachments.map((file, index) => (
            <li className="attachment-row ta-left w-100 fill--white koi-type-caption flx flx-row flx-align-center flx-just-start" key={index}>
              <Link onClick={props.onRemove(index)} className="koi-ico --16 icon--remove color--utsuri opa-50 mrgn-right-xs"></Link><div>{file.name} - progress: {file.progress}%</div>
            </li>
          ))
        }
      </ul>
    
    )
  }
  else return null
}

class CommentInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // body: toContentState('')
      body: props.comment ? props.comment.body : '',
      attachments: []
    };
    
    this.setBody = ev => {
      // this.setState({ body: editorState })
      this.setState({ body: ev.target.value })
    };

    this.onDrop = (acceptedFiles, rejectedFiles) => {
      const uploadAttachment = (attachmentId, file) => {
        const storageRef = Firebase.storage().ref();
        const metadata = {
          contentType: file.type
        }
        let that = this
        const uploadTask = storageRef.child('attachments/' + attachmentId).put(file, metadata);
        uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            let attachmentObject = Object.assign({}, {attachmentId: attachmentId}, {progress: progress})

            for (let i = 0; i < that.state.attachments.length; i++) {
              if (that.state.attachments[i].attachmentId === attachmentId) {
                that.state.attachments[i].progress = progress
                break;
              }
            }
            that.setState({attachments: that.state.attachments})
          }, 
        function(error) {
            console.log(error.message)
            Firebase.database().ref(Constants.ATTACHMENTS_PATH + '/' + attachmentId).remove()
        }, function() {
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            let attachmentObject = {
              link: downloadURL,
              type: file.type,
              size: file.size,
              userId: that.props.authenticated,
              lastModified: Firebase.database.ServerValue.TIMESTAMP
            }

            let attachmentUpdates = {}
            
            attachmentUpdates[Constants.ATTACHMENTS_PATH + '/' + attachmentId] = attachmentObject
            Firebase.database().ref().update(attachmentUpdates)

            for (let i = 0; i < that.state.attachments.length; i++) {
              if (that.state.attachments[i].attachmentId === attachmentId) {
                that.state.attachments[i].progress = 100
                that.state.attachments[i].link = downloadURL
                break;
              }
            }
            that.setState({attachments: that.state.attachments})
          });
        })
      }

      if (acceptedFiles) {
        let subArray = []
        for(let i = 0; i < acceptedFiles.length; i++) {
          let attachmentId = Firebase.database().ref(Constants.ATTACHMENTS_PATH).push().key  

          uploadAttachment(attachmentId, acceptedFiles[i])

          let attachmentObject = Object.assign({}, 
            {name: acceptedFiles[i].name}, 
            {attachmentId: attachmentId}, 
            {type: acceptedFiles[i].type}, 
            {size: acceptedFiles[i].size} )

          this.state.attachments = this.state.attachments.concat(attachmentObject)
        }
        this.setState({ attachments: this.state.attachments })
      }
    }

    this.onRemove = removeIndex => ev => {
      let arr = (this.state.attachments || []).filter(function(item, index) { 
        return index !== removeIndex
      })
      this.setState({ attachments: arr })
    }
 
    this.createComment = ev => {
      ev.preventDefault();
      this.setState({ errors: null })
      if (!checkAttachmentsCompleted(this.state.attachments)) {
        // this.setState({ })
        this.setState({ errors: ['Please wait for all attachments to finish uploading']})
      }
      else if (this.state.body !== '') {
        // clean the comment body for @ mentions markup
        let pattern = /\B@[$][|][{][a-z0-9_-]+(\1)[}][|][$]/gi;
        const commentBody = ''.concat(this.state.body.replace(/\B@[$][|][{]([a-z0-9_-]+)[}][|][$]/gi, "@$1"))
        const commentAttachments = [].concat(this.state.attachments)
        this.setState({ body: '', attachments: [] });

        // if theres a commentId already, then just update the comment
        if (this.props.commentId) {
          this.props.onThreadCommentUpdate(this.props.authenticated, this.props.commentObject, commentBody, this.props.threadId, this.props.org, this.props.commentId, this.props.parentId, commentAttachments);
          this.props.toggleShowEdit()
        }
        // otherwise this is a new comment, create it
        else {
          console.log(commentAttachments)
          this.props.onThreadCommentSubmit(this.props.authenticated, this.props.type, this.props.commentObject, commentBody, this.props.threadId, this.props.project, this.props.org, this.props.parentId, commentAttachments);
        }

        // const links = getLinks(commentBody).filter((l) => isGoogleDocLink(l));
        // const ids = [];
        // if (links && links.length > 0) {
        //   links.forEach(link => {
        //     const fileId = getFileId(link);
        //     if (fileId) {
        //       ids.push(fileId);
        //     }
        //   });
        // }
        // if (ids.length > 0) {
        //   const newIds = uniq(ids);
        //   if (newIds.length > 0) {
        //     this.props.updateGoogleDocsChanges(newIds.map((id) => ({
        //       from: 'ui',
        //       userInfo: this.props.userInfo,
        //       threadId: this.props.threadId,
        //       fileId: id,
        //       added: (new Date()).toString()
        //     })), this.props.threadId)  
        //   }
        // }
      }
    }
  }

  render() {
    return (
      <div className="flx flx-col w-100">
        <form className="comment-wrapper comment-form flx flx-row flx-just-center" onSubmit={this.createComment}>

              {/*<Textarea className="comment-input font--beta input--overline w-100"
                placeholder="Add a comment..."
                value={this.state.body}
                onChange={this.setBody}
                rows="1"
                cols="10"
                wrap="hard">
              </Textarea>*/}

              <MentionsInput 
                className="comment-input co-type-body input--overline w-100 fill--white"
                rows="2"
                cols="2"
                wrap="hard"
                placeholder="Reply..."
                value={this.state.body} 
                onChange={this.setBody}
                displayTransform={id => `@${id}`}
                markup='@$|{__display__}|$'
                >

                  <Mention
                    trigger="@"
                    data={this.props.usersList || []}
                    appendSpaceOnAdd={true}
                    renderSuggestion={(suggestion, search, highlightedDisplay) => (
                      <div className="user">@{highlightedDisplay}</div>
                    )}
                  />
              </MentionsInput>

              <div className="comment-attachment flx flx-row flx-align-center flx-just-end">
                <Dropzone onDrop={this.onDrop} className="h-100">
                    <div className="koi-ico --24 ico--addfile color--utsuri opa-50"></div>
                </Dropzone>

              </div>
              <ListErrors errors={this.state.errors} />

              <button className="koi-comment-post-button flx-item-right fill--white color--seaweed brdr-color--seaweed" onClick={this.createComment}>
                Post
              </button>
        </form>

        <UploadList attachments={this.state.attachments} onRemove={this.onRemove} />
      </div>
    );
  }
}

export default connect(null, Actions)(CommentInput);