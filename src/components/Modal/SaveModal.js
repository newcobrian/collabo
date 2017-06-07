import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { SAVE_MODAL } from '../../actions';

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class SaveModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const handleAdd = itinerary => ev => {
      ev.preventDefault();
      this.props.addToItinerary(this.props.authenticated, this.props.review, itinerary)
    }

    const actions = [
      <FlatButton
        label="Cancel"
        hoverColor="white"
        onTouchTap={handleClose}
        labelStyle={{textTransform: 'none', color:'rgba(0,0,0,.3)'}}
        style={{
          }}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === SAVE_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}

          className="dialog--save"
          style={{}}

          overlayClassName="dialog--save__overlay"
          overlayStyle={{}}
          
          title="Choose an itinerary for..."
          titleClassName="dialog--save__title v2-type-h2"
          titleStyle={{padding: "10px 20px", fontWeight: "700", fontSize: "20px"}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "400px", maxWidth: "none", position: "fixed", top: "0", right:"0"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "30px 0px"}}

          actionsContainerClassName="dialog--save__actions"

          

          style={{}}>
            
            <div className="dialog--save__content">
            <div className="dialog--save__tip-item">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="tip-preview-wrapper mrgn-right-md">
                  <img className="center-img" src="../img/views.ramen.temp.png"/>
                </div>
                <div className="dialog--save__tip-name">{this.props.review.title}</div>
              </div>
            </div>
    				<ul>
    					{this.props.itinerariesList.map(itinerary => {
				        return (
  		            <li className="" key={itinerary.itineraryId}>
                    <Link onClick={handleAdd(itinerary)}>
                      <div className="flx flx-row flx-just-start flx-align-center">
                        <div className="v-button v-button--select">
                          {/*<img className="center-img" src="../img/icon.bird--dark.png"/>*/}
                        </div>
      						    	<div className="save-to__title">
      						    		{itinerary.title}
      						    	</div>
                      </div>
                    </Link>
  				        </li>
				        );
  				     })}
                  <li className="create-new">
                    <div className="flx flx-row flx-just-start flx-align-center">
                      <div className="v-button v-button--temp mrgn-right-md">
                        <img className="center-img" src="../img/icon.add--green.png"/>
                      </div>
                      <div className="save-to__title color--success">
                        Create new itinerary
                      </div>
                    </div>
                  </li>
    				</ul>
    			</div>

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(SaveModal);