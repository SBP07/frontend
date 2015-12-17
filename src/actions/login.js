import { parseResponse } from '../utils';
import {LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER}
  from '../constants';
import { pushPath } from 'redux-simple-router';

import {backendURL} from './index';

export function loginUserSuccess(token) {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  };
}

export function loginUserFailure(error) {
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      message: error.message
    }
  };
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  };
}

export function logout() {
  return {
    type: LOGOUT_USER
  };
}

export function logoutAndRedirect() {
  return (dispatch) => {
    dispatch(logout());
    dispatch(pushPath('/login'));
  };
}

export function loginUser(email, password) {
  return function(dispatch) {
    dispatch(loginUserRequest());
    return fetch(`${backendURL}/api/v0/auth/jwt/signIn`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password,
        rememberMe: true
      })
    })
    .then(parseResponse)
    .then(({json: json}) => {
      const redirect = redirect || '/';
      dispatch(loginUserSuccess(json.token));
      dispatch(pushPath(redirect));
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        dispatch(loginUserFailure(error));
      } else {
        throw error;
      }
    });
  };
}
