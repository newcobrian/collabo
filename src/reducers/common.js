const defaultState = {
  appName: 'Trippy',
  authenticated: false,
  token: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'APP_LOAD':
      return {
        ...state,
        authenticated: action.authenticated,
        // token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload : null
      };
    case 'REDIRECT':
      return { ...state, redirectTo: null };
    case 'LOGOUT':
      return { ...state, authenticated: false, redirectTo: '/', token: null, currentUser: null };
    case 'ARTICLE_SUBMITTED':
      const redirectUrl = `article/${action.payload.article.slug}`;
      return { ...state, redirectTo: redirectUrl };
    case 'SETTINGS_SAVED':
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        currentUser: action.error ? null : action.payload.user
      };
    case 'LOGIN':
    case 'REGISTER':
      return {
        ...state,
        authenticated: true,
        redirectTo: action.error ? null : '/',
        // token: action.error ? null : action.payload.user.token,
        // token: action.error ? null : action.payload.token,
        // currentUser: action.error ? null : action.payload.user
        currentUser: action.error ? null : action.payload
      };
    case 'AUTH_USER':
      return {
        ...state,
        authenticated: true,
        error: null
      };
    case 'DELETE_ARTICLE':
      return { ...state, redirectTo: '/' };
  }
  return state;
};