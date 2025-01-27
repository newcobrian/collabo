import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { SAVE_MODAL } from '../../actions';
import ImagePicker from './../ImagePicker';
  
const GeoInfo = props => {
  if (!props.geo) {
    return null;
  }
  else {
    return (
      <div className="flx flx-row flx-just-start flx-align-center">
        {/** Flag and Geo **/}
        <div className={'itinerary__cover__flag flx-hold flag-' + props.geo.country}>
        </div>
      </div>
      )
  } 
}

const RenderItinerariesList = props => {
  if (!props.itinerariesList || props.itinerariesList.length === 0) {
    return (
      <div>You haven't created any guides yet.</div>
    )
  }
  return (
    <div>
    {
      props.itinerariesList.map(itinerary => {
        return (
          <li className="brdr-bottom" key={itinerary.itineraryId}>
            <Link onClick={props.handleAdd(itinerary)}>
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="vb vb--md fill--primary mrgn-right-md DN">
                  <img className="center-img mrgn-right-sm" src="../img/icons/icon40--save.png"/>
                  Save
                </div>

                {/** GEO - START **/}
                <GeoInfo geo={itinerary.geo} />          
                {/** END - GEO ROW **/}
                
                <div className="option-title color--black">
                  {itinerary.title}
                </div>
              </div>
            </Link>
          </li>
        );
     })}
    </div>
    )
}



const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class SaveModal extends React.Component {
  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'save modal' });
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const handleAdd = itinerary => ev => {
      ev.preventDefault();
      this.props.addToItinerary(this.props.authenticated, this.props.review, itinerary)
    }

    const handleItineraryClick = ev => {
      ev.preventDefault();
      this.props.showNewItineraryModal(this.props.authenticated, this.props.review);
    }


    const actions = [
      <FlatButton
        label="+ Create New Guide"
        className="vb color--primary fill--white mrng-left-sm float-left"
        hoverColor="rgba(247,247,247,.4)"
        onClick={handleItineraryClick} 
        labelStyle={{}}
        style={{
          }}
      />,
      <FlatButton
        label="Cancel"
        hoverColor="rgba(247,247,247,.24"
        className="vb"
        onClick={handleClose}
        labelStyle={{}}
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

          className="dialog dialog--save"
          style={{}}

          overlayClassName="dialog__overlay"
          overlayStyle={{}}
            
          
          title="Save to a guide"
          titleClassName="dialog__title v2-type-h2"
          titleStyle={{}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "0px"}}

          actionsContainerClassName="dialog--save__actions"
          actionsContainerStyle={{}}
            >
            
            <div className="dialog--save__content">
              <div className="dialog--save__tip-item">
                <div className="flx flx-row flx-just-start flx-align-center">
                  <div className="tip-preview-wrapper">
                     <ImagePicker images={this.props.images} />
                  </div>
                  <div className="dialog--save__tip-name color--black tip-title">{this.props.review.subject.title}</div>
                </div>
              </div>
      				<ul>
                <li className="create-new DN">
                  <Link onClick={handleItineraryClick} >
                    <div className="flx flx-row flx-just-start flx-align-center">
                      <div className="vb vb--temp">
                        <img className="center-img" src="../img/icon.add--green.png"/>
                      </div>
                      <div className="option-title create-new__title color--success">
                        Create new guide
                      </div>
                    </div>
                  </Link>
                </li>
      					<RenderItinerariesList itinerariesList={this.props.itinerariesList} handleAdd={handleAdd}/>
                    
      				</ul>
    			</div>

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(SaveModal);