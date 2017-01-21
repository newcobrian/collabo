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
import followers from './reducers/followers';
import inbox from './reducers/inbox';
import Firebase from 'firebase';

const reducer = combineReducers({
  review,
  reviewList,
  auth,
  common,
  home,
  profile,
  settings,
  editor,
  followers,
  inbox
  // firebase: firebaseStateReducer
});

const config = {
  apiKey: "AIzaSyC-BjmTeokMo8dARRmWi3IvyvMb9TrcCBA",
    authDomain: "whatsgood-f1e9b.firebaseapp.com",
    databaseURL: "https://whatsgood-f1e9b.firebaseio.com",
    storageBucket: "whatsgood-f1e9b.appspot.com"
}

Firebase.initializeApp(config);

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
    applyMiddleware(reduxThunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

// store.dispatch(Actions.verifyAuth());

export default store;