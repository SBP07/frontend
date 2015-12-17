import {combineReducers} from 'redux';
import { routeReducer } from 'redux-simple-router';
import auth from './auth';
import children from './children';
import contactpersons from './contactpersons';

export default combineReducers({
  auth,
  children,
  contactpersons,
  routing: routeReducer
});
