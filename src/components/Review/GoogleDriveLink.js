import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import superagent from 'superagent';
import { getLinks, isGoogleDocLink, getFileId } from '../../helpers';

const mapStateToProps = state => ({
  googleDocs: state.review.googleDocs,
  isGoogleAuthored: state.auth.isGoogleAuthored,
  isConfirmMessageVisible: state.review.isConfirmMessageVisible
});

class GoogleDriveLink extends React.Component {

  constructor (props) {
    super(props);
  }

  componentWillReceiveProps (nextProps) {
    const { isGoogleAuthored } = this.props;
    if (!isGoogleAuthored && nextProps.isGoogleAuthored) {
      this.props.showConfirmMessage();
    }
  }

  // watchFiles () {
  //   const links = this.getGoogleDriveLinks();
  //   links.forEach((link, i) => {
  //     const fileId = this.getFileId(link);
  //     const updates = {};
  //     if (!updates[fileId]) {
  //       const request = window.gapi.client.drive.files.watch({
  //         fileId: fileId,
  //         resource: {
  //           id: fileId,
  //           type: 'web_hook',
  //           address: 'https://f3066e15.ngrok.io/'
  //         }
  //       });
  //       request.execute((channel) => {
  //         console.log(channel);
  //         updates[fileId] = channel;
  //         if (i === links.length - 1){
  //           this.setState({
  //             updates
  //           });
  //         }
  //       })
  //     } else if (i === links.length - 1){
  //       this.setState({
  //         updates
  //       });
  //     }
  //   })
  // }

  signIn = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  render() {
    const { onClose, isConfirmMessageVisible, isGoogleAuthored, content, googleDocs } = this.props;
    const fileIds = getLinks(content).filter((l) => isGoogleDocLink(l)).map((l) => getFileId(l));
    if (fileIds.length < 1) {
      return null;
    }
    return (
      <div className='mrgn-top-sm pdding-left-lg pdding-right-lg fill--lighter-gray'>
        {
          isConfirmMessageVisible &&
          <p>Thanks, You are all set.</p>
        }
        {
          isGoogleAuthored && fileIds.map((id, i) => {
            if (!googleDocs || !googleDocs[id] || !googleDocs[id].meta) {
              return null;
            }
            if (googleDocs[id].meta.error) {
              return <p>I couldn’t find that file in Google Drive. Do I have the correct Google Drive account information for you?</p>;
            }
            return (
              <div key={i}>
                <a href={googleDocs[id].meta.webViewLink} target="_blank">
                  <p><img src={googleDocs[id].meta.iconLink} /> {googleDocs[id].meta.name}</p>
                  <img src={googleDocs[id].meta.thumbnailLink} style={{ border: "1px solid black" }}/>
                </a>
                {
                  !googleDocs[id].meta.shared &&
                  <p>It looks like {googleDocs[id].meta.name} isn't viewable by everyone here. Use the options below if you'd like to change who has access to the file.</p>
                }
              </div>
            )
          })
        }
        {
          !isConfirmMessageVisible && !isGoogleAuthored &&
          <div>
            <p className='color--primary'>Collabo can share your Google Drive files with your teammates and let you know when there are updates. Would you like to set this up?</p>
            <div className='flx flx-row flx-just-start'>
              <button
                className='vb vb--sm vb--outline fill--white mrgn-top-xs color--black padding-none mrgn-right-sm'
                onClick={this.signIn}>Yes, Allow</button>
              <button
                className='vb vb--sm vb--outline fill--white mrgn-top-xs color--black padding-none'
                onClick={onClose}>No, Not Now</button>
            </div>
          </div>
        }
        
      </div>
    );
  }
}

export default connect(mapStateToProps, Actions)(GoogleDriveLink);