import { connect } from 'react-redux';
import React from 'react';
import * as Actions from '../../actions';
import * as Constants from '../../constants';
import { FORWARD_MODAL, REVIEW_MODAL, SAVE_MODAL, DELETE_ITINERARY_MODAL } from '../../actions';
import ForwardModal from './ForwardModal'
import ReviewModal from './ReviewModal'
import SaveModal from './SaveModal'
import NewItineraryModal from './NewItineraryModal'
import DeleteItineraryModal from './DeleteItineraryModal'
import InfoModal from './InfoModal'
import ReorderModal from './ReorderModal'
import ShareModal from './ShareModal'
import FilterModal from './FilterModal'

const MODAL_COMPONENTS = {
  FORWARD_MODAL: ForwardModal,
  REVIEW_MODAL: ReviewModal,
  SAVE_MODAL: SaveModal,
  NEW_ITINERARY_MODAL: NewItineraryModal,
  DELETE_ITINERARY_MODAL: DeleteItineraryModal,
  INFO_MODAL: InfoModal,
  REORDER_ITINERARY_MODAL: ReorderModal,
  SHARE_MODAL: ShareModal,
  FILTER_MODAL: FilterModal
}

const mapStateToProps = state => ({
  ...state.modal,
  // ...state.friendSelector,
  // ...state.create,
  authenticated: state.common.authenticated
});

class RootModal extends React.Component {
    componentWillMount() {
      this.props.sendMixpanelEvent(Constants.MIXPANEL_PAGE_VIEWED, { 'page name' : this.props.modalType });
    }

  	render () {
  		if (!this.props.modalType) {
	    	return null
	  	}
	  	const SpecificModal = MODAL_COMPONENTS[this.props.modalType];
  		return (
  			<SpecificModal {...this.props.modalProps} />
  		)
  	}
}

// const ModalRoot = ({ modalType, modalProps }) => {
// 	console.log('hey ' + modalType)
//   if (!modalType) {
//   	console.log('hey 2' + modalType)
//     return null
//   }

//   const SpecificModal = MODAL_COMPONENTS[modalType]

//   return <SpecificModal {...modalProps} />
// }

// export default connect(
//   state => state.modal
// )(ModalRoot)

export default connect(mapStateToProps, Actions)(RootModal);
