import React from 'react';
import { connect } from 'react-redux';
import Firebase from 'firebase';
import { Link } from 'react-router';
import * as Actions from '../actions';
import * as Constants from '../constants';
import OrgHeader from './OrgHeader';
import ProjectList from './ProjectList';
import Sidebar from 'react-sidebar';
import ProfilePic from './ProfilePic';
import DisplayTimestamp from './DisplayTimestamp';
import InvalidOrg from './InvalidOrg'
import LoggedOutMessage from './LoggedOutMessage';

const mql = window.matchMedia(`(min-width: 800px)`);

const JoinProjectButton = props => {
  const handleJoinClick = ev => {
    ev.preventDefault();
    
    if (props.isJoined) {
      props.leaveProject(props.authenticated, props.userInfo, props.orgId, props.project)
    } else {
      props.joinProject(props.authenticated, props.userInfo, props.orgId, props.project)
    }
  };

  return (
    <div className="flx flx-center-all mrgn-right-md">
      <button onClick={handleJoinClick} className={"vb vb--xs vb--round flx flx-row flx-center-all " + (props.isJoined ? 'fill--mist color--black' : 'fill--seaweed color--white' )}>
          { props.isJoined ? 'Leave' : 'Join' }
      </button>
    </div>
  )
}

const ListsTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick(Constants.LISTS_TAB);
  }

  return (
    <li className="nav-item">
      <a  href=""
          className={ props.tab === Constants.LISTS_TAB ? 'nav-link color--black brdr-color--primary active' : 'nav-link color--black ' }
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
          className={ props.tab === Constants.MEMBERS_TAB ? 'nav-link color--black brdr-color--primary active' : 'nav-link color--black' }
          onClick={clickHandler}>
        Members
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
        className={ props.tab === Constants.PENDING_TAB ? 'nav-link color--black brdr-color--primary active' : 'nav-link color--black' }
        onClick={clickHandler}>
        Pending Invites
      </a>
    </li>
  );
};
// { Object.keys(Constants.USER_ROLES_MAP).forEach(function(roleType) {
//             if (roleType > orgUser.role) {
//               console.log(roleType)
//               return (
//                 <option value={roleType}>Change to</option>  
//               )
//             }
//             else {
//               console.log('else role type = ' + roleType)
//             }
//           })}
const EditUserRole = props => {
  const onChange = ev => {
    console.log('hi i be changin')
  }
  const { user, orgUser } = props

  // check if org user's role is primary owner, owner, or admin
  if (orgUser.role > Constants.ADMIN_ROLE) return null
  else {
    return (
    <div className="org-row org-row-selector flx flx-row flx-align-center">
      <select className="org-selector co-type-org color--utsuri opa-40" onChange={onChange}>
        <option selected disabled hidden>
          ...
        </option>
        {(props.roleArray || []).map((roleType, index) => {
          if (orgUser.role < index) {
            return (
              <option key={index} value={index}>Change to {roleType}</option>  
            )
          }
        })}
      </select>
    </div> 
    )
  }
}

const RoleRender = props => {
  if (props.orgUser.role > Constants.ADMIN_ROLE) return null;
  else {
    return (
      <div className="mrgn-left-sm koi-type-body">
        {Constants.USER_ROLES_MAP[props.user.role]}
      </div>
    )
  }
}

const MembersList = props => {
  if (props.tab === Constants.MEMBERS_TAB) {
    return (
      <div className="">
        {
          (props.orgMembers || []).map((userItem, index) => {
            return (
              <div className="flx flx-row flx-align-center mrgn-bottom-sm brdr-bottom pdding-bottom-sm" key={index}>
                <Link
                  key={userItem.userId}
                  to={'/' + props.org.url + '/user/' + userItem.username} >
                  <ProfilePic src={userItem.image} className="user-img center-img prof-48" /> 
                  <div className="flx flx-col flx-align-start w-100">
                    <div className="mrgn-left-sm koi-type-body koi-type-bold color--black">{userItem.username}</div>
                    <div className="mrgn-left-sm koi-type-caption color--black">{userItem.fullName}</div>
                  </div>
                </Link>
                  <RoleRender user={userItem} orgUser={props.orgUser} />
                  <div className="mrgn-left-sm koi-type-body">
                    {userItem.status}
                  </div>
                  <EditUserRole
                    orgUser={props.orgUser} 
                    user={userItem}
                    roleArray={props.roleArray} />
                </div>
              )
          })
        }
      </div>
    )
  }
  // pending tab
  else if (props.tab === Constants.PENDING_TAB) {
    return (
      <div className="">
        {
          (props.payload || []).map((userItem, index) => {
            return (
              <div className="flx flx-col flx-align-start mrgn-bottom-sm brdr-bottom pdding-bottom-sm" key={userItem.email}>
                <div className="koi-type-body koi-type-bold">{userItem.email}</div>
                <div className="koi-type-caption opa-60">
                  from <Link className="color--black" to={'/' + props.org.url + '/user/' + userItem.senderUsername}>{userItem.senderUsername}</Link> on&nbsp;
                   <DisplayTimestamp timestamp={userItem.timestamp} />
                </div>
              </div>
              )
          })
        }
      </div>
    )
  }
  // lists tab
  else if (props.tab === Constants.LISTS_TAB) {
    return (
      <div className="">
        {
          (props.payload || []).map((projectItem, index) => {

            if (projectItem.isPublic || props.usersProjects[projectItem.projectId]) {
              return (
                <div className="flx flx-row flx-align-center mrgn-bottom-sm" key={projectItem.projectId}>
                  <JoinProjectButton 
                    authenticated={props.authenticated}
                    userInfo={props.userInfo}
                    orgId={props.org.id}
                    isJoined={props.usersProjects[projectItem.projectId]}
                    leaveProject={props.leaveProject}
                    joinProject={props.joinProject}
                    project={projectItem} />
                  <div className="koi-type-body">{projectItem.projectName}</div>
                </div>
                )
            }

          })
        }
        <Link to={'/' + props.org.url + '/createGroup'} className="sidebar-row group-row flx flx-row flx-align-center mrgn-top-sm">
          <div className="sidebar-icon flx flx-center-all">
            <div className="koi-ico --24 ico--add ico-color--seaweed"></div> 
          </div>
          <div className="sidebar-project-name color--seaweed co-type-bold"> 
            Add Group
          </div>
        </Link>
      </div>
    )
  }
  else return null
}

const mapStateToProps = state => ({
  // ...state.projectList,
  ...state.orgSettings,
  org: state.projectList.org,
  currentUser: state.common.currentUser,
  userInfo: state.common.userInfo,
  authenticated: state.common.authenticated,
  invalidOrgUser: state.common.invalidOrgUser,
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
      this.props.changeOrgSettingsTab(tab, this.props.org.id)
    }

    this.onOrgInviteClick = ev => {
      this.props.showOrgInviteModal(this.props.org)
    }
  }

  componentDidMount() {
    this.props.loadSidebar(mql);
    mql.addListener(this.mediaQueryChanged);
    let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
    Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
      if (!orgSnap.exists()) {
        this.props.notAnOrgUserError(Constants.PROJECT_PAGE)
      }
      else {
        let orgId = orgSnap.val().orgId
        let orgName = orgSnap.val().name
        this.props.loadOrg(this.props.authenticated, orgId, this.props.params.orgurl, orgName, Constants.ORG_SETTINGS_PAGE);
        this.props.loadOrgUser(this.props.authenticated, orgId, Constants.ORG_SETTINGS_PAGE)
        this.props.loadProjectList(this.props.authenticated, orgId, null, Constants.ORG_SETTINGS_PAGE)
        this.props.loadThreadCounts(this.props.authenticated, orgId, Constants.ORG_SETTINGS_PAGE)
        this.props.loadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
        this.props.loadProjectNames(orgId, Constants.ORG_SETTINGS_PAGE)

        this.props.loadOrgMembers(orgId, Constants.ORG_SETTINGS_PAGE)

        this.props.changeOrgSettingsTab(this.props.tab ? this.props.tab : Constants.LISTS_TAB, orgId)
      }
    })

    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'org settings'});
  }

  componentWillUnmount() {
    if (this.props.org && this.props.org.id) {
      this.props.unloadProjectNames(this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrgUser(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrg(Constants.ORG_SETTINGS_PAGE);
      this.props.unloadOrgMembers(this.props.org.id, Constants.ORG_SETTINGS_PAGE)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.orgname !== this.props.params.orgname) {
      this.props.unloadOrgUser(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadProjectNames(this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrgList(this.props.authenticated, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadThreadCounts(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadProjectList(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE)
      this.props.unloadOrgMembers(this.props.org.id, Constants.ORG_SETTINGS_PAGE)

      let lowerCaseOrgURL = this.props.params.orgurl ? this.props.params.orgurl.toLowerCase() : ''
      Firebase.database().ref(Constants.ORGS_BY_URL_PATH + '/' + lowerCaseOrgURL).once('value', orgSnap => {
        if (!orgSnap.exists()) {
          this.props.notAnOrgUserError(Constants.PROJECT_PAGE)
        }
        else {
          let orgId = orgSnap.val().orgId
          let orgName = orgSnap.val().name
          this.props.loadOrg(this.props.authenticated, orgId, nextProps.params.orgurl, orgName, Constants.ORG_SETTINGS_PAGE);
          this.props.loadOrgUser(this.props.authenticated, orgId, Constants.ORG_SETTINGS_PAGE)
          this.props.loadProjectList(this.props.authenticated, orgId, null, Constants.ORG_SETTINGS_PAGE)
          this.props.loadThreadCounts(this.props.authenticated, orgId, Constants.ORG_SETTINGS_PAGE)
          this.props.loadProjectNames(orgId, Constants.ORG_SETTINGS_PAGE)
          this.props.loadOrgMembers(orgId, Constants.ORG_SETTINGS_PAGE)
          // this.props.loadOrgUsers(this.props.authenticated, nextProps.params.orgname, Constants.ORG_SETTINGS_PAGE)
          this.props.changeOrgSettingsTab(this.props.tab, orgId)
        }
      })
    }
  }

  render() {
    if (!this.props.authenticated) {
      return (
        <LoggedOutMessage />
      )
    }
    if (this.props.invalidOrgUser) {
      return (
        <InvalidOrg/>
        )
    }

    const { payload, sidebarOpen, tab, usersProjects, org, authenticated, orgUser, userInfo } = this.props;
    const orgName = org && org.name ? org.name : ''

    let roleArray = []
    // for (let i = 0; i <= Constants.GUEST_ROLE; i++) {
    //   roleArray = Constants.USER_ROLES_MAP[i]
    // }

    Object.keys(Constants.USER_ROLES_MAP).forEach(function(item) {
      roleArray[item] = Constants.USER_ROLES_MAP[item]
    })

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

                <div className="page-common page-team-settings flx flx-col flx-center-all">
                  <div className={"project-header brdr-bottom b--primary--20 text-left flx flx-col flx-align-start w-100"}>
                    <OrgHeader />
                  </div>
                  <div className="koi-view header-push text-left flx flx-col flx-align-start w-100">
                    {/* HEADER START */}
                    <div className="flx flx-col flx-align-start flx-just-center w-100 mrgn-bottom-sm">
                      <div className="koi-type-page-title">{orgName} Team Directory</div>

                      <Link onClick={this.onOrgInviteClick} className="flx flx-row flx-align-center vb vb--sm fill--utsuri mrgn-top-md mrgn-bottom-sm">
                        <div className="mrgn-right-sm flx flx-center-all DN">
                          <div className="koi-ico --24 ico--add--white"></div>              
                        </div>
                        <div className="koi-type-body koi-type-bold color--white">
                          Invite Users
                        </div>
                      </Link>
                    </div>
                    <div className="w-100">
                      <ul className="nav nav-pills outline-active">
                        <ListsTab tab={tab} onTabClick={this.onTabClick} />
                        <MembersTab tab={tab} onTabClick={this.onTabClick} />
                        <PendingTab tab={tab} onTabClick={this.onTabClick} />
                      </ul>


                      <MembersList 
                        authenticated={authenticated}
                        userInfo={userInfo}
                        orgUser={orgUser}
                        tab={tab} 
                        payload={payload} 
                        org={org}
                        orgMembers={this.props.orgMembers}
                        usersProjects={usersProjects || {}} 
                        joinProject={this.props.joinProject}
                        leaveProject={this.props.leaveProject}
                        roleArray={roleArray} />

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