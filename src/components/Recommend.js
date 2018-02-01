import { Itinerary, mapStateToProps } from './Itinerary';
import React from 'react';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import * as Constants from '../constants';
import {BackToTop} from 'pui-react-back-to-top';
import TipList from './TipList';
import ProfilePic from './ProfilePic';
import ImagePicker from './ImagePicker';
import { browserHistory, Link } from 'react-router';
import LikeReviewButton from './LikeReviewButton';
import CommentContainer from './Review/CommentContainer'
import { ITINERARY_TYPE, ITINERARY_PAGE } from '../constants';
import ItineraryActionsButton from './ItineraryActionsButton';
import DisplayTimestamp from './DisplayTimestamp';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dropzone from 'react-dropzone';
import ItineraryForm from './ItineraryForm';
import * as Selectors from '../selectors/itinerarySelectors';
import { isEmpty, find, filter } from 'lodash';
import MapContainer from './MapContainer';
import scrollToElement from 'scroll-to-element';
import RelatedItineraries from './RelatedItineraries';
import SEO from './SEO';
import LoadingSpinner from './LoadingSpinner';
import { ShareButtons, ShareCounts, generateShareIcon } from 'react-share';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Geosuggest from 'react-geosuggest';
import FollowItineraryButton from './FollowItineraryButton'
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import Sticky from 'react-sticky-el';

class Recommend extends Itinerary {
  componentWillMount() {
    this.loadItinerary(this.props.params.iid);
    this.props.loadRelatedItineraries(this.props.authenticated, this.props.params.iid);
    this.jumpToHash();
  }

  componentWillUnmount() {
    this.unloadItinerary(this.props.itineraryId);
    this.props.unloadRelatedItineraries(this.props.authenticated);
    if (!this.props.authenticated) {
      this.props.setAuthRedirect(this.props.location.pathname);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.iid !== this.props.params.iid) {
      this.unloadItinerary(this.props.itineraryId);
      this.loadItinerary(nextProps.params.iid);
      this.props.loadRelatedItineraries(this.props.authenticated, nextProps.params.iid);
    }
  }

  renderTabs() {
    return (
      <div className="flx flx-row flx-align-center w-100 ta-center">
        <Link to={'/guide/' + this.props.itineraryId}
          className="list-tab pdding-all-sm fill--none v2-type-body1 color--white mrgn-right-xs w-50 opa-80">
          {/*this.props.visibleTips.length*/}{this.props.numTotalTips} Tips
        </Link>
        <Link to={'/recommend/' + this.props.itineraryId}
          className="active list-tab list-tab--on pdding-all-sm fill--none v2-type-body1 color--white mrgn-right-xs w-50 weight-500">{/*itinerary.reviewsCount ? itinerary.reviewsCount : 0*/}
          5 Recs</Link>
      </div>
      )
  }  
}

export default GoogleApiWrapper({
  apiKey: Constants.GOOGLE_API_KEY
}) (connect(mapStateToProps, Actions)(Recommend));

// export default connect(mapStateToProps, Actions)(Recommend);