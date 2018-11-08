import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import { Link } from 'react-router';
import LoadingSpinner from './LoadingSpinner';
import LoggedOutMessage from './LoggedOutMessage';
import ErrorPage from './ErrorPage';
import ListErrors from './ListErrors';
import ProfilePic from './ProfilePic';

const mapStateToProps = state => ({
  ...state.acceptOrgInvite,
  appName: state.common.appName,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class AcceptOrgInvite extends React.Component {
  constructor() {
    super()

    const updateFieldEvent =
        key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ACCEPT_ORG_INVITE_PAGE);

    this.changeUsername = updateFieldEvent('username');
    this.changeFullName = updateFieldEvent('fullName');
    this.changePassword = updateFieldEvent('password');

    this.changeImage = ev => {
      this.props.onUpdateCreateField('imageFile', ev.target.files[0], Constants.ACCEPT_ORG_INVITE_PAGE)
    }

    this.handleSubmit = ev => {
      ev.preventDefault()
      
      if (!this.props.username || this.props.username.length < 1) {
        this.props.createSubmitError('Please add your username', Constants.ACCEPT_ORG_INVITE_PAGE);
      }
      else if (!this.props.fullName || this.props.fullName.length < 1) {
        this.props.createSubmitError('Please add your full name', Constants.ACCEPT_ORG_INVITE_PAGE);
      }
      if (!this.props.authenticated) {
        if (!this.props.password || this.props.password < 6) {
          this.props.createSubmitError('Please add a password that is at least 6 characters', Constants.ACCEPT_ORG_INVITE_PAGE);
        }
      }
      else {
        let userData = Object.assign({}, 
          {username: this.props.username},
          {fullName: this.props.fullName}
        )
        if (this.props.image) userData.image = this.props.image

        let lowerCaseEmail = this.props.userInfo.email ? this.props.userInfo.email.toLowerCase() : ''
        this.props.acceptOrgInvite(this.props.authenticated, lowerCaseEmail, this.props.params.iid, userData, this.props.imageFile)
      }
    }
  }

  componentDidMount() {
    this.props.loadOrgInvite(this.props.authenticated, this.props.params.iid);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);

    this.props.loadNewOrgUserInfo(this.props.authenticated, Constants.ACCEPT_ORG_INVITE_PAGE)

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'accept org invite'});
  }

  componentWillUnmount() {
    this.props.unloadOrgInvite(this.props.params.iid);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.props.unloadOrgInvite(this.props.params.iid);
      this.props.loadOrgInvite(this.props.authenticated, nextProps.params.iid);
    }
  }

  render() {
    const { authenticated, invite, loadInviteError, errorMessage, inviteType, userInfo, sender, emailRegistered } = this.props;

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
    // if (emailRegistered) {
    //   return (
    //     <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
    //       <div className="co-logo large-logo mrgn-bottom-lg mrgn-top-md">
    //         <img className="center-img" src="/img/logomark.png"/>
    //       </div>
    //       <div className="mrgn-bottom-md color--white co-type-body">The email {invite.recipientEmail} has already been registered.
    //       </div>
    //       <Link className="co-type-body color--tertiary" to='/login'>Please login to accept this invite</Link>
    //     </div>
    //   )
    // }
    // orgInvites need orgId and recipientEmail
    else if (!invite.senderId || !invite.recipientEmail ||
    !invite.orgId) {
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
    // if user is logged out
    if (!authenticated || !userInfo) {
      // if invite was sent to a registered email, tell the user to login
      if (emailRegistered) {
        return (
          <div className="home-page page-common flx flx-col flx-align-center flx-just-start ta-center">
            <div className="co-logo large-logo mrgn-bottom-lg mrgn-top-md">
              <img className="center-img" src="/img/logomark.png"/>
            </div>
            <div className="mrgn-bottom-md color--white co-type-body">{sender.username} invited you to join their team "{invite.orgName}"
            </div>
            <Link className="co-type-body color--tertiary" to='/login'>Login to accept</Link>
          </div>
        )
      }
      // otherwise the email address has not registerd, make the user sign up and accept the invite
      else {
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

              <form>
                <fieldset className="field-wrapper">
                  <label>Email Address</label>
                  {invite.recipientEmail}
                </fieldset>

                <fieldset className="field-wrapper">
                  <label>Choose a username for this team</label>
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="text"
                    placeholder="Username" 
                    required
                    value={this.props.username}
                    onChange={this.changeUsername} />
                </fieldset>

                <fieldset className="field-wrapper">
                  <label>What's your full name?</label>
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="fullName"
                    placeholder="Full Name"
                    required
                    value={this.props.fullName}
                    onChange={this.changeFullName} />
                </fieldset>

                <fieldset className="field-wrapper">
                  <label>Choose a password (at least 6 characters)</label>
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="text"
                    placeholder="Password" 
                    required
                    value={this.props.password}
                    onChange={this.changePassword} />
                </fieldset>

                <fieldset>
                  {this.props.image && 
                    <div className="profile-image flx flx-center-all">
                      <ProfilePic src={this.props.imageFile ? URL.createObjectURL(this.props.imageFile) : (this.props.image ? this.props.image : '')} className="center-img" />
                      </div>
                  }
                  <fieldset className="form-group">
                    <div className="upload-wrapper">
                      <div className="upload-overlay">Upload Image (optional)</div>
                      <div className="fileUpload">
                        <input
                        className="form-control upload-image-button"
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={this.changeImage} />

                      </div>
                    </div> 
                  </fieldset>
                </fieldset>

                <ListErrors errors={this.props.errors}></ListErrors>
              </form>

              <div
                className="vb fill--tertiary max-300 vb--wide mrgn-top-md color--black mrgn-bottom-md"
                type="button"
                disabled={this.props.inProgress}
                onClick={this.handleSubmit}
                >
                    Accept
              </div>
              <Link className="co-type-body color--white" to='/'>No thanks</Link>
            </div>
            
          </div>
        </div>
        )
      }
    }
    // else user is logged in already
    else {
      // check that org invite was sent to this user's email address and let them join the team
      if (invite.recipientEmail === userInfo.email) {
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

                <form>
                  <fieldset className="field-wrapper">
                    <label>What's your username?</label>
                    <input
                      className="input--underline edit-itinerary__name brdr-all"
                      type="text"
                      placeholder="Username" 
                      required
                      value={this.props.username}
                      onChange={this.changeUsername} />
                  </fieldset>

                  <fieldset className="field-wrapper">
                    <label>What's your full name?</label>
                    <input
                      className="input--underline edit-itinerary__name brdr-all"
                      type="fullName"
                      placeholder="Full Name"
                      required
                      value={this.props.fullName}
                      onChange={this.changeFullName} />
                  </fieldset>

                  <fieldset>
                    {this.props.image && 
                      <div className="profile-image flx flx-center-all">
                        <ProfilePic src={this.props.imageFile ? URL.createObjectURL(this.props.imageFile) : (this.props.image ? this.props.image : '')} className="center-img" />
                        </div>
                    }
                    <fieldset className="form-group">
                      <div className="upload-wrapper">
                        <div className="upload-overlay">Upload Image (optional)</div>
                        <div className="fileUpload">
                          <input
                          className="form-control upload-image-button"
                          type="file"
                          accept="image/jpeg,image/png,application/pdf"
                          onChange={this.changeImage} />

                        </div>
                      </div> 
                    </fieldset>
                  </fieldset>

                  <ListErrors errors={this.props.errors}></ListErrors>
                </form>

                <div
                  className="vb fill--tertiary max-300 vb--wide mrgn-top-md color--black mrgn-bottom-md"
                  type="button"
                  disabled={this.props.inProgress}
                  onClick={this.handleSubmit}
                  >
                      Accept
                </div>
                <Link className="co-type-body color--white" to='/'>No thanks</Link>
              </div>
              
            </div>
          </div>

        )
      }
      // otherwise email was sent to a different user
      else {
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
    }
  }
}

export default connect(mapStateToProps, Actions)(AcceptOrgInvite)