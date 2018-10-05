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

const ListsTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick(Constants.LISTS_TAB);
  }

  return (
    <li className="nav-item">
      <a  href=""
          className={ props.tab === Constants.LISTS_TAB ? 'nav-link active' : 'nav-link' }
          onClick={clickHandler}>
        Lists
      </a>
    </li>
  );
};

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
          (props.payload || []).map((userItem, index) => {
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
  else if (props.tab === Constants.PENDING_TAB) {
    return (
      <div>
        {
          (props.payload || []).map((userItem, index) => {
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
  else if (props.tab === Constants.LISTS_TAB) {
    return (
      <div>
        {
          (props.payload || []).map((projectItem, index) => {
            return (
              <div className="flx flx-row flx-align-center mrgn-bottom-sm" key={projectItem.projectId}>
                <div className="mrgn-left-sm co-type-label">{projectItem.projectName}</div>
              </div>
              )
          })
        }
      </div>
    )
  }
  else return null
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

    this.onTabClick = (tab) => {
      // console.log('tab = ' + tab)
      this.props.changeOrgSettingsTab(tab, this.props.params.orgname, this.props.orgId)
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);

    this.props.loadOrg(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE);
    this.props.loadProjectList(this.props.authenticated, this.props.params.orgname, null, Constants.ORG_SETTINGS_PAGE)
    this.props.loadThreadCounts(this.props.authenticated, this.props.params.orgname)
    this.props.loadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
    this.props.loadProjectNames(this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)

    // this.props.loadOrgUsers(this.props.authenticated, this.props.params.orgname, Constants.ORG_SETTINGS_PAGE)
    this.props.changeOrgSettingsTab(this.props.tab ? this.props.tab : Constants.LISTS_TAB, this.props.params.orgname, null)
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'settings'});
  }

  componentWillUnmount() {
    this.props.unloadProjectNames(this.props.orgId, Constants.ORG_SETTINGS_PAGE)
    this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
    this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId, Constants.ORG_SETTINGS_PAGE)
    this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.ORG_SETTINGS_PAGE)
    this.props.unloadOrg(Constants.ORG_SETTINGS_PAGE, this.props.params.orgname);
    this.props.unloadOrgUsers(this.props.params.orgname, Constants.ORG_SETTINGS_PAGE);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.loadProjectNames(this.props.orgId, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.orgId, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.orgId, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrgUsers(this.props.params.orgname, Constants.ORG_SETTINGS_PAGE);

      this.props.loadOrg(this.props.authenticated, nextProps.params.orgname, Constants.ORG_SETTINGS_PAGE);
      this.props.loadProjectList(this.props.authenticated, nextProps.params.orgname, null, Constants.ORG_SETTINGS_PAGE)
      this.props.loadThreadCounts(this.props.authenticated, nextProps.params.ORG_SETTINGS_PAGE)
      this.props.loadProjectNames(nextProps.params.orgname, Constants.ORG_SETTINGS_PAGE)
      // this.props.loadOrgUsers(this.props.authenticated, nextProps.params.orgname, Constants.ORG_SETTINGS_PAGE)
      this.props.changeOrgSettingsTab(this.props.tab, nextProps.params.orgname)
    }
  }

  render() {
    const { orgName, payload, sidebarOpen, tab } = this.props;
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
                    <Link to={'/' + orgName + '/invite'}>+ Invite Users to Team</Link>
                    <div>
                      <ul className="nav nav-pills outline-active">
                        <ListsTab tab={tab} onTabClick={this.onTabClick} />
                        <MembersTab tab={tab} onTabClick={this.onTabClick} />
                        <PendingTab tab={tab} onTabClick={this.onTabClick} />
                      </ul>


                      <MembersList tab={tab} payload={payload} orgName={orgName} />

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