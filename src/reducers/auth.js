import {createReducer} from '../utils/index.js';
import {LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER} from '../constants/index.js';
import jwtDecode from 'jwt-decode';

const initialState = {
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null
};

export default createReducer(initialState, {
  [LOGIN_USER_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isAuthenticating': true,
      'statusText': null
    });
  },
  [LOGIN_USER_SUCCESS]: (state, payload) => {
    localStorage.setItem('token', payload.token);
    try {
      const decoded = jwtDecode(payload.token);
      return Object.assign({}, state, {
        'isAuthenticating': false,
        'isAuthenticated': true,
        'token': payload.token,
        'jwt': decoded,
        'statusText': `You have been successfully signed in.`
      });
    } catch (e) {
      localStorage.removeItem('token');
      return Object.assign({}, state, {
        'isAuthenticating': false,
        'isAuthenticated': false,
        'token': null,
        'jwt': null,
        'statusText': `Invalid access token. Please log in again.`
      });
    }
  },
  [LOGIN_USER_FAILURE]: (state, payload) => {
    localStorage.removeItem('token');
    return Object.assign({}, state, {
      'isAuthenticating': false,
      'isAuthenticated': false,
      'token': null,
      'jwt': null,
      'statusText': `${payload.message}`
    });
  },
  [LOGOUT_USER]: (state) => {
    localStorage.removeItem('token');
    return Object.assign({}, state, {
      'isAuthenticated': false,
      'token': null,
      'jwt': null,
      'statusText': 'You have been successfully logged out.'
    });
  }
});
