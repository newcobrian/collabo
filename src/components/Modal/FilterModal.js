import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';



const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
}); 

class FilterModal extends React.Component {
  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const applyClick = ev => {
      ev.preventDefault();
      console.log('appl yfilter click')
    }

    const toggleCheckbox = label => {
      console.log('toggle ' + label)
    }
    const styles = {
      block: {
        maxWidth: 1000,
      },
      radioButton: {
        marginBottom: 0,
      },
    };


    const actions = [
      <FlatButton
        label="Cancel"
        className="vb mrgn-right-sm"
        hoverColor="rgba(247,247,247,.2)"
        onClick={handleClose}
        style={{
          }}
          labelStyle={{   
                      }}
      />,
      <FlatButton
        label="Apply Filter"
        hoverColor="white"
        onClick={applyClick}
        disableTouchRipple={true}
        fullWidth={false}
        className="vb vb--outline--none fill--primary color--white"
        labelStyle={{color: ""}}
        style={{
          }}
      />
    ];

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === Constants.FILTER_MODAL) ? true : false}
          autoScrollBodyContent={true}
          onRequestClose={handleClose}
          className="dialog-wrapper"
          style={{
              
            }}

          title={'Filter categories'}
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

        <div className="dialog--save flx flx-col color--black font--alpha">

          <div className="dialog--save__content w-100">
            <div className="flx flx-row flx-align-center pdding-all-sm pdding-left-md brdr-bottom">
            <Checkbox
                label="All"
                style={styles.checkbox}
              />
            
            </div>
            <form>

              {


                Object.keys(this.props.itinerary.tags || {}).map(function (tagName) {


                  if (this.props.itinerary.tags[tagName] > 0) {
                    return (
                      <li className="flx flx-row flx-just-start flx-align-center brdr-bottom">

                        <Checkbox
                            label={tagName + " " + "(" + this.props.itinerary.tags[tagName] + ")"}
                            style={styles.checkbox}
                          />

                      </li>
                    )

                  }

                  else return null;


                }, this)


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

export default connect(mapStateToProps, Actions)(FilterModal);