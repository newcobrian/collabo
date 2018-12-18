import React from 'react';
import * as Constants from '../constants';
import DisplayTimestamp from './DisplayTimestamp';
import { Link } from 'react-router'

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
					<li key={index}>
						<div>{file.name}</div>
						<DisplayTimestamp timestamp={file.lastModified} />
						<div>Uploader: {(props.orgUserData && props.orgUserData[file.userId] ? props.orgUserData[file.userId].username : '')}</div>
						<div>Size: {file.size} bytes</div>
						<div><a href={file.link}>Link</a></div>
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