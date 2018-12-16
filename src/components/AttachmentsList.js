import React from 'react';
import * as Constants from '../constants';
import DisplayTimestamp from './DisplayTimestamp';

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
						<a href={file.link}>Link</a>
					</li>
				))
			}
			</div>
		)
	}
	else return null
}

export default AttachmentsList