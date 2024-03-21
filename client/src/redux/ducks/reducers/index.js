import { combineReducers } from 'redux';
import auth from './auth';
import channel from './channel';
import theme from './theme';

export default combineReducers({
  auth,
  channel,
  theme,
});
