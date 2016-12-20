import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import reduxThunk from 'redux-thunk';
// import { promiseMiddleware, localStorageMiddleware } from './middleware';
// import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase'
import subject from './reducers/subject';
import articleList from './reducers/articleList';
import auth from './reducers/auth';
import common from './reducers/common';
import home from './reducers/home';
import profile from './reducers/profile';
import settings from './reducers/settings';
import editor from './reducers/editor';
import Firebase from 'firebase';
import * as Actions from './actions';

const reducer = combineReducers({
  subject,
  articleList,
  auth,
  common,
  home,
  profile,
  settings,
  editor
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