import profile from './profile';
import users from './users';
import user from './user';
import { combineReducers } from 'redux';

export default combineReducers({
  user: user,
  users: users,
  profile: profile
});


/*export default (state = {profile: null}, action) => {
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
    case 'RECEIVE_FEED':
      return {
        ...state,
        profile: {
          ...state.profile,
          feed: action.feed
        }
      }
    default:
      return state;
  }
}*/