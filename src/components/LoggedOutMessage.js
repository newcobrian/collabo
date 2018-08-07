import React from 'react';
import { Link } from 'react-router';

const LoggedOutMessage = props => {
	return (
	   <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
        <div className="xiao-img-wrapper mrgn-bottom-sm">
          <img className="center-img" src="/img/xiaog.png"/>
        </div>
        <div className="mrgn-bottom-md">Some cool marketing copy goes here</div>
          
        <Link to="/register" className="">
          <div className="vb vb--light vb--intro--register fill--primary color--white flx flx-row flx-center-all ta-center bx-shadow">
            <div className="flx-grow1">JOIN NOW</div>
            <i className="material-icons md-32 color--white flex-item-right mrgn-left-sm DN">flight_takeoff</i>
          </div>
        </Link>
        <div className="flx flx-row flx-align-center v2-type-body1 mrgn-top-md">
          <Link to="/login" className="color--primary">
            login
          </Link>
        </div>
      </div>       
    )
}

export default LoggedOutMessage