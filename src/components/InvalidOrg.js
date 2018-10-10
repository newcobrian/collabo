import React from 'react';
import { Link } from 'react-router'

const InvalidOrg = props => {
	return (
		<div className="error-module flx flx-col flx-center-all ta-center color--white fill--primary">
          <div className="xiao-img-wrapper mrgn-bottom-lg opa-40">
            <img className="center-img" src="/img/logomark.png"/>
          </div>
          <div className="mrgn-bottom-md co-type-body">You don't have permission to access this team. You must find another pond to look at.</div>
          <Link className="color--tertiary co-type-body" to={'/'}>Return to homepage</Link>

        </div>
	)
}

export default InvalidOrg