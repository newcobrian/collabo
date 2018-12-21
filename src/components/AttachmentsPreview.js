import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

const AttachmentsPreview = props => {
  const DeleteAttachment = props => {
    const handleClick = attachmentId => ev => {
      props.onDeleteFile(props.attachmentId)
    }
    if (props.uploaderId === props.authenticated) {
      return (
        <Link className="flx-item-right koi-ico --16 icon--remove color--utsuri opa-60" onClick={handleClick(props.file.attachmentId)}></Link>
      )
    }
    else return null
  }

  if (props.attachments) {
    return (
      <ul className="w-100 mrgn-top-sm">
        {
          Object.keys(props.attachments || {}).map(function (attachmentId) {
            if (props.attachments && props.attachments[attachmentId]) {
              let attachmentLink = (props.attachments && props.attachments[attachmentId] && props.attachments[attachmentId].link) ? props.attachments[attachmentId].link : null
              let attachmentName = (props.attachments && props.attachments[attachmentId] && props.attachments[attachmentId].name) ? props.attachments[attachmentId].name : ''
              return  (
                <li className="attachment-row brdr-all ta-left w-100 fill--white flx flx-row flx-align-center flx-just-start" key={attachmentId}>
                  <div className="koi-ico --24 ico--file color--utsuri opa-30 mrgn-right-xs"></div>
                  <Link to={attachmentLink} target="_blank" className="koi-type-caption color--seaweed">{attachmentName}</Link>
                  <DeleteAttachment 
                    attachmentId={attachmentId}
                    authenticated={props.authenticated} 
                    uploaderId={props.uploaderId}
                    file={props.attachments[attachmentId]} 
                    onDeleteFile={props.onDeleteFile} />
                </li>
              )
            }
          })
        }
      </ul>
    
    )
  }
  else return null
}

export default AttachmentsPreview