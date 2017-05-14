import users from './users';
import user from './user';
import ui from './ui';
import { combineReducers } from 'redux';

export default combineReducers({
  user: user,
  users: users,
  ui: ui
});