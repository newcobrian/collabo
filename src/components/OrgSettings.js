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
import { DropdownButton, MenuItem } from 'react-bootstrap'

const mql = window.matchMedia(`(min-width: 800px)`);

const DeactivateButton = props => {
  const {orgUser, teammate} = props

  // if org user is admin or better, and is same or higher level role than the user, they can activate/deactivate
  if (orgUser.role <= Constants.ADMIN_ROLE && orgUser.role <= teammate.role) {
    if (teammate.status === Constants.DEACTIVE_STATUS) {
     return (
        <MenuItem title='Deactivate' onSelect={props.onClickStatusChange(Constants.ACTIVE_STATUS)}>Activate user</MenuItem>  
      )
    }
    else {
      return (
        <MenuItem title='Activate' onSelect={props.onClickStatusChange(Constants.DEACTIVE_STATUS)}>Deactivate user</MenuItem>  
      )
    }
  }
  else return null
}

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
  if (props.orgUser && props.orgUser.role !== Constants.GUEST_ROLE) {
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
  }
  else return null
};

const ManageTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick(Constants.MANAGE_TAB);
  };

  return (
    <li className="nav-item">
      <a
        href=""
        className={ props.tab === Constants.MANAGE_TAB ? 'nav-link color--black brdr-color--primary active' : 'nav-link color--black' }
        onClick={clickHandler}>
        Manage Settings
      </a>
    </li>
  );
};

const EditUserRole = props => {
  const { teammate, orgUser } = props

  const onChange = eventKey => {
    props.onChangeUserRole(teammate, eventKey)
  }

  const onClickStatusChange = status => ev => {
    props.onChangeUserStatus(teammate, status)
  }
  // auth can edit other users if:
  // 1) auth is at least an admin, they aren't looking at themselves, teammate is not a primary owner
  // 2) AND either: auth is a higher level than teammate and at least an admin
  // 3) OR they are both owners
  if (orgUser.role <= Constants.ADMIN_ROLE && orgUser.userId !== teammate.userId && teammate.role !== Constants.PRIMARY_OWNER_ROLE &&
    (!teammate.role || 
      (orgUser.role < teammate.role && orgUser.role <= Constants.ADMIN_ROLE) || 
      (orgUser.role == teammate.role && orgUser.role == Constants.OWNER_ROLE))) {
    return (
      <div className="koi-dropdown flx flx-row flx-align-center flx-hold color--utsuri">
        <DropdownButton title='Edit' id={`split-button-basic`}>
        {(Constants.USER_ROLES_ARRAY || []).map((roleType, index) => {      
          if (teammate.role == index) {
            return (
              <div key={index}>{roleType}</div>
            )
          }
          else if (orgUser.role < index || 
            (orgUser.role == index) && (orgUser.role == Constants.OWNER_ROLE || orgUser.role == Constants.ADMIN_ROLE)) {
            return (
              <MenuItem title='Edit' eventKey={index} key={index} onSelect={onChange}>Change to {roleType}</MenuItem>
            )
          }
          else return null
        })}
          <MenuItem divider />
          <DeactivateButton teammate={teammate} orgUser={orgUser} onClickStatusChange={onClickStatusChange} />
        </DropdownButton>
      </div> 
    )
  }
  else return null
}

const RoleRender = props => {
  if (props.orgUser.role > Constants.ADMIN_ROLE) {
    return (
      <div className="user-column ta-left mrgn-left-sm koi-type-body">
      </div>
      )
  }
  else {
    return (
      <div className="user-column ta-left mrgn-left-sm koi-type-body">
        {Constants.USER_ROLES_MAP[props.user.role]}
      </div>
    )
  }
}

const SettingsForm = props => {
  if (props.tab === Constants.SETTINGS_TAB) {
    return (
      <div>
      Settings tab
      </div>
      )
  }
  else return null
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
                  to={'/' + props.org.url + '/user/' + userItem.username}
                  className="flx flx-row flx-align-center w-100"
                   >
                  <ProfilePic src={userItem.image} className="user-img center-img prof-48" /> 
                  <div className="flx flx-col flx-align-start">
                    <div className="mrgn-left-sm koi-type-body koi-type-bold color--black">{userItem.username}</div>
                    <div className="mrgn-left-sm koi-type-caption color--black">{userItem.fullName}</div>
                  </div>
                </Link>
                <div className="flx-item-right flx flx-row flx-align-center">
                  <RoleRender user={userItem} orgUser={props.orgUser} />
                  <div className="user-column ta-left mrgn-left-sm koi-type-body">
                    {userItem.status}
                  </div>
                  <EditUserRole
                    orgUser={Object.assign({}, props.orgUser, {userId: props.authenticated})} 
                    teammate={userItem}
                    onChangeUserRole={props.onChangeUserRole}
                    onChangeUserStatus={props.onChangeUserStatus} />
                  </div>
                </div>
              )
          })
        }
      </div>
    )
  }
  // pending tab
  else if (props.tab === Constants.PENDING_TAB) {
    if (props.orgUser && props.orgUser.role !== Constants.GUEST_ROLE) {
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
    else {
      return null
    }
  }
  // lists tab
  else if (props.tab === Constants.LISTS_TAB) {
    if (props.orgUser && props.orgUser.role !== Constants.GUEST_ROLE) {
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
                    <div className="koi-type-body">{projectItem.name}</div>
                  </div>
                  )
              }

            })
          }
          <Link to={'/' + props.org.url + '/createGroup'} className="flx flx-row flx-align-center mrgn-bottom-sm">
            <div className="vb vb--xs vb--round flx flx-row flx-center-all fill--white mrgn-right-md">
              <div className="koi-ico --24 ico--add ico-color--seaweed"></div> 
            </div>
            <div className="koi-type-body color--seaweed co-type-bold"> 
              Add Group
            </div>
          </Link>
        </div>
      )
    }
    else {
      return (
        <div className="">
          {
            (props.payload || []).map((projectItem, index) => {

              if (props.usersProjects[projectItem.projectId]) {
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
                    <div className="koi-type-body">{projectItem.name}</div>
                  </div>
                  )
              }

            })
          }
        </div>
      ) 
    }
  }
  else return null
}

const mapStateToProps = state => ({
  // ...state.projectList,
  ...state.orgSettings,
  org: state.projectList.org,
  currentUser: state.common.currentUser,
  orgUser: state.common.orgUser,
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

    this.onChangeUserRole = (user, role) => {
      // console.log(JSON.stringify(user) + ' role = ' + role)
      this.props.changeUserRole(this.props.authenticated, this.props.org.id, user, role)
    }

    this.onChangeUserStatus = (user, status) => {
      console.log(JSON.stringify(user) + ' status = ' + status)
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
      this.props.unloadOrg(this.props.authenticated, this.props.org.id, Constants.ORG_SETTINGS_PAGE);
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

    // Object.keys(Constants.USER_ROLES_MAP).forEach(function(item) {
    //   roleArray[item] = Constants.USER_ROLES_MAP[item]
    // })

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

                      {
                        orgUser && orgUser.role !== Constants.GUEST_ROLE &&
                          <Link onClick={this.onOrgInviteClick} className="flx flx-row flx-align-center vb vb--sm fill--utsuri mrgn-top-md mrgn-bottom-sm">
                            <div className="mrgn-right-sm flx flx-center-all DN">
                              <div className="koi-ico --24 ico--add--white"></div>              
                            </div>
                            <div className="koi-type-body koi-type-bold color--white">
                              Invite Users
                            </div>
                          </Link>
                      }
                    </div>
                    <div className="w-100">
                      <ul className="nav nav-pills outline-active">
                        <ListsTab tab={tab} onTabClick={this.onTabClick} />
                        <MembersTab tab={tab} onTabClick={this.onTabClick} />
                        <PendingTab tab={tab} onTabClick={this.onTabClick} orgUser={orgUser} />
                        {/*=<ManageTab tab={tab} onTabClick={this.onTabClick} />*/}
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
                        onChangeUserRole={this.onChangeUserRole}
                        onChangeUserStatus={this.onChangeUserStatus} />
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