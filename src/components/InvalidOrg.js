import React from 'react';
import { Link } from 'react-router'

const InvalidOrg = props => {
	return (
		<div className="home-page page-common page-register fill--pond flx flx-col flx-just-start">
		  <div className="koi-view ta-left flx flx-col pdding-top-lg">
		      <div className="register-msg flx flx-col">
		        <div className="koi-big-header mrgn-bottom-md color--utsuri opa-30">Oops...</div>
		        <div className="co-post-title mrgn-bottom-md color--black">
		          The team you're looking for doesn't actually exist...
		        </div>
		        <Link className="text-hover color--seaweed mrgn-top-sm" to='/'>Go back to the homepage</Link>
		      </div>
		    </div>
		</div>

	)
}

export default InvalidOrg