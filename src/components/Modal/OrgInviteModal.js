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

const InviteForm = props => {
  if (!props.selectProjectMode) {
    return (
      <div className="w-100">
        <div className="koi-type-dialog-title mrgn-bottom-sm color--black">Invite members to your team</div>

        <div className="illustration mrgn-bottom-md flx-hold flx flx-col flx-center-all">
          <img className="center-img" src="/img/illu_orginvite.png"/>
        </div>
        <form>
        <ListErrors errors={props.errors}></ListErrors>

        
          <fieldset className="field-wrapper w-100">
            
            <textarea
              className="input--underline edit-itinerary__name brdr-all"
              type="text"
              rows="4"
              maxLength="184"
              placeholder="Add email addresses separated by commas..."
              required
              value={props.invites}
              onChange={props.changeInvites} />
          </fieldset>

          <fieldset className="field-wrapper mrgn-top-md">
            <label className="koi-radio">
              <div className="co-type-body co-type-bold">Member</div>
              <div className="thread-timestamp">Will have access to all public groups</div>
                <input type="radio" checked={props.role === Constants.USER_ROLE} onChange={props.toggleRole(Constants.USER_ROLE)}/>
                <span className="checkmark"></span>
            </label>

            <label className="koi-radio">
              <div className="co-type-body co-type-bold">Guest</div>
              <div className="thread-timestamp">Will have access to only the groups that you choose</div>
                <input type="radio" checked={props.role === Constants.GUEST_ROLE} onChange={props.toggleRole(Constants.GUEST_ROLE)}/>
                <span className="checkmark"></span>
            </label>
          </fieldset>

        </form> 
      </div>
    )
  }
  else return null
}

const ProjectSelector = props => {
  if (props.selectProjectMode) {
    if (!props.projectList || props.projectList.length < 1) {
      return (
        <div>
          Sorry, you aren't in any groups
        </div>
        )
    }
    else {
      return (
        <div>
          <ListErrors errors={props.errors}></ListErrors>
          {
            props.projectList.map((projectItem, index) => {
                return (
                  <div className="flx flx-row flx-align-center mrgn-bottom-sm" key={projectItem.id}>
                    <div className="sidebar-icon mrgn-right-md pdding-left-xs">
                      <input
                          name={projectItem.id}
                          type="checkbox"
                          className="koi-ico --24"
                          onChange={props.toggleCheckbox(projectItem.id)} />
                    </div>
                    <div className="koi-type-body">
                      {props.projectNames[projectItem.id] ? props.projectNames[projectItem.id].name : 'unknown project name'}
                    </div>
                    <div className="koi-type-body">
                      ({projectItem.isPublic ? 'Public' : 'Private'})
                    </div>
                  </div>
                )
            })
          }
        </div>
      )
    }
  }
  else return null
}

const mapStateToProps = state => ({
  ...state.modal,
  ...state.orgInvite,
  ...state.projectList,
  authenticated: state.common.authenticated
});

class OrgInviteModal extends React.Component {
  constructor() {
    super()

    const updateFieldEvent =
      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ORG_INVITE_MODAL);

    this.changeInvites = updateFieldEvent('invites');

    this.toggleRole = key => ev => {
      this.props.onUpdateCreateField('role', key, Constants.ORG_INVITE_MODAL)
    }

    this.toggleCheckbox = label => ev => {
      this.props.onUpdateSelector(label, this.props.selected, Constants.ORG_INVITE_MODAL)
    }
  }

  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'org invite modal' });
  }

  render() {
    const handleClose = ev => {
      this.props.hideModal();
    }

    const handleInvite = ev => {
      ev.preventDefault();
      // if inviting guests
      if (this.props.role === Constants.GUEST_ROLE) {
        if (!this.props.selectProjectMode) {
          this.props.pickGuestProjects()
        }
        else if (!this.props.selected || this.props.selected.length < 1) {
          this.props.createSubmitError('Invite the user to at least 1 group', Constants.ORG_INVITE_MODAL);
        }
        else {
          let lowerCaseInvites = this.props.invites.toLowerCase()
          this.props.inviteUsersToOrg(this.props.authenticated, this.props.org, lowerCaseInvites, Constants.GUEST_ROLE, this.props.selected);
        }
      }
      // inviting users
      else {
        if (!this.props.invites || this.props.invites.length < 3) {
          this.props.createSubmitError('Enter at least 1 email address to invite', Constants.ORG_INVITE_MODAL);
        }
        else {
          let lowerCaseInvites = this.props.invites.toLowerCase()
          this.props.inviteUsersToOrg(this.props.authenticated, this.props.org, lowerCaseInvites, Constants.USER_ROLE, null);
        }
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

    const { org, invites, selectProjectMode, role, errors, projectList, projectNames, selected } = this.props;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          open={(this.props.modalType === Constants.ORG_INVITE_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          // lockToContainerEdges={true}
          modal={false}
          
          title={'Add Members to Team: ' + org.name}

          titleClassName="DN co-type-h3 color--black"
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
          <InviteForm
            selectProjectMode={selectProjectMode}
            invites={invites}
            role={role}
            errors={errors}
            toggleRole={this.toggleRole}
            changeInvites={this.changeInvites}
            />

          <ProjectSelector
            selectProjectMode={selectProjectMode}
            projectList={projectList}
            projectNames={projectNames}
            selected={selected}
            toggleCheckbox={this.toggleCheckbox}
            errors={errors}
            />
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(OrgInviteModal);