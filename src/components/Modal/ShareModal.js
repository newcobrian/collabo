import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';

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

class ShareModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Close"
        className="vb"
        hoverColor="rgba(247,247,247,.2)"
        onTouchTap={handleClose}
        style={{
          }}
          labelStyle={{   
                      }}
      />
    ];

    const itinerary = this.props.itinerary;
    const shortName = itinerary && itinerary.geo && itinerary.geo.shortName ? itinerary.geo.shortName : itinerary.geo.label;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === Constants.SHARE_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          className="dialog-wrapper"
          style={{
              
            }}

          title={"Share Modal"}
          titleClassName="dialog__title v2-type-h2"
          titleStyle={{}}

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
        {itinerary.title}
        <div className="dialog--save flx flx-col color--black font--alpha">
           <div className="flx-item-right flx flx-row">
              <div className="vb vb--sm vb--outline fill--white color--black">
                <FacebookShareButton
                  url={Constants.VIEWS_URL + `/guides/${this.props.itinerary.id}`}
                  quote={'Check out my travel guide "' + itinerary.title + '" for ' + shortName}
                  hashtag={'#views'}
                  className="Demo__some-network__share-button">
                  <FacebookIcon
                    size={24}
                    round />
                </FacebookShareButton>

                <FacebookShareCount
                  url={Constants.VIEWS_URL + `/guide/${this.props.itinerary.id}`}
                  className="mrgn-left-sm">
                  {count => count}
                </FacebookShareCount>
              </div>
              <div className="vb vb--sm vb--outline fill--white color--black mrgn-left-n-1">
                <TwitterShareButton
                  url={Constants.VIEWS_URL + `/guide/${this.props.itinerary.id}`}
                  title={'Check out my travel guide "' + itinerary.title + '" for ' + shortName + ':'}
                  hashtags={['views']}
                  className="Demo__some-network__share-button">
                  <TwitterIcon
                    size={24}
                    round />
                </TwitterShareButton>
              </div>

            </div>
            
        </div>

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ShareModal);