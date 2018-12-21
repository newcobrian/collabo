import React from 'react';
import { connect } from 'react-redux';
import { FILE_ICON_MAP } from '../constants';

const AttachmentIcon = props => {
	var re = /(?:\.([^.]+))?$/;
	let extension = re.exec(props.filename)[1]
	let icon = (extension && FILE_ICON_MAP[extension]) ? FILE_ICON_MAP[extension] : FILE_ICON_MAP['default']
	return (
		<img className="opa-30 koi-ico --24 mrgn-right-xs" src={icon}/>
	)
}

export default AttachmentIcon