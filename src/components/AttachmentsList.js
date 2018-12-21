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
			<Link onClick={handleClick(props.file.attachmentId)}>Delete</Link>
		)
	}
	else return null
}

const AttachmentsList = props => {
	if (props.attachments && props.attachments.length > 0) {
		return (
			<div>
			{
				props.attachments.map((file, index) => (
					<li className="attachment-row brdr-all ta-left w-100 fill--white flx flx-row flx-align-center flx-just-start" key={index}>
						<AttachmentIcon filename={file.name} />
						<Link to={file.link} target="_blank" className="koi-type-caption color--seaweed">{file.name}</Link>
						<DisplayTimestamp timestamp={file.lastModified} />
						<div>{(props.orgUserData && props.orgUserData[file.userId] ? props.orgUserData[file.userId].username : '')}</div>
						<div>{file.size} bytes</div>
						<div><DeleteButton authenticated={props.authenticated} file={file} onDeleteFile={props.onDeleteFile} /></div>
					</li>
				))
			}
			</div>
		)
	}
	else return null
}

export default AttachmentsList