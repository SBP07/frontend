import {combineReducers} from 'redux';
import {routerStateReducer} from 'redux-router';
import auth from './auth';
import children from './children';

export default combineReducers({
  auth,
  children,
  router: routerStateReducer
});
