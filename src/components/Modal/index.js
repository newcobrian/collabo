import { connect } from 'react-redux';
import React from 'react';
import * as Actions from '../../actions';
import FORWARD_MODAL from '../../actions';
import ForwardModal from './ForwardModal'
import ReviewModal from './ReviewModal'

const MODAL_COMPONENTS = {
  FORWARD_MODAL: ForwardModal,
  'REVIEW': ReviewModal
}
const mapStateToProps = state => ({
  ...state.modal,
  ...state.friendSelector,
  authenticated: state.common.authenticated
});

class ModalRoot extends React.Component {
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

export default connect(mapStateToProps, Actions)(ModalRoot);
