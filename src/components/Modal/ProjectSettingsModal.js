import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import ProfilePic from './../ProfilePic'
import ListErrors from './../ListErrors'

const REMOVE_ACTION = 'REMOVE'
const ADD_ACTION = 'ADD'

const MembersTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick(Constants.MEMBERS_TAB);
  }

  return (
    <li onClick={clickHandler}
    className={ props.tab === Constants.MEMBERS_TAB ? 'nav-link color--black brdr-color--primary active' : 'nav-link color--black' }
    >
      
      <div className="koi-body-type">
        Members
      </div>
      <div className="nav-underline"></div>
    </li>
  );
};

const ManageTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick(Constants.MANAGE_TAB);
  };

  if (props.orgUser && props.orgUser.role !== Constants.GUEST_ROLE) {
    return (
      <li className={ props.tab === Constants.MANAGE_TAB ? 'nav-link color--black brdr-color--primary active' : 'nav-link color--black' }
          onClick={clickHandler}>
        <div className="koi-body-type">
          Manage Settings
        </div>
        <div className="nav-underline"></div>
      </li>
    );
  }
  else {
    return null
  }
};

const RemoveFromProjectButton = props => {
    const handleButtonClick = ev => {
      ev.preventDefault()
      if (props.isMember) {
        props.removeFromProject(REMOVE_ACTION, props.teammate)
      }
      else {
        props.removeFromProject(ADD_ACTION, props.teammate)
      }
    }
    
    // if user is Admin or higher
    // AND teammate is not an owner or primary owner or Admin
    // AND user is higher level than teammate
    if (props.orgUser && props.orgUser.role <= Constants.ADMIN_ROLE &&
        props.teammate.role >= Constants.USER_ROLE && props.orgUser.role < props.teammate.role) {
      return (
        <div className="flx flx-center-all mrgn-right-md">
      <button onClick={handleButtonClick} className={"vb vb--xs vb--round flx flx-row flx-center-all " + (props.isMember ?  'fill--mist color--black': 'fill--mist color--black' )}>
          { props.isMember ? 'Remove from List' : 'Add to List' }
      </button>
    </div>
      )
    }
    else return null
  }

const MembersList = props => {
  if (props.tab === Constants.MEMBERS_TAB) {
    return (
      <div>
        {
          (props.projectMembers || []).map(teammate => {
            return (
              <div key={teammate.userId} className="flx flx-row w-100 flx-align-center">
                <Link 
                  to={'/' + props.orgURL + '/user/' + teammate.username} 
                  onClick={props.hideModal}
                  className="mrgn-bottom-sm pdding-all-sm w-100 flx flx-row flx-align-center">

                    <div className="reviewer-photo photo-lg mrgn-right-sm">
                      <ProfilePic src={teammate.image} />
                    </div>

                    <div className="co-type-body w-100 color--black flx flx-col flx-just-start flx-align-start">
                          <div className="co-type-bold color--black">{teammate.username}</div>
                          <div className="thread-timestamp opa-60">{teammate.fullName}</div>
                    </div>
                </Link>
                <RemoveFromProjectButton 
                  orgUser={props.orgUser} 
                  teammate={teammate} 
                  removeFromProject={props.removeFromProject}
                  isMember={props.isMember[teammate.userId]} />
              </div>
              )
            })
          }
      </div>
    )
  }
  else return null
}

const DeleteSection = props => {

  const onDeleteClick = () => {
    if (props.confirmedDelete) {
      props.onDelete()
    }
  }

  if (props.isDeleteMode) {
    return (
      <div className="flx flx-col flx-align-start brdr-all pdding-all-md mrgn-top-sm">
      
        <div className="koi-type-body">Are you sure you want to delete this group? All threads will be permanently deleted.</div>
        <div className="flx flx-row flx-align-start flx-just-center mrgn-top-sm">
        <input
            type="checkbox"
            checked={props.confirmedDelete}
            onChange={props.onToggleConfirm} />
            <div className=" mrgn-left-sm koi-type-caption">Click this checkbox to confirm and then click the delete button</div>
        </div>
        <button className="vb vb--sm brdr-all fill--tancho mrgn-top-sm color--white" onClick={onDeleteClick}>Delete</button>
      </div>
    )
  }
  else return null
}

const ManageForm = props => {
  if (props.tab === Constants.MANAGE_TAB && props.orgUser && props.orgUser !== Constants.GUEST_ROLE) {
    return (
      <div className="w-100">
        <form onSubmit={props.onSubmit}>
          <label>Project Name</label>
          <div className="flx flx-row flx-align-center flx-just-start">
              <fieldset className="form-group mrgn-right-sm w-100">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Project Name"
                  required
                  value={props.projectName}
                  onChange={props.updateField('projectName')} />
              </fieldset>
              <button
                className="vb fill--utsuri color--white ta-center mrgn-left-sm"
                type="submit" >
                Save Changes
              </button>
            </div>
            <ListErrors errors={props.errors}></ListErrors>
        </form>

        <div className="w-100 mrgn-top-md">
          <Link className="color--tancho koi-type-caption text-hover" onClick={props.onToggleDeleteText}>Delete this group</Link>
          <DeleteSection 
            isDeleteMode={props.isDeleteMode}
            confirmedDelete={props.confirmedDelete}
            onToggleConfirm={props.onToggleConfirm}
            onDelete={props.onDelete} />
        </div>

      </div>
    );
  }
  else return null
}

const mapStateToProps = state => ({
  ...state.modal,
  ...state.projectSettings,
  authenticated: state.common.authenticated,
  orgUser: state.common.orgUser,
  org: state.projectList.org
});

class ProjectSettingsModal extends React.Component {
  constructor() {
    super()

    this.updateField =
      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.PROJECT_SETTINGS_MODAL);

    this.toggleCheckbox = label => ev => {
      this.props.onUpdateFriendsCheckbox(label, this.props.selectedUsers, Constants.PROJECT_INVITE_MODAL)
    }

    this.onTabClick = tab => {
      this.props.changeProjectSettingsTab(tab)
    }

    this.onUpdateProjectSettings = ev => {
      ev.preventDefault();

      if (!this.props.projectName || this.props.projectName.length < 1) {
        this.props.createSubmitError('Please enter a project name', Constants.PROJECT_SETTINGS_MODAL);
      }
      else if (!(/^[A-Za-z0-9- ]+$/.test(this.props.projectName)))  {
        this.props.createSubmitError('Project names can only contain letters, numbers, spaces, and \'-\'', Constants.PROJECT_SETTINGS_MODAL);
      }
      else {
        this.props.updateProjectName(this.props.authenticated, this.props.projectId, this.props.project, this.props.projectName)
      }
    }

    this.onDelete = ev => {
      if (this.props.confirmedDelete) {
        this.props.deleteProject(this.props.authenticated, this.props.projectId, this.props.project, this.props.orgURL)
      }
    }

    this.onToggleDeleteText = ev => {
      ev.preventDefault()
      this.props.onToggleDeleteProjectMode('isDeleteMode')
    }

    this.onToggleConfirm = ev => {
      this.props.onToggleDeleteProjectMode('confirmedDelete')
    }

    this.removeFromProject = (action, teammate) => {
      let project = Object.assign({}, this.props.project, { projectId: this.props.projectId })
      if (action === REMOVE_ACTION) {
        this.props.leaveProject(teammate.userId, teammate, this.props.org.id, project)
      }
      else if (action === ADD_ACTION) {
        this.props.joinProject(teammate.userId, teammate, this.props.org.id, project)
      }
    }
  }

  componentDidMount() {
    this.props.loadProjectMembers(this.props.projectId, Constants.PROJECT_INVITE_MODAL)
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project settings modal', 'orgId': this.props.org.id, 'projectId': this.props.projectId });
  }

  render() {
    const handleClose = ev => {
      this.props.hideModal();
    }

    // const handleInvite = ev => {
    //   ev.preventDefault();

    //   if (!this.props.selectedUsers || this.props.selectedUsers.length < 1) {
    //     this.props.createSubmitError('Select at least one person to invite', Constants.PROJECT_INVITE_MODAL);
    //   }
    //   else {
    //     let project = Object.assign({}, {projectId: this.props.projectId}, this.props.project)
    //     this.props.inviteOrgUsersToProject(this.props.authenticated, this.props.org, project, this.props.selectedUsers)
    //   }
    // }

    const actions = [
      <FlatButton
        label="Close"
        className="vb vb--outline-none fill--white color--grey"
        onClick={handleClose}
        style={{}}
        labelStyle={{}}
      />
    ];

    const { authenticated, tab, projectId, project, projectName, projectMembers, orgURL, errors, orgUser,
      isDeleteMode, confirmedDelete, isMember } = this.props

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          open={(this.props.modalType === Constants.PROJECT_SETTINGS_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          // lockToContainerEdges={true}
          modal={false}
          
          title={project.name + ' Group Members'}

          titleClassName="co-type-h3 color--black DN"
          titleStyle={{}}

          className="dialog dialog--basic"
          style={{}}

          overlayClassName="dialog-overlay--basic"
          overlayStyle={{}}
          
          contentClassName="dialog-content--basic"
          contentStyle={{}}
          
          bodyClassName="dialog-body--basic dialog-header-push"
          bodyStyle={{}}

          actionsContainerClassName="dialog-actions--basic DN"
          actionsContainerStyle={{}}
        >
        <div className="threadmodal-header w-100 fill--white flx flx-row flx-align-center brdr-bottom pdding-all-sm pdding-right-md">
          <div className="koi-type-dialog-title color--black pdding-left-sm">Group Settings</div>  
          <div onClick={handleClose} className="koi-icon-wrapper color--utsuri flx-item-right link-pointer">
            <img className="center-img" src="/img/icon-close.png"/>
          </div>
        </div>


         <div className="w-100">
            <ul className="nav nav-pills outline-active">
              <MembersTab tab={tab} onTabClick={this.onTabClick} />
              <ManageTab tab={tab} onTabClick={this.onTabClick} orgUser={orgUser} />
            </ul>
          </div>



          <MembersList
            tab={tab}
            projectMembers={projectMembers}
            orgURL={orgURL}
            orgUser={orgUser}
            removeFromProject={this.removeFromProject}
            isMember={isMember}
            hideModal={this.props.hideModal} />
            
          <ManageForm
            tab={tab}
            projectName={projectName}
            authenticated={authenticated}
            orgUser={orgUser}
            updateField={this.updateField}
            isDeleteMode={isDeleteMode}
            onSubmit={this.onUpdateProjectSettings}
            errors={errors}
            onToggleDeleteText={this.onToggleDeleteText}
            onToggleConfirm={this.onToggleConfirm}
            confirmedDelete={confirmedDelete}
            onDelete={this.onDelete}
            />

            

         

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectSettingsModal);