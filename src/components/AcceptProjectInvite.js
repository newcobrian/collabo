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
  ...state.acceptProjectInvite,
  appName: state.common.appName,
  authenticated: state.common.authenticated,
  userInfo: state.common.userInfo
});

class AcceptProjectInvite extends React.Component {
  constructor() {
    super()

    // const updateFieldEvent =
    //     key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ACCEPT_INVITE_PAGE);

    // this.changeUsername = updateFieldEvent('username');
    // this.changeFullName = updateFieldEvent('fullName');

    // this.changeFile = ev => {
    //   this.props.onUpdateCreateField('image', ev.target.files[0], Constants.ACCEPT_INVITE_PAGE)
    // }

    // this.onRegisterClick = ev => {
    //   ev.preventDefault()
    //   this.props.onRegisterWithEmailClick(this.props.invite.recipientEmail)      
    // }

    // this.handleSubmit = ev => {
    //   ev.preventDefault()
      
    //   if (!this.props.username || this.props.username.length < 1) {
    //     this.props.createSubmitError('Please add your username', Constants.ACCEPT_INVITE_PAGE);
    //   }
    //   else if (!this.props.fullName || this.props.fullName.length < 1) {
    //     this.props.createSubmitError('Please add your full name', Constants.ACCEPT_INVITE_PAGE);
    //   }
    //   else {
    //     let userData = Object.assign({}, 
    //       {username: this.props.username},
    //       {fullName: this.props.fullName},
    //       {image: this.props.image}
    //     )
    //     let lowerCaseEmail = this.props.userInfo.email ? this.props.userInfo.email.toLowerCase() : ''
    //     this.props.acceptOrgInvite(this.props.authenticated, lowerCaseEmail, this.props.params.iid, userData)
    //   }
    // }
  }

  componentDidMount() {
    this.props.loadProjectInvite(this.props.authenticated, this.props.params.iid);
    if (!this.props.authenticated) this.props.setAuthRedirect(this.props.location.pathname);

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'accept project invite'});
  }

  componentWillUnmount() {
    this.props.unloadProjectInvite(this.props.params.iid);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.props.unloadProjectInvite(this.props.params.iid);
      this.props.loadProjectInvite(this.props.authenticated, nextProps.params.iid);
    }
  }

  render() {
    const { authenticated, invite, loadInviteError, errorMessage, inviteType, userInfo, sender } = this.props;
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
    if (!authenticated) {
      return (
        <LoggedOutMessage />
      )
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

export default connect(mapStateToProps, Actions)(AcceptProjectInvite)