import React from 'react';
import { Link } from 'react-router'

const InvalidOrg = props => {
	return (
		<div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">You don't have permission to view this org</div>
          <Link to={'/'}>Go Home</Link>

        </div>
	)
}

export default InvalidOrg