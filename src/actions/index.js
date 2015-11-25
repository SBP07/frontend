import { checkHttpStatus, parseJSON } from '../utils';
import {LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS, LOGOUT_USER, FETCH_CHILDREN_DATA_REQUEST, RECEIVE_CHILDREN_DATA, CHILD_SELECTED, CHILD_CLEAR} from '../constants';
import { pushState } from 'redux-router';

const backendURL = 'http://backend.speelsysteem.be';

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
      statusText: error.response.statusText
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
    dispatch(pushState(null, '/login'));
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
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      const redirect = redirect || '/';
      dispatch(loginUserSuccess(response.token));
      dispatch(pushState(null, redirect));
    })
    .catch(error => {
      dispatch(loginUserFailure(error));
    });
  };
}

export function receiveChildrenData(data) {
  return {
    type: RECEIVE_CHILDREN_DATA,
    payload: {
      data: data
    }
  };
}

export function fetchChildrenDataRequest() {
  return {
    type: FETCH_CHILDREN_DATA_REQUEST
  };
}

export function fetchChildrenData(token) {
  return (dispatch) => {
    dispatch(fetchChildrenDataRequest());
    return fetch(`${backendURL}/api/v0/child`, {
      credentials: 'include',
      headers: {
        'X-Auth-Token': `${token}`
      }
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(children => {
      dispatch(receiveChildrenData(children));
    })
    .catch(error => {
      if (error.response.status === 401) {
        dispatch(loginUserFailure(error));
        dispatch(pushState(null, '/login'));
      }
    });
  };
}

export function childSelected(child) {
  return {
    type: CHILD_SELECTED,
    payload: child
  };
}

export function clearSelectedChild() {
  return {
    type: CHILD_CLEAR
  };
}
