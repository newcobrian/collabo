import React from 'react';
import * as Actions from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import { SAVE_MODAL } from '../../actions';
import ImagePicker from './../ImagePicker';



const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class SaveModal extends React.Component {
  componentWillMount() {
    this.props.sendMixpanelEvent('Save Modal');
  } 

  render() {
    const handleClose = () => {
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

    const GeoInfo = props => {
      if (!props.geo) {
        return null;
      }
      else {
        return (
          <Link to={`/places/${props.geo.placeId}`}>
            <div className="flx flx-row flx-just-start flx-align-center">
              {/** Flag and Geo **/}
              <div className={'itinerary__cover__flag flx-hold flag-' + props.geo.country}>
              </div>
            </div>
          </Link>
          )
      }
    }


    const actions = [
      <FlatButton
        label="+ Create New Guide"
        className="vb vb--shadow-none color--primary"
        hoverColor="white"
        onTouchTap={handleItineraryClick}
        labelStyle={{fontWeight: '400',
                        fontSize: '14px',
                        letterSpacing: '2px',
                        boxShadow: 'none'
                    }}
        style={{
          }}
      />,
      <FlatButton
        label="Cancel"
        hoverColor="white"
        className="vb vb--shadow-none"
        onTouchTap={handleClose}
        labelStyle={{fontWeight: '400',
                    fontSize: '14px',
                    letterSpacing: '2px',
                    color:'rgba(0,0,0,.5)',
                    boxShadow: 'none'
                    }}
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
           
          title="Choose a guide for..."
          titleClassName="dialog__title v2-type-h2"
          titleStyle={{padding: "10px 20px", fontWeight: "700", fontSize: "20px"}}
          
          contentClassName="dialog--save__wrapper"
          contentStyle={{width: "auto", maxWidth: "600px"}}
          
          bodyClassName="dialog--save__body"
          bodyStyle={{padding: "30px 0px"}}

          actionsContainerClassName="dialog--save__actions">
            
            <div className="dialog--save__content">
            <div className="dialog--save__tip-item">
              <div className="flx flx-row flx-just-start flx-align-center">
                <div className="tip-preview-wrapper">
                   <ImagePicker images={this.props.images} />
                </div>
                <div className="dialog--save__tip-name">{this.props.review.subject.title}</div>
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
    					{this.props.itinerariesList.map(itinerary => {
				        return (
  		            <li className="brdr-bottom" key={itinerary.itineraryId}>
                    <Link onClick={handleAdd(itinerary)}>
                      <div className="flx flx-row flx-just-start flx-align-center">
                        <div className="vb vb--md fill--primary mrgn-right-md DN">
                          <img className="center-img mrgn-right-sm" src="../img/icons/icon40--save.png"/>
                          Save
                        </div>

                        {/** GEO - START **/}
                        <GeoInfo geo={itinerary.geo} />          
                        {/** END - GEO ROW **/}
                        
      						    	<div className="option-title color--primary">
      						    		{itinerary.title}
      						    	</div>
                      </div>
                    </Link>
  				        </li>
				        );
  				     })}
                  
    				</ul>
    			</div>

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(SaveModal);