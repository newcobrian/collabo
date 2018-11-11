import React from 'react';

const LoadingSpinner = props => {
	return (
		<div className="loading-module w-100 flx flx-col flx-center-all ta-center h-100 fill--mist color--black">
			<div className="loading-koi mrgn-bottom-md">
			  <img className="center-img" src="/img/loading-graphic.png"/>
			</div>
			<div className="w-100 ta-center co-type-body">Loading...</div>
        </div>
	)
}

export default LoadingSpinner;