import React from 'react'
import { Link, browserHistory } from 'react-router'

const ErrorPage = props => {
	return (
        <div className="error-page flx flx-col flx-center-all ta-center">
          <div className="co-logo large-logo mrgn-bottom-lg mrgn-top-md">
            <img className="center-img" src="/img/logomark.png"/>
          </div>
          <div className="mrgn-bottom-md color--white co-type-body">{ props.message ? props.message : 'Sorry, we don\'t know what happened'}
          </div>
          <Link className="co-type-body color--tertiary" onClick={() => browserHistory.goBack()}>Go back</Link> <span className="co-type-body color--white">or</span> <Link className="co-type-body color--tertiary" to='/'>Go to the homepage</Link>
        </div>
	)
}

export default ErrorPage