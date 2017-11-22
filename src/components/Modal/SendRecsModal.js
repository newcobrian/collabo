import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const {
  FacebookShareButton,
  TwitterShareButton
} = ShareButtons;

const {
  FacebookShareCount
} = ShareCounts;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class SendRecsModal extends React.Component {
  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Cancel"
        className="vb vb--md w-100"
        hoverColor="rgba(247,247,247,.2)"
        onClick={handleClose}
        style={{
          }}
          labelStyle={{   
                      }}
      />
    ];

    const recObject = this.props.recObject;
    const itineraryId = this.props.itineraryId;
    const recId = this.props.recId;
    const shortName = recObject && recObject.geo && recObject.geo.shortName ? recObject.geo.shortName : recObject.geo.label;

    const onCopyClick = () => {
      this.props.openSnackbar('Share link copied to clipboard');
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === Constants.SEND_RECS_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          className="dialog-wrapper"
          style={{
              
            }}

          title="Share this Guide"
          titleClassName="dialog__title v2-type-h2"
          titleStyle={{
            textAlign: "center"
          }}

          className="dialog dialog--save"
          style={{height: "100%"}}

          overlayClassName="dialog__overlay"
          overlayStyle={{}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px", height: "100%"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "0px", height: "100%"}}

          actionsContainerClassName="dialog--save__actions"
          actionsContainerStyle={{}}
          
        >
          <div className="dialog--save flx flx-col color--black font--alpha">
                         
            <div className="w-100 ta-center pdding-left-md pdding-right-md pdding-top-md flx flx-col flx-center-all">
              <div className="pdding-all-sm">{'title'}</div>
              <i className="material-icons color--black opa-20">arrow_downward</i>
            </div>
            <div className="pdding-left-md pdding-right-md pdding-top-md pdding-bottom-xs w-100">

                <FacebookShareButton
                  url={Constants.VIEWS_URL + `/recommendations/` + recId}
                  quote={'I\'m looking for travel recommendations for ' + shortName}
                  hashtag={'#views'}
                  className="flx flx-row flx-center-all w-100 vb vb--md vb--outline--none vb--fb">
                  <div className="flx-item-left">
                    <FacebookIcon
                      size={24}
                      className=""
                      round />
                  </div>
                  <div className="color--white w-100">Share on Facebook</div>
                  <FacebookShareCount
                    url={Constants.VIEWS_URL + `/recommendations/${recId}`}
                    className="color--white flx-item-right">
                    {count => count}
                  </FacebookShareCount>

                </FacebookShareButton>
               
                
            </div>   

            <div className="pdding-left-md pdding-right-md pdding-top-xs pdding-bottom-xs w-100"> 
                <TwitterShareButton
                  url={Constants.VIEWS_URL + `/recommendations/${recId}`}
                  title={'I\'m looking for travel recommendations for ' + shortName}
                  hashtags={['views']}
                  className="flx flx-row flx-center-all w-100 vb vb--md vb--outline--none vb--tw">
                  <div className="flx-item-left">
                    <TwitterIcon
                      size={24}
                      className=""
                      round />
                  </div>
                    <div className="color--white w-100">Share on Twitter</div>
                </TwitterShareButton>
            </div>



            <div className="pdding-left-md pdding-right-md pdding-top-xs pdding-bottom-xs w-100">
              <CopyToClipboard 
                className="flx flx-row flx-center-all w-100 vb vb--md vb--outline--none color--white fill--success"
                text={Constants.VIEWS_URL + '/recommendations/' + recId}
                onCopy={onCopyClick}>
                  <div className="flx flx-row flx-center-all w-100">
                    <i className="material-icons color--white opa-60 flx-item-left">link</i>
                    <div className="w-100">Copy link to clipboard</div>
                  </div>
              </CopyToClipboard>
              <div className="v2-type-caption pdding-all-md ta-center opa-40">{'https://myviews.io/recommendations/' + recId}</div>
            </div>
          
          </div>


        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(SendRecsModal);