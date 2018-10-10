import React from 'react';
import { Link } from 'react-router';

const LoggedOutMessage = props => {
	return (
    <div>
	   <div className="home-page page-common flx flx-col flx-center-all flx-align-center flx-just-start ta-center">
        
          <div className="co-logo large-logo mrgn-top-md">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
            <div className="co-logotype w-100 mrgn-top-lg">
              <img className="center-img" src="/img/logotype.png"/>
            </div>
          <div className="co-type-tagline w-100 mrgn-bottom-lg mrgn-top-lg color--white">Work Together in Harmony</div>
            
          <Link to="/register" className="vb fill--tertiary color--primary vb--round vb--wide">
            Sign up
          </Link>
          <Link to="/login" className="color--white flx flx-row flx-align-center co-type-body mrgn-top-md vb--round vb--wide">
              Login
          </Link>

      </div>  
      <div className="footer color--white flx flx-col flx-center-all flx-item-bottom co-type-data pdding-top-lg">
        <div className="co-type-data color--white opa-70 mrgn-bottom-md">
          &copy; 2018 Futurehumans, LLC All Rights Reserved
        </div>
        <div className="flx flx-row flx-center-all mrgn-bottom-lg">
          <Link to="/terms.html" target="blank" className="color--white opa-70">
            Terms of Service
          </Link>
          <div className="middle-dot color--white flx-hold">&middot;</div>
          <Link to="/privacy.html" target="blank" className="color--white opa-70">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
    )
}

export default LoggedOutMessage