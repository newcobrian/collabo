import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import ProfilePic from './../ProfilePic'
import ListErrors from './../ListErrors'

const mapStateToProps = state => ({
  ...state.modal,
  ...state.projectInvite,
  authenticated: state.common.authenticated
});

class ProjectInviteModal extends React.Component {
  constructor() {
    super()

    this.toggleCheckbox = label => ev => {
      this.props.onUpdateSelector(label, this.props.selectedUsers, Constants.PROJECT_INVITE_MODAL)
    }
  }

  componentDidMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project invite modal', 'orgId': this.props.org.id, 'projectId': this.props.projectId });
  }

  render() {
    const handleClose = ev => {
      this.props.hideModal();
    }

    const handleInvite = ev => {
      ev.preventDefault();
      console.log(JSON.stringify(this.props.selectedUsers))

      if (!this.props.selectedUsers || this.props.selectedUsers.length < 1) {
        this.props.createSubmitError('Select at least one person to invite', Constants.PROJECT_INVITE_MODAL);
      }
      else {
        let project = Object.assign({}, {projectId: this.props.projectId}, this.props.project)
        this.props.inviteOrgUsersToProject(this.props.authenticated, this.props.org, project, this.props.selectedUsers)
      }
    }

    const actions = [
      <FlatButton
        label="Cancel"
        className="vb vb--outline-none fill--white color--grey"
        onClick={handleClose}
        style={{}}
        labelStyle={{}}
      />,
      <FlatButton
        label="Invite"
        className="vb vb--outline-none fill--seaweed color--white"
        onClick={handleInvite}
        style={{}}
        labelStyle={{}}
      />
    ];

    const { usersList, projectMemberCheck } = this.props;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          open={(this.props.modalType === Constants.PROJECT_INVITE_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          // lockToContainerEdges={true}
          modal={false}
          
          title={'Add members to group: ' + this.props.project.name}

          titleClassName="co-type-h3 color--black"
          titleStyle={{}}

          className="dialog dialog--basic"
          style={{}}

          overlayClassName="dialog-overlay--basic"
          overlayStyle={{}}
          
          contentClassName="dialog-content--basic"
          contentStyle={{width: "auto", maxWidth: "600px"}}
          
          bodyClassName="dialog-body--basic"
          bodyStyle={{}}

          actionsContainerClassName="dialog-actions--basic"
          actionsContainerStyle={{}}
        >
        <div className="top-right-exit fill--white flx flx-row flx-align-center pdding-all-sm pdding-right-md">
          <div onClick={handleClose} className="koi-icon-wrapper color--utsuri flx-item-right link-pointer">
            <img className="center-img" src="/img/icon-close.png"/>
          </div>
        </div>
            
            <ListErrors errors={this.props.errors}></ListErrors>

            <form>
              {
                (usersList || []).map(teammate => {
                  // if user isn't a team member, let user select them
                  //this.props.projectMembers[teammate.userId]
                  if (!projectMemberCheck || !projectMemberCheck[teammate.userId]) {
                      return (
                        <div className="mrgn-bottom-sm pdding-all-sm w-100 flx flx-row flx-align-center" key={teammate.userId}>
                          <div className="sidebar-icon mrgn-right-md pdding-left-xs">
                          <input
                              name={teammate.userId}
                              type="checkbox"
                              className="koi-ico --24"
                              onChange={this.toggleCheckbox(teammate.userId)} />
                          </div>
                          <div className="">
                            <div className="reviewer-photo photo-lg mrgn-right-sm">
                              <ProfilePic src={teammate.image} />
                          </div>
                      </div>
                      <div className="co-type-body w-100">
                        <div className="co-type-bold color--black">
                            {teammate.username}
                        </div>
                        </div>
                        
                  </div>
                      )
                  }
                  // otherwise just show username
                  else {
                    return (
                      <div key={teammate.userId}>
                        <div className="mrgn-bottom-sm pdding-all-sm w-100 flx flx-row flx-align-center">
                          <div className="sidebar-icon mrgn-right-md">
                            <div className="koi-ico --24 ico--checkmark--primary opa-20"></div>
                          </div>
                          <div className="reviewer-photo photo-lg mrgn-right-sm">
                            <ProfilePic src={teammate.image} />
                          </div>

                          <div className="koi-type-body w-100 color--black flx flx-col flx-just-start flx-align-start">
                                <div className="koi-type-bold">{teammate.username}</div>
                                <div className="thread-timestamp opa-60">Joined</div>

                          </div>
                        </div>
                      </div>

                    )
                  }
                })
              }

            </form> 
 

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectInviteModal);