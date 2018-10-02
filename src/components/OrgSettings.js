import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import OrgHeader from './OrgHeader';
import ProjectList from './ProjectList';
import Sidebar from 'react-sidebar';
import ProfilePic from './ProfilePic';

const mql = window.matchMedia(`(min-width: 800px)`);

class OrgSettingsForm extends React.Component {
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

    this.changeEmailClick = ev => {
      ev.preventDefault();
      this.props.showChangeEmailModal();
    }
  }

  componentDidMount() {
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
            <textarea
              className="form-control form-control-lg"
              rows="8"
              maxLength="66"
              placeholder="Update your status"
              value={this.state.bio}
              onChange={this.updateState('bio')}>
            </textarea>
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
              <a className="color--primary v2-type-body1" onClick={this.changeEmailClick}>Change email address</a>

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
            Save Changes
          </button>

        </fieldset>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  ...state.projectList,
  ...state.orgSettings,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  sidebarOpen: state.common.sidebarOpen
});

class OrgSettings extends React.Component {
  constructor() {
    super()

    this.mediaQueryChanged = () => {
      this.props.setSidebar(mql.matches);
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, null, Constants.ORG_SETTINGS_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
    this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'settings'});
  }

  componentWillUnmount() {
    this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
    this.props.unloadOrg(Constants.ORG_SETTINGS_PAGE);
    this.props.unloadOrgUsers(Constants.ORG_SETTINGS_PAGE);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrgUsers(Constants.ORG_SETTINGS_PAGE);

      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.ORG_SETTINGS_PAGE);
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, null, Constants.ORG_SETTINGS_PAGE)
      this.props.loadThreadCounts(this.props.authenticated, nextProps.params.ORG_SETTINGS_PAGE)
      this.props.loadOrgUsers(this.props.authenticated, nextProps.params.orgname, Constants.ORG_SETTINGS_PAGE)
    }
  }

  render() {
    const { orgName, usersList, sidebarOpen } = this.props;
    return (
      <div>

          <Sidebar
            sidebar={<ProjectList />}
            open={sidebarOpen}
            onSetOpen={mql.matches ? this.props.setSidebarOpen : () => this.props.setSidebar(!sidebarOpen)}
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
              <div className={sidebarOpen ? 'open-style' : 'closed-style'}>

                <div className="page-common page-places flx flx-row flx-m-col flx-align-start">
                  <div className="project-header text-left flx flx-col flx-align-start w-100">
                    <OrgHeader />
                    {/* HEADER START */}
                    <div className="flx flx-row flx-align-center mrgn-top-sm w-100">
                      <div className="co-type-h1 mrgn-left-md">{orgName} Admin</div>
                      
                    </div>
                    <div>
                     <div>Team Members</div>
                      {(usersList || []).map((userItem, index) => {
                        return (
                          <div className="flx flx-row flx-align-center mrgn-bottom-sm" key={userItem.userId}>
                            <ProfilePic src={userItem.image} className="user-img center-img" /> 
                            <div className="mrgn-left-sm co-type-label">{userItem.username} ({userItem.fullName})</div>
                          </div>
                          )
                      })}

                        {/*<ListErrors errors={this.props.errors}></ListErrors>*/}

                        

                  {/*<OrgSettingsForm
                    authenticated={this.props.authenticated}
                    currentUser={this.props.firebaseUser}
                    onSubmitForm={this.props.saveSettings} />*/}
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
export default connect(mapStateToProps, Actions)(OrgSettings);