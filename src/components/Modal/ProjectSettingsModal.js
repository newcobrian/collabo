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

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class ProjectSettingsModal extends React.Component {
  constructor() {
    super()

    this.toggleCheckbox = label => ev => {
      this.props.onUpdateFriendsCheckbox(label, this.props.selectedUsers, Constants.PROJECT_INVITE_MODAL)
    }

    this.onTabClick = tab => {
      
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

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          open={(this.props.modalType === Constants.PROJECT_SETTINGS_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          // lockToContainerEdges={true}
          modal={false}
          
          title={this.props.project.name + ' Group Members'}

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
              {/*<ul className="nav nav-pills outline-active">
                <MembersTab tab={this.props.tab} onTabClick={this.onTabClick} />
                <ManageTab tab={this.props.tab} onTabClick={this.onTabClick} />
              </ul>*/}
            </div>

          <div>
            {
              (this.props.projectMembers || []).map(teammate => {
                return (
                  <div key={teammate.userId}>
                    <div className="mrgn-bottom-sm pdding-all-sm w-100 flx flx-row flx-align-center">
                      <div className="sidebar-icon mrgn-right-md">
                      </div>
                      <Link to={'/' + this.props.orgURL + '/user/' + teammate.username}>
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
         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectSettingsModal);