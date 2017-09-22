import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import ProfilePic from './ProfilePic';


class SettingsForm extends React.Component {
  constructor() {
    super();

    this.state = {
      image: '',
      username: '',
      bio: '',
      email: '',
      password: ''
    };

    this.updateState = field => ev => {
      const state = this.state;
      const newState = Object.assign({}, state, { [field]: ev.target.value });
      this.setState(newState);
    };

    this.changeFile = ev => {
      this.setState( {['imageFile']: ev.target.files[0] });
    }

    this.submitForm = ev => {
      ev.preventDefault();

      const user = {};
      const userAuth = {};
      if(this.state.image) user.image = this.state.image;
      if(this.state.username) user.username = (this.state.username).toLowerCase();
      if(this.state.bio) user.bio = this.state.bio;
      if(this.state.email) user.email = this.state.email;
      if(this.state.password) user.password = this.state.password;

      this.props.onSubmitForm(this.props.authenticated, user, this.props.currentUser, this.state.imageFile);
    };
  }

  componentWillMount() {
    if (!this.props.authenticated) {
      Actions.askForAuth();
    }
    if (this.props.currentUser) {
      Object.assign(this.state, {
        image: this.props.currentUser.image || '',
        username: this.props.currentUser.username,
        bio: this.props.currentUser.bio,
        email: this.props.currentUser.email
      });
    }
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'settings'});
  }

  // componentWillUnmount() {
  //   this.props.onUnload();
  // }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.setState(Object.assign({}, this.state, {
        image: nextProps.currentUser.image || '',
        username: nextProps.currentUser.username,
        bio: nextProps.currentUser.bio,
        email: nextProps.currentUser.email
      }));
    }
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>
          <div className="profile-image flx flx-center-all"><ProfilePic src={this.state.image ? this.state.image : ''} className="center-img" /></div>
          <fieldset className="form-group">
            <div className="upload-wrapper">
                <div className="upload-overlay">Upload Image</div>
                <div className="fileUpload">
                  <input
                  className="form-control upload-image-button"
                  type="file"
                  accept="image/*" 
                  onChange={this.changeFile} />

                  </div>
            </div> 
         {/***}   <input
              className="form-control"
              type="text"
              placeholder="URL of profile picture"
              value={this.state.image}
              onChange={this.updateState('image')} /> ***/}
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="text"
              placeholder="Username"
              required
              value={this.state.username}
              onChange={this.updateState('username')} />
          </fieldset>

          <fieldset className="form-group">
            <textarea
              className="form-control form-control-lg"
              rows="8"
              maxLength="88"
              placeholder="Short bio about you"
              value={this.state.bio}
              onChange={this.updateState('bio')}>
            </textarea>
          </fieldset>

          <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              required
              value={this.state.email}
              onChange={this.updateState('email')} />
          </fieldset>

         {/*} <fieldset className="form-group">
            <input
              className="form-control form-control-lg"
              type="password"
              placeholder="New Password"
              minLength="6"
              value={this.state.password}
              onChange={this.updateState('password')} />
          </fieldset> */}

          <button
            className="vb fill--primary color--white ta-center mrgn-bottom-sm w-100"
            type="submit"
            disabled={this.state.inProgress}>
            Update Profile
          </button>

        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated
});

class Settings extends React.Component {
  componentWillMount() {
    this.props.getProfileUser(this.props.authenticated);
    this.props.sendMixpanelEvent('Settings page loaded');
  }

  componentWillUnmount() {
    this.props.unloadSettings(this.props.authenticated);
  }

  render() {
    return (
      <div className="roow roow-col-left page-common settings-page page-no-push">
            <div className="page-title-wrapper center-text">
               <div className="v2-type-page-header">Settings</div>
               <div className="v2-type-body2 opa-60 mrgn-top-sm DN"></div>
             </div>
            <div className="settings-wrapper mrgn-top-md">

              <ListErrors errors={this.props.errors}></ListErrors>

              <SettingsForm
                authenticated={this.props.authenticated}
                currentUser={this.props.firebaseUser}
                onSubmitForm={this.props.saveSettings} />


              <div
                className="vb vb--sm vb--shadow-none fill--none color--primary w-100"
                onClick={this.props.signOutUser}>
                Or click here to logout.
              </div>


            </div>

      </div>
    );
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Settings);
export default connect(mapStateToProps, Actions)(Settings);