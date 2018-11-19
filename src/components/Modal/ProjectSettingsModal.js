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

const MembersList = props => {
  if (props.tab === Constants.MEMBERS_TAB) {
    return (
      <div>
        {
          (props.projectMembers || []).map(teammate => {
            return (
              <div key={teammate.userId}>
                <div className="mrgn-bottom-sm pdding-all-sm w-100 flx flx-row flx-align-center">
                  <div className="sidebar-icon mrgn-right-md">
                  </div>
                  <Link to={'/' + props.orgURL + '/user/' + teammate.username}>
                    <div className="reviewer-photo photo-lg mrgn-right-sm">
                      <ProfilePic src={teammate.image} />
                    </div>

                    <div className="co-type-body w-100 color--black flx flx-col flx-just-start flx-align-start">
                          <div className="co-type-bold">{teammate.username}</div>
                          <div className="">{teammate.fullName}</div>
                    </div>
                  </Link>
                </div>
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
      <div>
        <div>Are you sure you want to delete this group? All threads will be permanently deleted.</div>
        <input
            type="checkbox"
            checked={props.confirmedDelete}
            onChange={props.onToggleConfirm} />
            Click this checkbox to confirm and then click the delete button
        <button onClick={onDeleteClick}>Delete</button>
      </div>
    )
  }
  else return null
}

const ManageForm = props => {
  if (props.tab === Constants.MANAGE_TAB) {
    return (
      <div>
        <div>
          <Link onClick={props.onToggleDeleteText}>Delete this group</Link>
          <DeleteSection 
            isDeleteMode={props.isDeleteMode}
            confirmedDelete={props.confirmedDelete}
            onToggleConfirm={props.onToggleConfirm}
            onDelete={props.onDelete} />
        </div>
        <form onSubmit={props.onSubmit}>
            <fieldset className="form-group">
              <label>Project Name</label>
              <input
                className="form-control form-control-lg"
                type="text"
                placeholder="Project Name"
                required
                value={props.projectName}
                onChange={props.updateField('projectName')} />
            </fieldset>

            <ListErrors errors={props.errors}></ListErrors>

            <button
              className="vb fill--utsuri color--white ta-center mrgn-bottom-sm w-100"
              type="submit" >
              Save Changes
            </button>
        </form>
      </div>
    );
  }
  else return null
}

const mapStateToProps = state => ({
  ...state.modal,
  ...state.projectSettings,
  authenticated: state.common.authenticated
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
  }

  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project settings modal' });
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

    const { authenticated, tab, projectId, project, projectName, projectMembers, orgURL, errors, 
      isDeleteMode, confirmedDelete } = this.props

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

          titleClassName="co-type-h3 color--black"
          titleStyle={{}}

          className="dialog dialog--basic"
          style={{}}

          overlayClassName="dialog-overlay--basic"
          overlayStyle={{}}
          
          contentClassName="dialog-content--basic"
          contentStyle={{width: "auto", maxWidth: "600px"}}
          
          bodyClassName="dialog-body--basic"
          bodyStyle={{padding: "0px"}}

          actionsContainerClassName="dialog-actions--basic"
          actionsContainerStyle={{}}
        >

        <div className="dialog--save flx flx-col w-100">
           <div className="w-100">
              <ul className="nav nav-pills outline-active">
                <MembersTab tab={tab} onTabClick={this.onTabClick} />
                <ManageTab tab={tab} onTabClick={this.onTabClick} />
              </ul>
            </div>

          <div>

          <MembersList
            tab={tab}
            projectMembers={projectMembers}
            orgURL={orgURL} />
            
          <ManageForm
            tab={tab}
            projectName={projectName}
            authenticated={authenticated}
            updateField={this.updateField}
            isDeleteMode={isDeleteMode}
            onSubmit={this.onUpdateProjectSettings}
            errors={errors}
            onToggleDeleteText={this.onToggleDeleteText}
            onToggleConfirm={this.onToggleConfirm}
            confirmedDelete={confirmedDelete}
            onDelete={this.onDelete}
            />

            
          </div>
         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectSettingsModal);