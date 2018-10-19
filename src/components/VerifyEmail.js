import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link } from 'react-router';
import LoadingSpinner from './LoadingSpinner';
import LoggedOutMessage from './LoggedOutMessage';
import ErrorPage from './ErrorPage';

const mapStateToProps = state => ({
  ...state.acceptInvite,
  appName: state.common.appName,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class VerifyEmail extends React.Component {
  constructor() {
    super()
  }

  componentDidMount() {
    this.props.loadInvite(this.props.authenticated, this.props.params.iid, this.props.userInfo);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'accept invite'});
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

    if (!authenticated || !userInfo) {
      return (
        <LoggedOutMessage />        
      )
    }
    if (loadInviteError) {
      return (
        <ErrorPage message={ errorMessage ? errorMessage : 'Sorry, we couldn\'t find this invite.'} />
      )
    }
    if (!invite) {
      return (
        <LoadingSpinner message="Loading invite" />
      );
    }
    if (inviteType === Constants.PROJECT_TYPE && invite.recipientId !== authenticated) {
      return (
          <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
            <div className="co-logo large-logo mrgn-bottom-lg mrgn-top-md">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
            <div className="mrgn-bottom-md color--white co-type-body">Sorry, this invite was sent to a different user. 
            </div>
            <Link className="co-type-body color--tertiary" to='/'> Go to homepage</Link>
          </div>
        )
    }
    // orgInvites need orgId and recipientEmail
    if (inviteType === Constants.ORG_TYPE && (!invite.senderId || !invite.recipientEmail ||
    !invite.orgId)) {
      return (
        <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
          <div className="co-logo large-logo mrgn-bottom-lg mrgn-top-md">
            <img className="center-img" src="/img/logomark.png"/>
          </div>
          <div className="mrgn-bottom-md color--white co-type-body">Sorry, we couldn't find this invite.
          </div>
          <Link className="co-type-body color--tertiary" to='/'> Go to homepage</Link>
        </div>
      )
    }
    // check that org invite was sent to this user's email address
    if (inviteType === Constants.ORG_TYPE && (!userInfo || invite.recipientEmail !== userInfo.email)) {
      return (
        <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
          <div className="co-logo large-logo mrgn-bottom-lg mrgn-top-md">
            <img className="center-img" src="/img/logomark.png"/>
          </div>
          <div className="mrgn-bottom-md color--white co-type-body">Sorry, this invite was sent to a different email address. 
          </div>
          <Link className="co-type-body color--tertiary" to='/'> Go to homepage</Link>
        </div>
      )
    }

    if (inviteType === Constants.ORG_TYPE) {
      const handleClick = ev => {
        ev.preventDefault();
        
        this.props.acceptOrgInvite(this.props.authenticated, this.props.userInfo.email, this.props.params.iid)
      };
      return (
        <div>
          <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
            
            <div className="co-logo large-logo mrgn-top-md">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
            <div className="co-logotype w-100 mrgn-top-lg mrgn-bottom-lg">
              <img className="center-img" src="/img/logotype.png"/>
            </div>

            <div className="brdr-all b--tertiary pdding-all-lg flx flx-col flx-center-all">
              <div className="co-type-h3 color--white mrgn-bottom-sm">
                {sender.username} invited you to join their team "{invite.orgName}"
              </div>
              <div
                className="vb fill--tertiary max-300 vb--wide mrgn-top-md color--black mrgn-bottom-md"
                type="button"
                disabled={this.props.inProgress}
                >
                    Accept
              </div>
              <Link className="co-type-body color--white" to='/'>No thanks</Link>
            </div>
            
          </div>
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
        </div>

      )
    }
    // else this is a project invite error
    else {
      return (
       <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
          <div className="co-logo large-logo mrgn-bottom-lg mrgn-top-md">
            <img className="center-img" src="/img/logomark.png"/>
          </div>
          <div className="mrgn-bottom-md color--white co-type-body">Sorry, we couldn't find this invite.
          </div>
          <Link className="co-type-body color--tertiary" to='/'> Go to homepage</Link>

        </div>
      )
    }
  }
}

export default connect(mapStateToProps, Actions)(VerifyEmail)