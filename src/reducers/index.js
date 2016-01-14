import {combineReducers} from 'redux';
import { routeReducer } from 'redux-simple-router';
import auth from './auth';
import children from './children';
import contacts from './contacts';

export default combineReducers({
  auth,
  children,
  contacts,
  routing: routeReducer
});
