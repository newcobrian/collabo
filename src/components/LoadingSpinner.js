import React from 'react';

const LoadingSpinner = props => {
	return (
		<div className="loading-module flx flx-col flx-center-all co-type-body fill--primary">
			<div className="co-logotype w-100 mrgn-top-lg">
			  <img className="center-img" src="/img/logotype.png"/>
			</div>
	          <div className="loader-wrapper flx flx-col flx-center-all">
	            <div className="co-type-data color--white">{props.message}</div>
	          </div>
        </div>
	)
}

export default LoadingSpinner;