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
    <div className="row--reorder w-100 brdr-bottom flx flx-row flx-align-center">
        <i className="material-icons mrgn-right-sm color--gray">drag_handle</i>
        <div className="v2-type-body2 font--alpha color--black"><div className="tip__order-count color--primary">{sortIndex}</div> {value.subject.title}</div>
        <div className="DN">Rating: {value.review.rating}</div>
        <div className="DN">Caption: {value.review.caption}</div>
    </div>
    )
});

const SortableList = SortableContainer(({items}) => {
  return (
    <div className="reorder w-100">
      {items.map((value, index) => (
        <SortableItem helperClass='sortableHelper' key={`item-${index}`} index={index} value={value} sortIndex={index+1} />
      ))}
    </div>
  );
});

const mapStateToProps = state => ({
  ...state.modal,
  authenticated: state.common.authenticated
});

class ReorderModal extends React.Component {
  componentWillMount() {
    this.props.loadReorderModal(this.props.itinerary);
  }

  render() {
    const handleClose = ev => {
      ev.preventDefault();
      this.props.hideModal();
    }

    const actions = [
      <FlatButton
        label="Done"
        className="vb vb--outline-none fill--primary color--white"
        onClick={handleClose}
        style={{}}
        labelStyle={{}}
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
          onRequestClose={handleClose}
          lockToContainerEdges={true}
            
          title="Reorder your tips"

          titleClassName="dialog__title v2-type-h2"
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

        <div className="dialog--save flx flx-col">
           
          <SortableList helperClass='sortableHelper' items={this.props.itinerary.tips} onSortEnd={onSortEnd} />
         
        </div>

          {/*{JSON.stringify(this.props.review)}*/}

        </Dialog>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, Actions)(ReorderModal);