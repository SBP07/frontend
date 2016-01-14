import { parseResponse } from '../utils';
import {GET_CHILDREN_DATA, GET_CHILDREN_DATA_SUCCESS,
  CHILD_SELECTED, CHILD_CLEAR, SAVE_CHILD_REQUEST, CHILD_EDIT_MODE,
  SAVE_CHILD_SUCCESS, SAVE_CHILD_CANCEL, SAVE_CHILD_FAILURE,
  CHILD_ADD_BUTTON_CLICKED, CHILD_EDIT_BUTTON_CLICKED, CHILD_DELETE_BUTTON_CLICKED,
  DELETE_CHILD_REQUEST, DELETE_CHILD_SUCCESS, DELETE_CHILD_FAILURE,
  GET_CHILD_CONTACTS_SUCCESS, GET_CHILD_CONTACTS,
  ADD_CONTACT_FOR_CHILD_SUCCESS, ADD_CONTACT_FOR_CHILD, ADD_CONTACT_FOR_CHILD_FAILURE}
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
export function childSelected(childId) {
  return {
    type: CHILD_SELECTED,
    payload: childId
  };
}

export function childClicked(childId, rootPath = '/child/') {
  return (dispatch) => {
    dispatch(pushPath(rootPath + childId));
  };
}

export function clearSelectedChild() {
  return (dispatch) => {
    dispatch(pushPath('/child'));
    dispatch({
      type: CHILD_CLEAR
    });
  };
}

export function childAddButtonClicked() {
  return {
    type: CHILD_ADD_BUTTON_CLICKED
  };
}

export function childEditButtonClicked(childId) {
  return (dispatch) => {
    dispatch(pushPath('/child/edit/' + childId));
    dispatch({
      type: CHILD_EDIT_BUTTON_CLICKED
    });
  };
}

export function childEditMode(isEditMode) {
  return {
    type: CHILD_EDIT_MODE,
    payload: isEditMode
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
        dispatch(pushPath('/child'));
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


// Getting contacts
export function receiveContactPeopleForChild(relations) {
  return {
    type: GET_CHILD_CONTACTS_SUCCESS,
    payload: relations
  };
}

export function fetchContactsForChildRequest(childId) {
  return {
    type: GET_CHILD_CONTACTS,
    payload: childId
  };
}

export function fetchContactsForChild(token, childId) {
  return (dispatch) => {
    return fetch(`${backendURL}/api/v0/child/id/${childId}/contactPeople`, {
      credentials: 'include',
      headers: {
        'X-Auth-Token': `${token}`
      }
    })
    .then(parseResponse)
    .then(({json: relations, token: newToken}) => {
      dispatch(receiveContactPeopleForChild(relations));
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

// Adding contacts

export function addContactForChildSuccess(json) {
  return {
    type: ADD_CONTACT_FOR_CHILD_SUCCESS,
    payload: json ? json.message : null
  };
}

export function addContactForChildRequest(childId, contactId) {
  return {
    type: ADD_CONTACT_FOR_CHILD,
    payload: {
      childId,
      contactId
    }
  };
}

export function addContactForChildFailure(error) {
  return {
    type: ADD_CONTACT_FOR_CHILD_FAILURE,
    payload: error
  };
}

export function addContactForChild(token, childId, contactId) {
  return function(dispatch) {
    dispatch(addContactForChildRequest(childId, contactId));
    return fetch(`${backendURL}/api/v0/child/id/${childId}/contactPeople`, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': `${token}`
      },
      body: JSON.stringify({
        'contactPersonId': contactId,
        'relationship': 'unspecified' // TODO
      })
    })
    .then(parseResponse)
    .then(({json: json, token: newToken}) => {
      dispatch(addContactForChildSuccess(json));
      dispatch(loginUserSuccess(newToken));
      dispatch(fetchContactsForChild(newToken, childId));
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        dispatch(loginUserFailure(error));
      } else {
        dispatch(addContactForChildFailure(error.json));
        throw error;
      }
    });
  };
}
