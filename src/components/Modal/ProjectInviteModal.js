import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
// import ProjectInvite from './../ProjectInvite'
import ProfilePic from './../ProfilePic'
import ListErrors from './../ListErrors'

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class ProjectInviteModal extends React.Component {
  constructor() {
    super()

    this.toggleCheckbox = label => ev => {
      this.props.onUpdateFriendsCheckbox(label, this.props.selectedUsers, Constants.PROJECT_INVITE_MODAL)
    }
  }

  componentWillMount() {
    // this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'project invite modal' });
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const handleInvite = ev => {
      ev.preventDefault();

      if (!this.props.selectedUsers || this.props.selectedUsers.length < 1) {
        this.props.createSubmitError('Select at least one person to invite', Constants.PROJECT_INVITE_MODAL);
      }
      else {
        this.props.inviteOrgUsersToProject(this.props.authenticated, this.props.orgId, this.props.projectId, this.props.selectedUsers)
      }
    }

    const actions = [
      <FlatButton
        label="Cancel"
        className="vb vb--outline-none fill--secondary color--grey"
        onClick={handleClose}
        style={{}}
        labelStyle={{}}
      />,
      <FlatButton
        label="Invite"
        className="vb vb--outline-none fill--primary color--white"
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
          
          title="Select people to invite"

          titleClassName="dialog__title v2-type-h2"
          titleStyle={{}}

          className="dialog dialog--save"
          style={{}}

          overlayClassName="dialog__overlay"
          overlayStyle={{}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "0px"}}

          actionsContainerClassName="dialog--save__actions"
          actionsContainerStyle={{}}
        >

        <div className="dialog--save flx flx-col">
           
          <div>

            <div className="v2-type-h2 subtitle">Select users to invite</div>
            
            <ListErrors errors={this.props.errors}></ListErrors>

            <form>
              {
                (usersList || []).map(teammate => {
                  // if user isn't a team member, let user select them
                  //this.props.projectMembers[teammate.userId]
                  if (!projectMemberCheck || !projectMemberCheck[teammate.userId]) {
                      return (
                        <div className="roow roow-row mrgn-bottom-sm pdding-all-sm list-row default-card-white bx-shadow" key={teammate.userId}>
                          <div>
                          <input
                              name={teammate.userId}
                              type="checkbox"
                              onChange={this.toggleCheckbox(teammate.userId)} />
                          </div>
                          <div className="">
                            <div className="reviewer-photo center-img">
                              <ProfilePic src={teammate.image} />
                          </div>
                      </div>
                      <div className="roow roow-col-left">
                        <div>
                            {teammate.username}
                        </div>
                        </div>
                        
                  </div>
                      )
                  }
                  // otherwise just show username
                  else {
                    return (
                      <div className="roow roow-row mrgn-bottom-sm pdding-all-sm list-row default-card-white bx-shadow" key={teammate.userId}>
                          <div className="">
                            <div className="reviewer-photo center-img">
                              <ProfilePic src={teammate.image} />
                          </div>
                      </div>
                      <div className="roow roow-col-left">
                        <div>
                            {teammate.username} - joined
                        </div>
                        </div>
                        
                  </div>
                    )
                  }
                })
              }

            </form> 
          </div>
         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ProjectInviteModal);