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
      else if (!(/^[A-Za-z0-9-_.]+$/.test(this.props.username)))  {
        this.props.createSubmitError('Your username can only contain letters, numbers, \'_\' and \'-\'', Constants.ACCEPT_ORG_INVITE_PAGE);
      }
      else if (!this.props.fullName || this.props.fullName.length < 1) {
        this.props.createSubmitError('Please add your full name', Constants.ACCEPT_ORG_INVITE_PAGE);
      }
      else {
        let userData = Object.assign({}, 
          {username: this.props.username},
          {fullName: this.props.fullName}
        )
        if (this.props.image) userData.image = this.props.image

        // if user is logged in, just accept the invite
        if (this.props.authenticated) {
          let lowerCaseEmail = this.props.userInfo.email ? this.props.userInfo.email.toLowerCase() : ''
          this.props.acceptOrgInvite(this.props.authenticated, lowerCaseEmail, this.props.params.iid, userData, this.props.imageFile)
        }
        // else user isnt logged in, register and accept
        else {
          // check password is long enough
          if (!this.props.password || this.props.password < 6) {
            this.props.createSubmitError('Please add a password that is at least 6 characters', Constants.ACCEPT_ORG_INVITE_PAGE);
          }

          if (!(this.props.invite && this.props.invite.orgId && this.props.invite.recipientEmail)) {
            this.props.createSubmitError('Sorry, there was an error with the invite', Constants.ACCEPT_ORG_INVITE_PAGE);
          }
          else {
            // register user and accept invite
            this.props.signUpUser(this.props.invite.recipientEmail, this.props.password, this.props.fullName, null, '/', this.props.invite.orgId, this.props.username, this.props.imageFile)
          }
        }
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
          <div className="home-page page-register fill--pond flx flx-col flx-just-start">
            <div className="mrgn-bottom-md color--white koi-type-body">{sender.username} invited you to join their team "{invite.orgName}"
            </div>
            <Link className="co-type-body color--tertiary" to='/login'>Login to accept</Link>
          </div>
        )
      }
      // otherwise the email address has not registerd, make the user sign up and accept the invite
      else {
        return (
        <div>
          <div className="home-page page-register fill--pond flx flx-row flx-m-col flx-align-center flx-align-start">
            
            <div className="dash-left-wrapper flx flx-col flx-align-start pdding-all-lg w-100">
              <div className="dash-inner flx flx-col flx-just-start fill--pond w-100">
                <div className="flx flx-row flx-align-center w-100 flx-hold">
                  <div className="dash-logo mobile-show mrgn-right-md flx-hold">
                    <img className="center-img" src="/img/koi-logo_a.png"/>
                  </div>
                  <div className="dash-logotext color--black w-100 ta-left">Koi</div>
                </div>
                <div className="dash-graphic mobile-hide w-100 mrgn-top-lg">
                  <img className="center-img" src="/img/dash-graphic.png"/>
                </div>
              </div>
            </div>


            <div className="dash-right-wrapper fill--mist pdding-all-lg pdding-all-m-md flx flx-col w-100">
              <div className="koi-type-body-lg color--black ta-center mrgn-bottom-md">
                <span className="koi-type-bold">{sender.username}</span> invited you to join their team "{invite.orgName}"
                {/*Jordan invited you to join their team "Many Aeons"*/}
              </div>
              <form>

                <label>Email Address</label>
                <fieldset className="koi-type-body mrgn-bottom-md pdding-all-sm fill--gray">
                  {invite.recipientEmail}
                </fieldset>

                <label>Choose your username for this team</label>
                <fieldset className="field-wrapper mrgn-bottom-md">
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="text"
                    placeholder="Username" 
                    required
                    value={this.props.username}
                    onChange={this.changeUsername} />
                </fieldset>

                <label>What's your full name?</label>
                <fieldset className="field-wrapper mrgn-bottom-md">
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="fullName"
                    placeholder="Full Name"
                    required
                    value={this.props.fullName}
                    onChange={this.changeFullName} />
                </fieldset>

                <label>Choose a password (at least 6 characters)</label>
                <fieldset className="field-wrapper mrgn-bottom-md">
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="password"
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

                  <label>Upload a profile image</label>
                  <fieldset className="">
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

              {/*<div
                className="vb fill--seaweed w-100 mrgn-top-md color--white mrgn-bottom-md"
                type="button"
                disabled={this.props.inProgress}
                onClick={this.handleSubmit}
                >
                    Accept
              </div>*/}

              <div 
                type="button"
                disabled={this.props.inProgress}
                onClick={this.handleSubmit}
                className="flx flx-col flx-center-all koi-button-fancy-wrapper home-register-button border--seaweed w-100 mrgn-bottom-md">
                  <div className="koi-button-fancy-outer">
                  </div>
                  <div className="koi-button-fancy-inner">
                  </div>
                  <div className="koi-button-fancy-text color--seaweed">
                    Accept Invite
                  </div>
              </div>
              <Link className="koi-type-body color--utsuri text-hover opa-60 w-100 ta-center" to='/'>No thanks</Link>
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
          <div className="home-page page-register fill--pond flx flx-row flx-m-col flx-align-center flx-align-start">
            
            <div className="dash-left-wrapper flx flx-col flx-align-start pdding-all-lg w-100">
              <div className="dash-inner flx flx-col flx-just-start fill--pond w-100">
                <div className="flx flx-row flx-align-center w-100 flx-hold">
                  <div className="dash-logo mobile-show mrgn-right-md flx-hold">
                    <img className="center-img" src="/img/koi-logo_a.png"/>
                  </div>
                  <div className="dash-logotext color--black w-100 ta-left">Koi</div>
                </div>
                <div className="dash-graphic mobile-hide w-100 mrgn-top-lg">
                  <img className="center-img" src="/img/dash-graphic.png"/>
                </div>
              </div>
            </div>


            <div className="dash-right-wrapper fill--mist pdding-all-lg pdding-all-m-md flx flx-col w-100">
              <div className="koi-type-body-lg color--black ta-center mrgn-bottom-md">
                <span className="koi-type-bold">{sender.username}</span> invited you to join their team "{invite.orgName}"
                {/*Jordan invited you to join their team "Many Aeons"*/}
              </div>
              <form>

                <label>Email Address</label>
                <fieldset className="koi-type-body mrgn-bottom-md pdding-all-sm fill--gray">
                  {invite.recipientEmail}
                </fieldset>

                <label>Choose your username for this team</label>
                <fieldset className="field-wrapper mrgn-bottom-md">
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="text"
                    placeholder="Username" 
                    required
                    value={this.props.username}
                    onChange={this.changeUsername} />
                </fieldset>

                <label>What's your full name?</label>
                <fieldset className="field-wrapper mrgn-bottom-md">
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="fullName"
                    placeholder="Full Name"
                    required
                    value={this.props.fullName}
                    onChange={this.changeFullName} />
                </fieldset>

                <label>Choose a password (at least 6 characters)</label>
                <fieldset className="field-wrapper mrgn-bottom-md">
                  <input
                    className="input--underline edit-itinerary__name brdr-all"
                    type="password"
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

                  <label>Upload a profile image</label>
                  <fieldset className="">
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

              {/*<div
                className="vb fill--seaweed w-100 mrgn-top-md color--white mrgn-bottom-md"
                type="button"
                disabled={this.props.inProgress}
                onClick={this.handleSubmit}
                >
                    Accept
              </div>*/}

              <div 
                type="button"
                disabled={this.props.inProgress}
                onClick={this.handleSubmit}
                className="flx flx-col flx-center-all koi-button-fancy-wrapper home-register-button border--seaweed w-100 mrgn-bottom-md">
                  <div className="koi-button-fancy-outer">
                  </div>
                  <div className="koi-button-fancy-inner">
                  </div>
                  <div className="koi-button-fancy-text color--seaweed">
                    Accept Invite
                  </div>
              </div>
              <Link className="koi-type-body color--utsuri text-hover opa-60 w-100 ta-center" to='/'>No thanks</Link>
            </div>
            
          </div>
        </div>

        )
      }
      // otherwise email was sent to a different user
      else {
        return (
          <div className="home-page page-common page-register fill--pond flx flx-col flx-just-start">
            <div className="koi-view ta-left flx flx-col pdding-top-lg">
                <div className="register-msg">
                  <div className="koi-big-header mrgn-bottom-md color--utsuri opa-30">Oops</div>
                  <div className="co-post-title mrgn-bottom-md color--black">
                    Sorry, this invite was sent to a different user.
                  </div>
                  <Link className="text-hover color--seaweed mrgn-top-sm" to='/'>Go to homepage</Link>
                </div>
              </div>
          </div>
        )
      }
    }
  }
}

export default connect(mapStateToProps, Actions)(AcceptOrgInvite)