export default (state = {login: null, profile: null}, action) => {
  switch(action.type) {
    case 'RECEIVE_LOGIN':
      return {
        ...state,
        login: action.login
      }
    case 'RECEIVE_PREDICTIONS':
      return {
        ...state,
        profile: {
          ...state.profile,
          predictions: action.predictions
        }
      }
    case 'RECEIVE_PROFILE':
      return {
        ...state,
        profile: action.profile
      }
    default:
      return state;
  }
}