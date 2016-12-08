import { applyMiddleware, createStore, combineReducers, compose } from 'redux';
import { promiseMiddleware, localStorageMiddleware } from './middleware';
import {reduxReactFirebase, firebaseStateReducer} from 'redux-react-firebase'
import article from './reducers/article';
import articleList from './reducers/articleList';
import auth from './reducers/auth';
import common from './reducers/common';
import home from './reducers/home';
import profile from './reducers/profile';
import settings from './reducers/settings';
import editor from './reducers/editor';
import Firebase from 'firebase';

const reducer = combineReducers({
  article,
  articleList,
  auth,
  common,
  home,
  profile,
  settings,
  editor,
  firebase: firebaseStateReducer
});

const config = {
 	apiKey: "AIzaSyC-BjmTeokMo8dARRmWi3IvyvMb9TrcCBA",
    authDomain: "whatsgood-f1e9b.firebaseapp.com",
    databaseURL: "https://whatsgood-f1e9b.firebaseio.com",
    storageBucket: "whatsgood-f1e9b.appspot.com"
}

// Firebase.initializeApp(config);

// const createStoreWithFirebase = compose(
//     reduxReactFirebase(config),
// )(createStore)

const middleware = applyMiddleware(promiseMiddleware, localStorageMiddleware);

const store = createStore(reducer, middleware, reduxReactFirebase(config));
// const store = createStore(reducer, middleware);

// const verifyAuth = () => {
//  return function (dispatch) {
//      Firebase.auth().onAuthStateChanged(user => {
//        if (user) {
//          dispatch({ type: 'AUTH_USER' });
//        } else {
//          dispatch({ type: 'LOGOUT' });
//        }
//      }); 
//   }
// };

// store.dispatch(verifyAuth());

export default store;