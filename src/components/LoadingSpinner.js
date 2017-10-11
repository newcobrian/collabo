import React from 'react';

const LoadingSpinner = props => {
	return (
		<div className="loading-module flx flx-col flx-center-all v2-type-body3 fill--black">
          <div className="loader-wrapper flx flx-col flx-center-all fill--black">
            <div className="loader-bird"></div>
            <div className="loader">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
            <div className="v2-type-body2 color--white">{props.message}</div>
          </div>
        </div>
	)
}

export default LoadingSpinner;