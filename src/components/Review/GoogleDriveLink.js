import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
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

  signIn = () => {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  onSelectPermission = (e, id) => {
    const { updateGoogleDocsPermission, updateGoogleDocsMessage } = this.props;
    const selected = e.target.value;
    if (selected) {
      const type = selected.split('-')[0];
      const role = selected.split('-')[1];
      const request = window.gapi.client.drive.permissions.create({
        fileId: id,
        role,
        type
      });
      request.execute((data) => {
        updateGoogleDocsPermission(id, true);
        updateGoogleDocsMessage(id, "Great! I've updated the permissions on");
      })
    }
  }

  render() {
    const { onClose, isConfirmMessageVisible, isGoogleAuthored, content, googleDocs } = this.props;
    const fileIds = getLinks(content).filter((l) => isGoogleDocLink(l)).map((l) => getFileId(l));
    if (fileIds.length < 1) {
      return null;
    }
    return (
      <div className='co-googledoc-wrapper mrgn-top-sm pdding-left-lg pdding-right-lg'>
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
              return <p key={i}>I couldn’t find that file in Google Drive. Do I have the correct Google Drive account information for you?</p>;
            }
            return (
              <div key={i}>
                <a href={googleDocs[id].meta.webViewLink} target="_blank">
                  <p><img src={googleDocs[id].meta.iconLink} /> {googleDocs[id].meta.name}</p>
                  <img src={googleDocs[id].meta.thumbnailLink} style={{ border: "1px solid black" }}/>
                </a>
                {
                  !googleDocs[id].meta.shared &&
                  <div>
                    <p>It looks like '{googleDocs[id].meta.name}' isn't viewable by everyone here. Use the options below if you'd like to change who has access to the file.</p>
                    <div className='select-box'>
                      <select className="color--black" onChange={(e) => this.onSelectPermission(e, id)}>
                        <option value="">Select a permission</option>
                        {/* <option value="" disabled>--Share directly with the recipient--</option>
                        <option value="user-reader">  and allow them to view</option>
                        <option value="user-commenter">  and allow them to comment</option>
                        <option value="user-writer">  and allow them to edit</option> */}
                        <option value="" disabled>--Share to anyone with the link--</option>
                        <option value="anyone-reader">  and allow them to view</option>
                        <option value="anyone-commenter">  and allow them to comment</option>
                        <option value="anyone-writer">  and allow them to edit</option>
                      </select>
                      <i className="material-icons org-arrow flx-item-right">expand_more</i>
                    </div>
                  </div>
                }
                {
                  googleDocs[id].message &&
                  <p>{googleDocs[id].message} '{googleDocs[id].meta.name}'</p>
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