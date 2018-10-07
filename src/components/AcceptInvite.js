import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
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

  componentDidMount() {
    this.props.loadInvite(this.props.authenticated, this.props.params.iid, this.props.userInfo);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);
  }

  componentWillUnmount() {
    this.props.unloadInvite(this.props.params.iid);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.props.unloadInvite(this.props.params.pid);
      this.props.loadInvite(this.props.authenticated, nextProps.params.pid);
    }
  }

  render() {
    const { authenticated, invite, loadInviteError, errorMessage, inviteType, userInfo, sender } = this.props;

    if (!authenticated) {
      return (

         <div className="koi-view ta-left flx flx-col flx-center-all w-100">
              <div className="ta-left flx flx-col brdr-all bx-shadow color--black fill--white pdding-all-lg">
                <div className="co-type-page-title">You've been invited to join a team on Koi.</div>
                Login or signup to accept.
                <div className="flx flx-row flx-just-end mrgn-top-md">
                  <Link className="vb fill--secondary color--white mrgn-right-sm" to='/login'>Login</Link>
                  <Link className="vb fill--gray color--black" to='/register'>Sign up</Link>
                </div>
              </div>
          </div>     

      )
    }
    if (loadInviteError) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">{ errorMessage ? errorMessage : 'Sorry, we couldn\'t find this invite.'}
            <Link to='/'> Go to homepage</Link>
          }
          </div>
        </div>
      )
    }
    if (!invite) {
      return (
        <LoadingSpinner message="Loading invite" />
      );
    }
    if (inviteType === Constants.PROJECT_TYPE && invite.recipientId !== authenticated) {
      return (
          <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
            <div className="xiao-img-wrapper mrgn-bottom-sm">
              <img className="center-img" src="/img/xiaog.png"/>
            </div>
            <div className="mrgn-bottom-md">Sorry, this invite was sent to a different user. 
              <Link to='/'> Go to homepage</Link>
            </div>
          </div>
        )
    }
    // orgInvites need orgId and recipientEmail
    if (inviteType === Constants.ORG_TYPE && (!invite.senderId || !invite.recipientEmail ||
    !invite.orgId)) {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this invite.
            <Link to='/'> Go to homepage</Link>
          </div>
        </div>
      )
    }
    // check that org invite was sent to this user's email address
    if (inviteType === Constants.ORG_TYPE && (!userInfo || invite.recipientEmail !== userInfo.email)) {
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

    if (inviteType === Constants.ORG_TYPE) {
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
                              {sender.username} invited you to join their team "{invite.orgName}"
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
    // else this is a project invite error
    else {
      return (
        <div className="error-module flx flx-col flx-center-all ta-center v2-type-body3 color--black">
          <div className="xiao-img-wrapper mrgn-bottom-sm">
            <img className="center-img" src="/img/xiaog.png"/>
          </div>
          <div className="mrgn-bottom-md">Sorry, we couldn't find this invite.
            <Link to='/'> Go to homepage</Link>
          </div>
        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(AcceptInvite)