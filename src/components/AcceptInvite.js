import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import { Link } from 'react-router';
import LoadingSpinner from './LoadingSpinner';

const mapStateToProps = state => ({
  ...state.acceptInvite,
  appName: state.common.appName,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class AcceptInvite extends React.Component {
  constructor() {
    super()
  }

  componentWillMount() {
    this.props.loadInvite(this.props.authenticated, this.props.params.iid);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.props.unloadInvite(this.props.params.pid);
      this.props.loadInvite(this.props.authenticated, nextProps.params.pid);
    }
  }

  render() {
    const invite = this.props.invite;

    if (!this.props.authenticated) {
      return (
        <div>
         <div className="hero-container logged-out flx flx-col">
          <div className="marketing-page navigation-bar flx flx-row flx-align-center flx-just-end pdding-right-md ">
              <Link to="/login" className="nav-module nav-feed flx flx-center-all vb vb--sm fill--white color--black">
                <div className="nav-text">
                  Log in
                </div>
              </Link>

              <Link to="/register" className="nav-module nav-feed flx flx-center-all vb vb--sm color--white">
                <div className="nav-text">
                  Sign up
                </div>
              </Link>
          </div>
         </div>
         <div className="hero-container">
                <div className="create-content flx flx-col flx-center-all ta-center">
              
              <div className="flx flx-col flx-center-all create-wrapper">
            
                      <div className="create-form-wrapper form-wrapper ta-left flx flx-col-left bx-shadow">
                        
                        HEY MAN <Link to='/login'> LOGIN </Link> TO ACCEPT THIS INVITE <Link to='/register'> ....or Sign up</Link>

                      </div>
                </div>

                <div className="v2-type-body2 mrgn-top-lg ta-center DN">
                  <div>“Travel and change of place impart new vigor to the mind.”</div>
                  <div>– Seneca</div>
                </div>  

              </div>
              <div className="hero-bg">
                <div className="hero-map opa-20">
                </div>
                <div className="hero-grid opa-10">
                </div>
            </div>

            

          </div>  
        </div>
      )
    }
    if (!invite) {
      return (
        <LoadingSpinner message="Loading invite" />
      );
    }
    if (invite && (!invite.senderId || !invite.recipientEmail ||
    !invite.orgId || !invite.orgName)) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this invite.</div>
        </div>
      )
    }
    if (!this.props.userInfo || invite.recipientEmail !== this.props.userInfo.email) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, this invite was sent to a different email address. 
            <Link to='/'> Go to homepage</Link>
          </div>
        </div>
      )
    }

    const handleClick = ev => {
      ev.preventDefault();
      
      this.props.acceptInvite(this.props.authenticated, this.props.userInfo.email, this.props.params.iid)
    };

    return (
      <div>
        <div className="flx flx-col flx-center-all page-common editor-page create-page">
  {/**}     
          <div>
                <Script
                  url={url}
                  onCreate={this.handleScriptCreate.bind(this)}
                  onError={this.handleScriptError.bind(this)}
                  onLoad={this.handleScriptLoad.bind(this)}
                /> 
            </div> 
            <div ref="GMap"></div>**/}
          

            {/* CONTAINER - START */}
              <div className="hero-container">
                <div className="page-title-wrapper center-text DN">
                      <div className="v2-type-page-header">Create a new Project</div>
                      <div className="v2-type-body2 opa-60">This could be a list of top spots or plans for an upcoming trip</div>
                    </div>
                <div className="create-content flx flx-col flx-center-all ta-center">
              
              <div className="flx flx-col flx-center-all create-wrapper">
            
                      <div className="create-form-wrapper form-wrapper ta-left flx flx-col-left bx-shadow">
                        
                        <div>
                          <div className="v2-type-page mrgn-bottom-sm">
                            {this.props.sender.username} invited you to join their team "{invite.orgName}"
                          </div>

                    

                    
                              
                            <div
                              className="vb vb--create w-100 mrgn-top-md color--white fill--primary"
                              type="button"
                              disabled={this.props.inProgress}
                              onClick={handleClick}>
                                <div className="flx flx-row flx-center-all ta-center">
                                  <div className="flx-grow1 mrgn-left-md">Accept</div>
                                  <img className="flx-item-right" src="/img/icons/icon32_next.png"/>
                                </div>
                            </div>
                            <Link to='/'>or Cancel</Link>
                      </div>
                  </div>
                </div>

                <div className="v2-type-body2 mrgn-top-lg ta-center DN">
                  <div>“Travel and change of place impart new vigor to the mind.”</div>
                  <div>– Seneca</div>
                </div>  

              </div>
              <div className="hero-bg">
                <div className="hero-map opa-20">
                </div>
                <div className="hero-grid opa-10">
                </div>
            </div>

            

          </div>  
          {/* END CONTAINER */}
          

          </div>
          

      </div>


    )
  }
}

export default connect(mapStateToProps, Actions)(AcceptInvite)