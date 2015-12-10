import { parseResponse } from '../utils/index.js';
import {LOGIN_USER_REQUEST, LOGIN_USER_FAILURE, LOGIN_USER_SUCCESS,
  LOGOUT_USER, FETCH_CHILDREN_DATA_REQUEST, RECEIVE_CHILDREN_DATA,
  CHILD_SELECTED, CHILD_CLEAR, SAVE_CHILD_REQUEST,
  SAVE_CHILD_SUCCESS, SAVE_CHILD_CANCEL, SAVE_CHILD_FAILURE,
  CHILD_ADD_BUTTON_CLICKED, CHILD_EDIT_BUTTON_CLICKED, CHILD_DELETE_BUTTON_CLICKED,
  DELETE_CHILD_REQUEST, DELETE_CHILD_SUCCESS, DELETE_CHILD_FAILURE}
  from '../constants/index.js';
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
    .then(parseResponse)
    .then(({json: json}) => {
      const redirect = redirect || '/';
      dispatch(loginUserSuccess(json.token));
      dispatch(pushState(null, redirect));
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
    .then(parseResponse)
    .then(({json: children, token: newToken}) => {
      dispatch(receiveChildrenData(children));
      dispatch(loginUserSuccess(newToken));
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        dispatch(loginUserFailure(error));
        dispatch(pushState(null, '/login'));
      } else {
        throw error;
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

export function childAddButtonClicked() {
  return {
    type: CHILD_ADD_BUTTON_CLICKED
  };
}

export function childEditButtonClicked() {
  return {
    type: CHILD_EDIT_BUTTON_CLICKED
  };
}

export function childDeleteButtonClicked() {
  return {
    type: CHILD_DELETE_BUTTON_CLICKED
  };
}

export function saveChildRequest() {
  return {
    type: SAVE_CHILD_REQUEST
  };
}

export function saveChildSuccess(child) {
  return {
    type: SAVE_CHILD_SUCCESS,
    payload: {
      child: child
    }
  };
}

export function cancelSaveChild() {
  return {
    type: SAVE_CHILD_CANCEL
  };
}

export function saveChildFailure(error) {
  return {
    type: SAVE_CHILD_FAILURE,
    payload: error
  };
}

export function saveChild(token, childData) {
  return function(dispatch) {
    dispatch(saveChildRequest());
    return fetch(`${backendURL}/api/v0/child`, {
      method: childData.id ? 'put' : 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': `${token}`
      },
      body: JSON.stringify(childData)
    })
      .then(parseResponse)
      .then(({json: json, token: newToken}) => {
        dispatch(saveChildSuccess(json));
        dispatch(loginUserSuccess(newToken));
        dispatch(fetchChildrenData(newToken));
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          dispatch(loginUserFailure(error));
        } else {
          dispatch(saveChildFailure(error.json));
          throw error;
        }
      });
  };
}

export function deleteChildRequest() {
  return {
    type: DELETE_CHILD_REQUEST
  };
}

export function deleteChildSuccess() {
  return {
    type: DELETE_CHILD_SUCCESS
  };
}

export function deleteChildFailure(error) {
  return {
    type: DELETE_CHILD_FAILURE,
    payload: error
  };
}

export function deleteChild(token, childData) {
  return function(dispatch) {
    dispatch(deleteChildRequest());
    return fetch(`${backendURL}/api/v0/child`, {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': `${token}`
      },
      body: JSON.stringify(childData)
    })
      .then(parseResponse)
      .then(({json: json, token: newToken}) => {
        dispatch(deleteChildSuccess(json));
        dispatch(loginUserSuccess(newToken));
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          dispatch(loginUserFailure(error));
        } else {
          dispatch(deleteChildFailure(error.json));
          throw error;
        }
      });
  };
}
