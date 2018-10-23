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
import InviteForm from './../InviteForm';

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class OrgInviteModal extends React.Component {
  constructor() {
    super()

    const updateFieldEvent =
      key => ev => this.props.onUpdateCreateField(key, ev.target.value, Constants.ORG_INVITE_MODAL);

    this.changeInvites = updateFieldEvent('invites');
  }

  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'org invite modal' });
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const handleInvite = ev => {
      ev.preventDefault();

      if (!this.props.invites || this.props.invites.length < 4) {
        this.props.createSubmitError('Enter at least 1 email address to invite', Constants.ORG_INVITE_MODAL);
      }
      else {
        let lowerCaseInvites = this.props.invites.toLowerCase()
        this.props.inviteUsersToOrg(this.props.authenticated, this.props.orgName, lowerCaseInvites);
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
        className="vb vb--outline-none fill--secondary color--white"
        onClick={handleInvite}
        style={{}}
        labelStyle={{}}
      />
    ];

    const { orgName, invites } = this.props;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          open={(this.props.modalType === Constants.ORG_INVITE_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          // lockToContainerEdges={true}
          modal={false}
          
          title={'Add Members to Team: ' + orgName}

          titleClassName="co-type-h3 color--black"
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

        <div className="dialog--save flx flx-col w-100">
           
          <div>
            
            <ListErrors errors={this.props.errors}></ListErrors>

            <form>
              <fieldset className="field-wrapper">
                <div className="co-type-page-title mrgn-bottom-sm">Invite team members</div>
                <textarea
                  className="input--underline edit-itinerary__name brdr-all"
                  type="text"
                  rows="4"
                  maxLength="184"
                  placeholder="Add email addresses separated by commas..."
                  required
                  value={invites}
                  onChange={this.changeInvites} />
              </fieldset>

            </form> 
          </div>
         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(OrgInviteModal);