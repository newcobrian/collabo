import React from 'react';
import { Link } from 'react-router'

const InvalidOrg = props => {
	return (
		<div>
          You don't have permission to view this team. <Link to='/'>Go Home</Link>
        </div>
	)
}

export default InvalidOrg