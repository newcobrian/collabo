export default (state = {}, action) => {
  switch (action.type) {
    case 'SETTINGS_SAVED':
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case 'ASYNC_START':
      return {
        ...state,
        inProgress: true
      };
    case 'GET_USER':
      return {
        firebaseUser: action.payload
      };
    case 'SETTINGS_UNLOADED':
      return {};
    case 'SETTINGS_SAVED_ERROR':
      return {
        ...state,
        errors: [action.error]
      }
  }

  return state;
};