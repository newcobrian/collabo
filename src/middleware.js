import agent from './agent';

const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: 'ASYNC_START', subtype: action.type });
    action.payload.then(
      res => {
        action.payload = res;
        store.dispatch(action);
      },
      error => {
        action.error = true;
        // action.payload = error.response.body;
        action.payload = error.message;
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}

const localStorageMiddleware = store => next => action => {
  if (action.type === 'REGISTER' || action.type === 'LOGIN') {
    if (!action.error) {
      // window.localStorage.setItem('jwt', action.payload.user.token;
      // agent.setToken(action.payload.user.token);
      action.payload.getToken().then(function(token) {
         window.localStorage.setItem('jwt', token);
         agent.setToken(token);
      });
    }
  } else if (action.type === 'LOGOUT') {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);
  }

  next(action);
};

export {
  localStorageMiddleware,
  promiseMiddleware
};