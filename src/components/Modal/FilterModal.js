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
  ...state.itinerary,
  authenticated: state.common.authenticated
}); 

class FilterModal extends React.Component {
  constructor() {
    super();

    this.state = {
      filters: {},
      showAllFilters: false
    }
  }

  componentWillMount() {
    this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : 'filter modal' });
    // if showAllFilters, this might be the first time opening dialog, so construct filter object
    // with any tag that has at least 1 tip
    if (this.props.showAllFilters) {
      let filters = {}
      Object.keys(this.props.itinerary.tags || {}).map(function (tagName) {
        if (this.props.itinerary.tags[tagName] > 0) {
          filters[tagName] = { checked: true, count: this.props.itinerary.tags[tagName] };
        }
      }, this)

      this.setState({
        showAllFilters: true,
        filters: filters
      })
    }
    // otherwise just set filters and showAllFilters from what's passed in
    else {
      let filters = {}
      Object.keys(this.props.itinerary.tags || {}).map(function (tagName) {
        if (this.props.itinerary.tags[tagName] > 0) {
          filters[tagName] = this.props.visibleTags[tagName] ? Object.assign({}, this.props.visibleTags[tagName]) :
            { checked: false, count: this.props.itinerary.tags[tagName] }
        }
      }, this)

      this.setState({
        filters: this.props.visibleTags,
        showAllFilters: false
      })
    }
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const applyClick = ev => {
      ev.preventDefault();
      this.props.setItineraryFilters(this.state.filters, this.state.showAllFilters);
      this.props.hideModal();
    }

    const handleCheck = label => ev => {
      ev.preventDefault();
      // this.props.toggleItineraryFilter(label);
      let newFilters = Object.assign({}, this.state.filters);
      newFilters[label].checked = !newFilters[label].checked;
      this.setState({
        filters: newFilters
      })

      if (!newFilters[label].checked) {
        this.setState({
          showAllFilters: false
        })
      }
    }

    const handleAllCheck = ev => {
      ev.preventDefault();
      if (this.state.showAllFilters) {
        // clear all checked fields
        let filters = Object.assign({}, this.state.filters)
        Object.keys(this.state.filters || {}).map(function (tagName) {
          filters[tagName].checked = false;
        }, this)

        this.setState({
          showAllFilters: false
        })
      }
      else {
        // set all visible fields to true
        let filters = Object.assign({}, this.state.filters)
        Object.keys(this.state.filters || {}).map(function (tagName) {
          filters[tagName].checked = true;
        }, this)

        this.setState({
          showAllFilters: true,
          filters: filters
        })
      }
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
                label="Show All"
                checked={this.state.showAllFilters}
                onCheck={handleAllCheck}
                style={styles.checkbox}
              />
            
            </div>
            <form>

              {


                Object.keys(this.state.filters || {}).map(function (tagName) {
//checked={this.props.appliedFilters.has(tagName)}
                  return (
                    <li key={tagName} className="flx flx-row flx-just-start flx-align-center brdr-bottom">

                      <Checkbox
                          label={tagName + " " + "(" + this.state.filters[tagName].count + ")"}
                          style={styles.checkbox}
                          checked={this.state.filters[tagName].checked}
                          
                          onCheck={handleCheck(tagName)}
                        />
                      
                      
                       {/*} <input
                          name={tagName}
                          style={styles.checkbox}
                          type="checkbox"
                          checked={this.props.appliedFilters[tagName]}
                          onChange={handleCheck(tagName)} />
                      <label>
                        {tagName + " " + "(" + this.props.itinerary.tags[tagName] + ")"}</label>*/}

                    </li>
                  )

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