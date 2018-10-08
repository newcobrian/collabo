import React from 'react';

const LoadingSpinner = props => {
	return (
		<div className="loading-module flx flx-col flx-center-all co-type-body fill--red">
          <div className="loader-wrapper flx flx-col flx-center-all">
            <div className="v2-type-body2 color--white">{props.message}</div>
          </div>
        </div>
	)
}

export default LoadingSpinner;