import ListErrors from './ListErrors';
import React from 'react';
import Firebase from 'firebase';
import { connect } from 'react-redux';
import { Link, browserHistory } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import ProxyImage from './ProxyImage';
import ProfilePic from './ProfilePic';
import ProjectList from './ProjectList';
import OrgHeader from './OrgHeader';
import Sidebar from 'react-sidebar';

const mql = window.matchMedia(`(min-width: 800px)`);

class SettingsForm extends React.Component {
  constructor() {
    super();

    this.state = {
      image: '',
      username: '',
      fullName: '',
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
      if(this.state.fullName) user.fullName = this.state.fullName;
      if(this.state.email) user.email = this.state.email;
      if(this.state.password) user.password = this.state.password;

      if (this.props.org && this.props.org.id && this.props.org.url) {
        this.props.onSubmitForm(this.props.authenticated, user, this.props.currentUser, this.state.imageFile, this.props.org.url, this.props.org.id);
      }
    };

    this.changeEmailClick = ev => {
      ev.preventDefault();
      this.props.showChangeEmailModal();
    }
  }

  componentDidMount() {
    if (this.props.currentUser) {
      Object.assign(this.state, {
        image: this.props.currentUser.image || '',
        username: this.props.currentUser.username,
        fullName: this.props.currentUser.fullName,
        email: this.props.currentUser.email
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUser) {
      this.setState(Object.assign({}, this.state, {
        image: nextProps.currentUser.image || '',
        username: nextProps.currentUser.username,
        fullName: nextProps.currentUser.fullName,
        email: nextProps.currentUser.email
      }));
    }
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <fieldset>
          <div className="profile-image flx flx-center-all">
            <ProfilePic src={this.state.imageFile ? URL.createObjectURL(this.state.imageFile) : (this.state.image ? this.state.image : '')} className="center-img" />
          </div>
          <fieldset className="form-group">
            <div className="upload-wrapper">
                <div className="upload-overlay">Upload Image</div>
                <div className="fileUpload">
                  <input
                  className="form-control upload-image-button"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
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
            <input
              className="form-control form-control-lg"
              placeholder="Full name"
              required
              value={this.state.fullName}
              onChange={this.updateState('fullName')}>
            </input>
          </fieldset>

          <fieldset className="form-group pdding-all-md">
            {/*<input
              className="form-control form-control-lg"
              type="email"
              placeholder="Email"
              required
              value={this.state.email}
              onChange={this.updateState('email')} />*/}
              <div className="">{this.state.email}</div>
              <a className="color--primary v2-type-body1 DN" onClick={this.changeEmailClick}>Change email address</a>

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
            className="vb fill--utsuri color--white ta-center mrgn-bottom-sm w-100"
            type="submit"
            disabled={this.state.inProgress}>
            Save Changes
          </button>

          {/*<Link onClick={()=>browserHistory.goBack()}>Cancel</Link>*/}
        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  org: state.projectList.org,
  sidebarOpen: state.common.sidebarOpen
});

class Settings extends React.Component {
  constructor() {
    super()

    this.mediaQueryChanged = () => {
      this.props.setSidebar(mql.matches);
    }
  }

  componentDidMount() {
    if (!this.props.authenticated) {
      Actions.askForAuth();
    }

    let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
      if (!orgSnap.exists()) {
        this.props.notAnOrgUserError(Constants.PROJECT_PAGE)
      }
      else {
        let orgId = orgSnap.val().orgId
        let orgName = orgSnap.val().name

        this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgurl, orgName, Constants.SETTINGS_PAGE);
        this.props.loadOrgUser(this.props.authenticated, orgId, Constants.SETTINGS_PAGE)
        this.props.loadProjectList(this.props.authenticated, orgId, Constants.SETTINGS_PAGE)
        this.props.loadThreadCounts(this.props.authenticated, orgId)
        this.props.loadProjectNames(orgId, Constants.SETTINGS_PAGE)
        this.props.loadOrgList(this.props.authenticated, Constants.SETTINGS_PAGE)

        this.props.getProfileUser(this.props.authenticated, orgSnap.val().orgId);
      }
    })

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'settings'});
  }

  componentWillUnmount() {
    if (this.props.org && this.props.org.id) {
      this.props.unloadProjectNames(this.props.org.id, Constants.SETTINGS_PAGE)
    this.props.unloadOrgList(this.props.authenticated, Constants.SETTINGS_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.org.id)
    this.props.unloadProjectList(this.props.authenticated, this.props.org.id, Constants.SETTINGS_PAGE)
    this.props.unloadOrgUser(this.props.authenticated, this.props.org.id, Constants.SETTINGS_PAGE)
    }
    this.props.unloadOrg(Constants.SETTINGS_PAGE);

    this.props.unloadProfileUser(this.props.userId, this.props.orgId);
  }

  render() {
    return (

      <div>
        <Sidebar
              sidebar={<ProjectList />}
              open={this.props.sidebarOpen}
              onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!this.props.sidebarOpen)}
              styles={{ sidebar: {
                    borderRight: "1px solid rgba(0,0,0,.1)",
                    boxShadow: "none",
                    zIndex: "100"
                  },
                  overlay: mql.matches ? {
                    backgroundColor: "rgba(255,255,255,1)"
                  } : {
                    zIndex: 12,
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                  },
                }}
              >
                <div className={this.props.sidebarOpen ? 'open-style' : 'closed-style'}>
                  <div className="page-common page-create-list flx flx-col flx-center-all">
                    <div className="project-header text-left flx flx-col flx-align-start w-100">
                      <OrgHeader />
                      {/* HEADER START */}
                    </div>
                    <div className="koi-view header-push ta-left flx flx-col">
                      <div className="co-post-title mrgn-bottom-md">
                        Settings
                      </div>
                      <ListErrors errors={this.props.errors}></ListErrors>

                      <SettingsForm
                        authenticated={this.props.authenticated}
                        currentUser={this.props.firebaseUser}
                        onSubmitForm={this.props.saveSettings}
                        showChangeEmailModal={this.props.showChangeEmailModal}
                        org={this.props.org} />


                      {/*<div
                        className="fill--none color--black opa-60 w-100 mrgn-top-md ta-center w-100"
                        onClick={this.props.signOutUser}>
                        Logout
                      </div>*/}

                      <div
                        className="fill--none color--utsuri text-hover koi-type-body opa-60 w-100 mrgn-top-md ta-center w-100"
                        onClick={()=>browserHistory.goBack()}>
                        Logout
                      </div>



                  </div>
                </div>
              </div>
            </Sidebar>
        </div>
    );
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Settings);
export default connect(mapStateToProps, Actions)(Settings);