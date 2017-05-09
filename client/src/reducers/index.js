import profile from './profile';
import users from './users';
import user from './user';
import { combineReducers } from 'redux';

export default combineReducers({
  user: user,
  users: users,
  profile: profile
});