import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import reduxThunk from 'redux-thunk';
// import { promiseMiddleware, localStorageMiddleware } from './middleware';
// import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase'
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
import friendSelector from './reducers/friendSelector';
import modal from './reducers/modal';
import itinerary from './reducers/itinerary';
import snackbarToaster from './reducers/snackbarToaster';
import lightboxComponent from './reducers/lightboxComponent';
import explore from './reducers/explore';
import places from './reducers/places';
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
  review,
  reviewList,
  auth,
  common,
  home,
  profile,
  settings,
  editor,
  create,
  followers,
  inbox,
  friendSelector,
  modal,
  itinerary,
  snackbarToaster,
  lightboxComponent,
  explore,
  places,
  // editForm: combineForms({
  //   editForm: initialItinerary
  // }, 'editForm')
  form: formReducer
  // firebase: firebaseStateReducer
});

// init mixpanel and pass mixpanel client to middleware 
var productionHost = 'myviews.io';
var devToken = '';
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
      apiKey: "AIzaSyDVRupOyUI_19kCWMbggJEcuJnKfRfoSis",
      authDomain: "views-18a9f.firebaseapp.com",
      databaseURL: "https://views-18a9f.firebaseio.com",
      projectId: "views-18a9f",
      storageBucket: "views-18a9f.appspot.com",
      messagingSenderId: "750421710091"
    });

    mixpanel.init(devToken);
} else {
    // use prod mixpanel and firebase
    firebaseConfig = Object.assign({}, {
      apiKey: "AIzaSyDVRupOyUI_19kCWMbggJEcuJnKfRfoSis",
      authDomain: "views-18a9f.firebaseapp.com",
      databaseURL: "https://views-18a9f.firebaseio.com",
      projectId: "views-18a9f",
      storageBucket: "views-18a9f.appspot.com",
      messagingSenderId: "750421710091"
    });

    mixpanel.init(prodToken);
}

Firebase.initializeApp(firebaseConfig);

const mixpanelMiddleware = new MixpanelMiddleware(mixpanel)

// const createStoreWithFirebase = compose(
//     reduxReactFirebase(config),
// )(createStore)

// const middleware = applyMiddleware(promiseMiddleware, localStorageMiddleware);

// const store = createStore(reducer, middleware, reduxReactFirebase(config));
// const store = createStoreWithFirebase(reducer, middleware);
// const store = createStore(reducer, middleware);

const store = createStore(
  reducer,
  // initialState,
  compose (
    applyMiddleware(reduxThunk, mixpanelMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

// store.dispatch(Actions.verifyAuth());

export default store;