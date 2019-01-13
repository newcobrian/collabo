import React from 'react';
import * as Constants from '../constants';
import DisplayTimestamp from './DisplayTimestamp';
import { Link } from 'react-router'
import AttachmentIcon from './AttachmentIcon';

const DeleteButton = props => {
	const handleClick = attachmentId => ev => {
		props.onDeleteFile(attachmentId)
	}

	if (props.file && props.authenticated === props.file.userId) {
		return (
			<Link className="flx-item-right koi-ico --16 icon--remove color--utsuri opa-60 mrgn-left-sm" onClick={handleClick(props.file.attachmentId)}></Link>
		)
	}
	else return null
}

const AttachmentsList = props => {
	if (props.attachments && props.attachments.length > 0) {
		return (
			<div className="w-100">
			{
				props.attachments.map((file, index) => (
					<li className="attachment-row brdr-all ta-left w-100 fill--white flx flx-row flx-align-center flx-just-start" key={index}>
						<AttachmentIcon filename={file.name} />

						<div className="flx flx-col mrgn-left-sm">
							<div className="flx flx-row flx-align-center flx-just-start">
								<Link to={file.link} target="_blank" className="koi-type-body color--seaweed">{file.name}</Link>
							</div>
							<div className="koi-type-caption opa-60">
								Uploaded by {(props.orgUserData && props.orgUserData[file.userId] ? props.orgUserData[file.userId].username : '')}&nbsp;&#xb7;&nbsp;
								<DisplayTimestamp timestamp={file.lastModified} />
								&nbsp;&#xb7;&nbsp; {file.size} bytes
							</div>
						</div>
						
						<DeleteButton authenticated={props.authenticated} file={file} onDeleteFile={props.onDeleteFile} />

					</li>
				))
			}
			</div>
		)
	}
	else {
		return (
			<div className="koi-type-body opa-50 mrgn-top-md">
			No files
			</div>
		)
	}
}

export default AttachmentsList