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
import Firebase from 'firebase';
import mixpanel from 'mixpanel-browser';
import MixpanelMiddleware from 'redux-mixpanel-middleware';

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
  friendSelector
  // firebase: firebaseStateReducer
});

const config = {
  apiKey: "AIzaSyC-BjmTeokMo8dARRmWi3IvyvMb9TrcCBA",
    authDomain: "whatsgood-f1e9b.firebaseapp.com",
    databaseURL: "https://whatsgood-f1e9b.firebaseio.com",
    storageBucket: "whatsgood-f1e9b.appspot.com"
}

Firebase.initializeApp(config);

// init mixpanel and pass mixpanel client to middleware 
var productionHost = 'whatsgooood.com';
var devToken = '82d2d072b1d3d0fab39554d00f242545';
var prodToken = '2e078e6260727e77045efb7648420277';

console.log(window.location.hostname.toLowerCase());
if (window.location.hostname.toLowerCase().search(productionHost) < 0) {
    console.log('dev')
    mixpanel.init(devToken);
} else {
    console.log('prod')
    mixpanel.init(prodToken);
}
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