import React from 'react'
import { Link, browserHistory } from 'react-router'

const ErrorPage = props => {
	return (

        <div className="home-page page-common page-register fill--pond flx flx-col flx-just-start">
          <div className="koi-view ta-left flx flx-col pdding-top-lg">
              <div className="register-msg flx flx-col">
                <div className="koi-big-header mrgn-bottom-md color--utsuri opa-30">:O</div>
                <div className="co-post-title mrgn-bottom-md color--black">
                  { props.message ? props.message : 'Sorry, we don\'t know what happened'}
                </div>
                <Link className="text-hover color--seaweed mrgn-top-sm mrgn-bottom-sm" onClick={() => browserHistory.goBack()}>Go back</Link>
                <Link className="text-hover color--seaweed mrgn-top-sm" to='/'>Go to the homepage</Link>
              </div>
            </div>
        </div>

	)
}

export default ErrorPage