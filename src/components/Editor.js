import ListErrors from './ListErrors';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import EditItineraryForm from './EditItineraryForm';

const mapStateToProps = state => ({
  ...state.editor,
  authenticated: state.common.authenticated
});

class Editor extends React.Component {
  constructor() {
    super();

    // const updateFieldEvent =
    //   key => ev => this.props.onUpdateField(key, ev.target.value);
    // this.changeTitle = updateFieldEvent('title');
    // this.changeDescription = updateFieldEvent('description');
    // this.changeCaption = updateFieldEvent('caption');
    // this.changeSubjectTitle = updateFieldEvent('subjectTitle');
    // this.changeAddress = updateFieldEvent('address');
    // this.changeRating = updateFieldEvent('rating');

    // this.onRatingsChange = rating => ev => {
    //   ev.preventDefault();
    //   this.props.onUpdateField('rating', rating);
    // }

    // this.changeFile = ev => {
    //   this.props.onUpdateField('image', ev.target.files[0]);
    // }

    // this.removeTagHandler = tag => () => {
    //   this.props.onRemoveTag(tag);
    // };

    this.submitForm = (values) => {
        // console.log('VALUES = ' + JSON.stringify(values))
        this.props.onEditorSubmit(this.props.authenticated, this.props.itineraryId, values.itinerary);
    };
  }

  componentWillMount() {
    if (this.props.params.iid) {
        this.props.onEditorLoad(this.props.authenticated, this.props.params.iid);
        if (navigator.geolocation) {
          let watchId = navigator.geolocation.watchPosition(this.props.showPosition);
          this.props.setWatchPositionId(watchId);
        }
    }
    this.props.sendMixpanelEvent('Itinerary page loaded');
  }

  componentWillUnmount() {
    this.props.onEditorUnload(this.props.itineraryId);
    if (this.props.watchId) navigator.geolocation.clearWatch(this.props.watchId);
  }

  render() {
    return (
      <EditItineraryForm 
        onSubmit={this.submitForm} 
        itinerary={this.props.itinerary}
        itineraryId={this.props.itineraryId}
        latitude={this.props.latitude}
        longitude={this.props.longitude}
        authenticated={this.props.authenticated} />
    )
    // if (!this.props.itinerary) {
    //   return (
    //     <div>
    //       Itinerary doesn't exist!
    //     </div>
    //   );
    // }
    // else {
    //   return (
    //     <div className="roow roow-col roow-center-all page-common editor-page create-page">
    //       <div className="page-title-wrapper center-text">
    //         <div className="v2-type-h2 subtitle">{this.props.itinerary.title}</div>
    //       </div>
    //       <div className="roow roow-col roow-center-all page-common editor-page">
    //             <div className="form-wrapper roow roow-col-left">
                  
    //               <fieldset>
    //                 <div>
    //                   Location: {this.props.itinerary.geo}
    //                 </div>
    //                 <div>
    //                   Description: {this.props.itinerary.description}
    //                 </div>
    //               </fieldset>
    //             </div>
    //       </div>

    //       <div className="form-wrapper roow roow-col-left">

    //           <ListErrors errors={this.props.errors}></ListErrors>

    //           <form>
              
    //             <fieldset>
    //               <div>
    //                 <fieldset className="form-group no-margin apple">
    //                   <input
    //                     className="form-control"
    //                     type="text"
    //                     placeholder="Add something to your itinerary"
    //                     required
    //                     value={this.props.subjectTitle}
    //                     onChange={this.changeSubjectTitle} />
    //                 </fieldset>

    //                 <fieldset className="form-group no-margin apple">
    //                   <input
    //                     className="form-control"
    //                     type="text"
    //                     placeholder="Address (optional)"
    //                     required
    //                     value={this.props.address}
    //                     onChange={this.changeAddress} />
    //                 </fieldset>

    //                 <fieldset className="form-group">
    //                   <input
    //                     className="form-control"
    //                     type="file"
    //                     accept="image/*" 
    //                     onChange={this.changeFile} />
    //                 </fieldset>

    //               </div>
                  
    //               <fieldset className="form-group">
    //                 <input
    //                   className="form-control caption"
    //                   type="number"
    //                   min="0"
    //                   max="10"
    //                   placeholder="Rating from 0-10 (optional)"
    //                   value={this.props.rating}
    //                   onChange={this.changeRating}>
    //                 </input>
    //                </fieldset>

    //               <div className="gray-border">
    //               <fieldset className="form-group">
    //                 <textarea
    //                   className="form-control caption"
    //                   rows="3"
    //                   placeholder="Add a comment"
    //                   value={this.props.caption}
    //                   onChange={this.changeCaption}>
    //                 </textarea>
    //                </fieldset>
    //               </div>



    //               <button
    //                 className="bttn-style bttn-submit"
    //                 type="button"
    //                 disabled={this.props.inProgress}
    //                 onClick={this.submitForm}>
    //                 Add to itinerary
    //               </button>

    //             </fieldset>
    //           </form>

    //         </div>
    //     </div>
    //   )
    // }





    //  return (
    //   <div className="roow roow-col roow-center-all page-common editor-page">
    //         <div className="form-wrapper roow roow-col-left">

    //           <ListErrors errors={this.props.errors}></ListErrors>

    //           <form>
              
    //             <fieldset>
    //               <div className="roow roow-row-top">
    //                 <fieldset className="form-group no-margin apple">
    //                   <input
    //                     className="form-control"
    //                     type="text"
    //                     placeholder="Product Name"
    //                     required
    //                     value={this.props.title}
    //                     onChange={this.changeTitle} />
    //                 </fieldset>

    //                 <fieldset className="form-group">
    //                 <input
    //                   className="form-control"
    //                   type="file"
    //                   accept="image/*" 
    //                   onChange={this.changeFile} />
    //               </fieldset>

    //               </div>
    //               <fieldset className="form-group no-margin">
    //                 <div>
    //                   <select className='react-textselect-input' onChange={this.changeTag} value={this.props.tagInput}>
    //                     <option selected disabled>Choose a category</option>
    //                     {Constants.TAG_LIST.map(item => {
    //                       return (
    //                             <option value={item} key={item}>{item}</option>
    //                         );
    //                     })}
    //                   </select>
    //                  {/***} <SelectTag options={Constants.TAG_LIST} handler={this.changeTag} value={this.props.tag} />  ***/}
    //                 </div>
    //               </fieldset>
    //               <fieldset className="form-group no-margin">
    //                 <div className={'rating-container rating-wrapper-' + this.props.rating}>
    //                     <div className="roow roow-row-space-around">
    //                       <div className="square-wrapper"><button className="rating-graphic rating--2" onClick={this.onRatingsChange(-2)}></button></div>
    //                       <div className="square-wrapper"><button className="rating-graphic rating--1" onClick={this.onRatingsChange(-1)}></button></div>
    //                       <div className="square-wrapper"><button className="rating-graphic rating-0" onClick={this.onRatingsChange(0)}></button></div>
    //                       <div className="square-wrapper"><button className="rating-graphic rating-1" onClick={this.onRatingsChange(1)}></button></div>
    //                       <div className="square-wrapper"><button className="rating-graphic rating-2" onClick={this.onRatingsChange(2)}></button></div>
    //                     </div>
    //                     <div className="roow roow-row-space-around">
    //                       <div className="rating-description">WTF</div>
    //                       <div className="rating-description">Weak</div>
    //                       <div className="rating-description">Meh</div>
    //                       <div className="rating-description">Coo</div>
    //                       <div className="rating-description">Lit as Fuck</div>
    //                     </div>
    //                 </div>
    //               </fieldset>

    //               <div className="gray-border">
    //               <fieldset className="form-group">
    //                 <textarea
    //                   className="form-control caption"
    //                   rows="3"
    //                   placeholder="Compose a quick comment..."
    //                   value={this.props.caption}
    //                   onChange={this.changeCaption}>
    //                 </textarea>
    //                </fieldset>
    //               <fieldset className="form-group">
    //                 <input
    //                   className="form-control subtle-input"
    //                   type="text"
    //                   placeholder="website link (optional)"
    //                   value={this.props.url}
    //                   onChange={this.changeURL} />
    //               </fieldset>
    //               </div>



    //               <button
    //                 className="bttn-style bttn-submit"
    //                 type="button"
    //                 disabled={this.props.inProgress}
    //                 onClick={this.submitForm}>
    //                 Submit Review
    //               </button>

    //             </fieldset>
    //           </form>

    //         </div>

    //   </div>
    // );
  }
}

export default connect(mapStateToProps, Actions)(Editor);