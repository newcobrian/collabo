import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import reduxThunk from 'redux-thunk';
// import { promiseMiddleware, localStorageMiddleware } from './middleware';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase'
import review from './reducers/review';
import reviewList from './reducers/reviewList';
import auth from './reducers/auth';
import common from './reducers/common';
import home from './reducers/home';
import profile from './reducers/profile';
import settings from './reducers/settings';
import editor from './reducers/editor';
import create from './reducers/create';
import followers from './reducers/followers';
import inbox from './reducers/inbox';
import projectInvite from './reducers/projectInvite';
import modal from './reducers/modal';
import itinerary from './reducers/itinerary';
import snackbarToaster from './reducers/snackbarToaster';
import lightboxComponent from './reducers/lightboxComponent';
import explore from './reducers/explore';
import places from './reducers/places';
import project from './reducers/project';
import thread from './reducers/thread';
import recommend from './reducers/recommend';
import universalSearchBar from './reducers/universalSearchBar';
import addReview from './reducers/addReview';
import addProject from './reducers/addProject';
import addThread from './reducers/addThread';
import projectList from './reducers/projectList';
import createOrg from './reducers/createOrg';
import organization from './reducers/organization';
import acceptInvite from './reducers/acceptInvite';
import orgSettings from './reducers/orgSettings';
import projectSettings from './reducers/projectSettings';
import inviteForm from './reducers/inviteForm';
import Firebase from 'firebase';
import mixpanel from 'mixpanel-browser';
import MixpanelMiddleware from 'redux-mixpanel-middleware';
import { reducer as formReducer } from 'redux-form';
import { combineForms } from 'react-redux-form';

const initialItinerary = {
  itinerary: {
    title: '',
    geo: ''
  }
}

const reducer = combineReducers({
  auth,
  common,
  home,
  profile,
  settings,
  inbox,
  projectInvite,
  modal,
  snackbarToaster,
  lightboxComponent,
  universalSearchBar,
  addProject,
  project,
  addThread,
  thread,
  projectList,
  createOrg,
  organization,
  acceptInvite,
  review,
  orgSettings,
  projectSettings,
  inviteForm,
  // editForm: combineForms({
  //   editForm: initialItinerary
  // }, 'editForm')
  form: formReducer,
  firebase: firebaseReducer
});

// init mixpanel and pass mixpanel client to middleware 
var productionHost = 'myviews.io';
var devToken = 'e731aa1cb95e57349cd2e339f35ccd8a';
var prodToken = '3474a67ba992a7b76e04807d6820f125';

let firebaseConfig = {};

if (window.location.hostname.toLowerCase().search(productionHost) < 0) {
    // use dev mixpanel and firebase
    // firebaseConfig = Object.assign({}, {
    //   apiKey: "AIzaSyApHTdIwxdDNAsrvH6cZ_tsqCax7tKB8KU",
    //   authDomain: "views-dev.firebaseapp.com",
    //   databaseURL: "https://views-dev.firebaseio.com",
    //   projectId: "views-dev",
    //   storageBucket: "views-dev.appspot.com",
    //   messagingSenderId: "606123329981"
    // });

    firebaseConfig = Object.assign({}, {
      apiKey: "AIzaSyDM-kc1XYMc8mGDCNqXa7vidvXvUHTgE9k",
      authDomain: "collabo-bc9b2.firebaseapp.com",
      databaseURL: "https://collabo-bc9b2.firebaseio.com",
      projectId: "collabo-bc9b2",
      storageBucket: "collabo-bc9b2.appspot.com",
      messagingSenderId: "750421710091"
    });

    mixpanel.init(devToken);
} else {
    // use prod mixpanel and firebase
    firebaseConfig = Object.assign({}, {
      apiKey: "AIzaSyDM-kc1XYMc8mGDCNqXa7vidvXvUHTgE9k",
      authDomain: "collabo-bc9b2.firebaseapp.com",
      databaseURL: "https://collabo-bc9b2.firebaseio.com",
      projectId: "collabo-bc9b2",
      storageBucket: "collabo-bc9b2.appspot.com",
      messagingSenderId: "750421710091"
    });

    mixpanel.init(prodToken);
}

Firebase.initializeApp(firebaseConfig);

const mixpanelMiddleware = new MixpanelMiddleware(mixpanel)

const createStoreWithFirebase = compose(
  reactReduxFirebase(Firebase, { userProfile: 'users' })
)(createStore)

// const middleware = applyMiddleware(promiseMiddleware, localStorageMiddleware);

// const store = createStore(reducer, middleware, reduxReactFirebase(config));
// const store = createStoreWithFirebase(reducer, middleware);
// const store = createStore(reducer, middleware);

const store = createStoreWithFirebase(
  reducer,
  // initialState,
  compose (
    applyMiddleware(reduxThunk, mixpanelMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

// store.dispatch(Actions.verifyAuth());

export default store;