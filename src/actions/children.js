import { parseResponse } from '../utils';
import {GET_CHILDREN_DATA, GET_CHILDREN_DATA_SUCCESS,
  CHILD_SELECTED, CHILD_CLEAR, SAVE_CHILD_REQUEST,
  SAVE_CHILD_SUCCESS, SAVE_CHILD_CANCEL, SAVE_CHILD_FAILURE,
  CHILD_ADD_BUTTON_CLICKED, CHILD_EDIT_BUTTON_CLICKED, CHILD_DELETE_BUTTON_CLICKED,
  DELETE_CHILD_REQUEST, DELETE_CHILD_SUCCESS, DELETE_CHILD_FAILURE}
  from '../constants';
import { pushPath } from 'redux-simple-router';

import {backendURL} from './index';
import {loginUserSuccess, loginUserFailure} from './login';


// GET
export function receiveChildrenData(data) {
  return {
    type: GET_CHILDREN_DATA_SUCCESS,
    payload: {
      data: data
    }
  };
}

export function fetchChildrenDataRequest() {
  return {
    type: GET_CHILDREN_DATA
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
        dispatch(pushPath('/login'));
      } else {
        throw error;
      }
    });
  };
}

// UI
export function childSelected(child) {
  return {
    type: CHILD_SELECTED,
    payload: child
  };
}

export function childClicked(child) {
  return (dispatch) => {
    dispatch(pushPath('/child/' + child.id, child));
    dispatch(childSelected(child));
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

export function childEditButtonClicked(child) {
  return (dispatch) => {
    dispatch(pushPath('/child/edit/' + child.id, child));
    dispatch({
      type: CHILD_EDIT_BUTTON_CLICKED
    });
  };
}

export function childDeleteButtonClicked() {
  return {
    type: CHILD_DELETE_BUTTON_CLICKED
  };
}

// SAVE
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


// DELETE
export function deleteChildRequest() {
  return {
    type: DELETE_CHILD_REQUEST
  };
}

export function deleteChildSuccess(json, child) {
  return {
    type: DELETE_CHILD_SUCCESS,
    payload: child
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
    return fetch(`${backendURL}/api/v0/child/id/${childData.id}`, {
      method: 'delete',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': `${token}`
      }
    })
      .then(parseResponse)
      .then(({json: json, token: newToken}) => {
        dispatch(deleteChildSuccess(json, childData));
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
