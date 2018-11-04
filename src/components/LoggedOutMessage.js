import React from 'react';
import { Link } from 'react-router';

const LoggedOutMessage = props => {
	return (
    <div>
	   <div className="home-page page-common flx flx-col flx-just-start flx-align-center ta-center fill--pond">
        
          
          <div className="koi-home-page-wrapper w-100 flx flx-col">
            <div className="koi-home-hero-wrapper w-100 flx flx-col">
              <Link to="/login" className="login brdr-color--utsuri color--utsuri">Login</Link>
              <div className="hero-logotext color--black">Koi</div>
              <div className="hero-tagline color--black">
                A place for deep team discussion
              </div>
              <div className="hero-blurb color--black ta-left">
                Koi is a collaboration tool replacing email as the place
                for long-form threaded discussion requiring more time,
                structure and critical thinking than chat. Where email
                is private and unorganized, Koi promotes transparency
                across the entire workplace and organizes discussion into topics and groups.
              </div>
              <Link to="/register"
                className="flx flx-col flx-center-all koi-button-fancy-wrapper home-register-button border--seaweed">
                  <div className="koi-button-fancy-outer">
                  </div>
                  <div className="koi-button-fancy-inner">
                  </div>
                  <div className="koi-button-fancy-text color--seaweed">
                    Join Koi
                  </div>
              </Link>
              <div className="lily1"></div>
            </div>
            <div className="koigroup">
              <div className="lily2"></div>
              <div className="lilyflower"></div>
              <div className="three-points">
                Focus<br/>
                Transparency<br/>
                Organization
              </div>
            </div>
        </div>  

         {/*} <Link to="/register" className="vb fill--tertiary color--primary vb--round vb--wide">
            Sign up
          </Link>
          <Link to="/login" className="color--white flx flx-row flx-align-center co-type-body mrgn-top-md vb--round vb--wide">
              Login
          </Link>*/}

      </div>  
      <div className="footer color--black fill--pond flx flx-col flx-center-all flx-item-bottom co-type-data pdding-top-lg">
        <div className="koi-type-body color--black opa-70 mrgn-bottom-md">
          &copy; 2018 Futurehumans, LLC All Rights Reserved
        </div>
        <div className="flx flx-row flx-center-all mrgn-bottom-lg">
          <Link to="/terms.html" target="blank" className="koi-type-body color--black opa-70">
            Terms of Service
          </Link>
          <div className="middle-dot color--white flx-hold">&middot;</div>
          <Link to="/privacy.html" target="blank" className="koi-type-body color--black opa-70">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
    )
}

export default LoggedOutMessage