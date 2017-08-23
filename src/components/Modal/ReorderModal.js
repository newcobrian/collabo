import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value, sortIndex}) => {
  return (
    <li>
      <div>
        <div>{sortIndex}. {value.subject.title}</div>
        <div>Rating: {value.review.rating}</div>
        <div>Caption: {value.review.caption}</div>
      </div>

    </li>
    )
});

const SortableList = SortableContainer(({items}) => {
  return (
    <ul>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} sortIndex={index+1} />
      ))}
    </ul>
  );
});

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class ReorderModal extends React.Component {
  render() {
    const handleClose = () => {
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Close"
        className="vb fill--white vb--shadow-none"
        onTouchTap={handleClose}
        style={{
            color:'#2B3538'
          }}
      />
    ];

    const onSortEnd = ({oldIndex, newIndex}) => {
        if (oldIndex !== newIndex) {
          this.props.onReorderTips(this.props.itinerary, oldIndex, newIndex);
        }
      // this.setState({
      //   items: arrayMove(this.state.items, oldIndex, newIndex),
      // });
    };

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Dialog
          actions={actions}
          modal={false}
          open={(this.props.modalType === Constants.REORDER_ITINERARY_MODAL) ? true : false}
          autoScrollBodyContent={true}
          className="dialog-wrapper"
          style={{
              
            }}

          contentStyle={{width: "100%", maxWidth: "600px"}}
        >

        <div className="dialog--save flx flx-col">
          <div className="dialog--save__tip-name color--black tip__title v2-type-h3 v-row brdr-bottom">Reorder Your Guide</div>
           
          <SortableList items={this.props.itinerary.tips} onSortEnd={onSortEnd} />
         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ReorderModal);