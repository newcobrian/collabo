import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import OrgHeader from './OrgHeader';
import ProjectList from './ProjectList';
import Sidebar from 'react-sidebar';
import ProfilePic from './ProfilePic';
import DisplayTimestamp from './DisplayTimestamp';

const mql = window.matchMedia(`(min-width: 800px)`);

const MembersTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick(Constants.MEMBERS_TAB);
  }

  return (
    <li className="nav-item">
      <a  href=""
          className={ props.tab === Constants.MEMBERS_TAB ? 'nav-link active' : 'nav-link' }
          onClick={clickHandler}>
        Team Members
      </a>
    </li>
  );
};

const PendingTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick(Constants.PENDING_TAB);
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={ props.tab === Constants.PENDING_TAB ? 'nav-link active' : 'nav-link' }
        onClick={clickHandler}>
        Pending Invites
      </a>
    </li>
  );
};

const MembersList = props => {
  if (props.tab === Constants.MEMBERS_TAB) {
    return (
      <div>
        {
          (props.usersList || []).map((userItem, index) => {
            return (
              <Link className="flx flx-row flx-align-center mrgn-bottom-sm" 
                key={userItem.userId}
                to={'/' + props.orgName + '/user/' + userItem.username} >
                <ProfilePic src={userItem.image} className="user-img center-img" /> 
                <div className="mrgn-left-sm co-type-label">{userItem.username} ({userItem.fullName})</div>
              </Link>
              )
          })
        }
      </div>
    )
  }
  // pending tab
  else {
    return (
      <div>
        {
          (props.usersList || []).map((userItem, index) => {
            return (
              <div className="flx flx-row flx-align-center mrgn-bottom-sm" key={userItem.email}>
                <div className="mrgn-left-sm co-type-label">{userItem.email}</div>
                <div>
                  from <Link to={'/' + props.orgName + '/user/' + userItem.senderUsername}>{userItem.senderUsername}</Link>
                   <DisplayTimestamp timestamp={userItem.timestamp} />
                </div>
              </div>
              )
          })
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ...state.projectList,
  ...state.projectSettings,
  currentUser: state.common.currentUser,
  authenticated: state.common.authenticated,
  sidebarOpen: state.common.sidebarOpen
});

class ProjectSettings extends React.Component {
  constructor() {
    super()

    this.mediaQueryChanged = () => {
      this.props.setSidebar(mql.matches);
    }

    this.onTabClick = (tab) => {
      // console.log('tab = ' + tab)
      this.props.changeProjectSettingsTab(tab, this.props.params.pid)
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, null, Constants.PROJECT_SETTINGS_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.PROJECT_SETTINGS_PAGE)
    this.props.loadProjectNames(this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE)

    this.props.loadProject(this.props.params.pid, Constants.PROJECT_SETTINGS_PAGE);
    this.props.changeProjectSettingsTab(Constants.MEMBERS_TAB, this.props.params.pid)
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'settings'});
  }

  componentWillUnmount() {
    this.props.unloadProjectNames(this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE)
    this.props.unloadOrgList(this.props.authenticated, Constants.PROJECT_SETTINGS_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE)
    this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE)
    this.props.unloadOrg(Constants.PROJECT_SETTINGS_PAGE, this.props.params.orgname);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unloadProjectNames(this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE)
      this.props.unloadOrgList(this.props.authenticated, Constants.PROJECT_SETTINGS_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.params.orgname, Constants.PROJECT_SETTINGS_PAGE)

      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.PROJECT_SETTINGS_PAGE);
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, null, Constants.PROJECT_SETTINGS_PAGE)
      this.props.loadThreadCounts(this.props.authenticated, nextProps.params.PROJECT_SETTINGS_PAGE)
      this.props.loadProjectNames(nextProps.params.orgname, Constants.PROJECT_SETTINGS_PAGE)

      this.props.loadProject(nextProps.params.pid, Constants.PROJECT_SETTINGS_PAGE);
      this.props.changeProjectSettingsTab(this.props.tab, nextProps.params.pid)
    }
    else if (nextProps.params.pid !== this.props.params.pid) {
      this.props.loadProject(nextProps.params.pid, Constants.PROJECT_SETTINGS_PAGE);
    }
  }

  render() {
    const { orgName, usersList, sidebarOpen, tab, project } = this.props;
    if (!project) {
      return null
    }
    else {
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
                        <div className="co-type-h1 mrgn-left-md">{project.name} Admin</div>
                        <div>
                          {project.isPublic ? 'Public' : 'Private'}
                        </div>
                        
                      </div>
                      {/*<Link to={'/' + orgName + '/invite'}>+ Invite Users to Team</Link>*/}
                      <div>
                        <ul className="nav nav-pills outline-active">
                          <MembersTab tab={tab} onTabClick={this.onTabClick} />

                          <PendingTab tab={tab} onTabClick={this.onTabClick} />
                        </ul>


                        <MembersList tab={tab} usersList={usersList} orgName={orgName} />
                          
                        </div>
                      </div>
                    </div>
                  </div>
              </Sidebar>
            </div>
      );
    }
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Settings);
export default connect(mapStateToProps, Actions)(ProjectSettings);