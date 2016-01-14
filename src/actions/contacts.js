import { parseResponse } from '../utils';
import {GET_CONTACTS_DATA, GET_CONTACTS_DATA_SUCCESS,
  CONTACT_SELECTED, CONTACT_CLEAR, CONTACT_EDIT_MODE,
  SAVE_CONTACT_CANCEL, SAVE_CONTACT_REQUEST, SAVE_CONTACT_SUCCESS, SAVE_CONTACT_FAILURE,
  DELETE_CONTACT_REQUEST, DELETE_CONTACT_SUCCESS, DELETE_CONTACT_FAILURE,
  CONTACT_ADD_BUTTON_CLICKED, CONTACT_EDIT_BUTTON_CLICKED, CONTACT_DELETE_BUTTON_CLICKED}
  from '../constants';
import { pushPath } from 'redux-simple-router';

import {backendURL} from './index';
import {loginUserSuccess, loginUserFailure} from './login';


// GET
export function receiveContactsData(data) {
  return {
    type: GET_CONTACTS_DATA_SUCCESS,
    payload: {
      data: data
    }
  };
}

export function fetchContactsDataRequest() {
  return {
    type: GET_CONTACTS_DATA
  };
}

export function fetchContactsData(token) {
  return (dispatch) => {
    dispatch(fetchContactsDataRequest());
    return fetch(`${backendURL}/api/v0/contactPerson`, {
      credentials: 'include',
      headers: {
        'X-Auth-Token': `${token}`
      }
    })
    .then(parseResponse)
    .then(({json: contacts, token: newToken}) => {
      dispatch(receiveContactsData(contacts));
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

export function contactSelected(contactId) {
  return {
    type: CONTACT_SELECTED,
    payload: contactId
  };
}

export function contactClicked(contactId, rootPath = '/contact/') {
  return (dispatch) => {
    dispatch(pushPath(rootPath + contactId));
  };
}

export function clearSelectedContact() {
  return (dispatch) => {
    dispatch(pushPath('/contact'));
    dispatch({
      type: CONTACT_CLEAR
    });
  };
}

export function contactAddButtonClicked() {
  return {
    type: CONTACT_ADD_BUTTON_CLICKED
  };
}

export function contactEditButtonClicked(contactId) {
  return (dispatch) => {
    dispatch(pushPath('/contact/edit/' + contactId));
    dispatch({
      type: CONTACT_EDIT_BUTTON_CLICKED
    });
  };
}

export function contactEditMode(isEditMode) {
  return {
    type: CONTACT_EDIT_MODE,
    payload: isEditMode
  };
}

export function contactDeleteButtonClicked() {
  return {
    type: CONTACT_DELETE_BUTTON_CLICKED
  };
}


// SAVE
export function saveContactRequest() {
  return {
    type: SAVE_CONTACT_REQUEST
  };
}

export function saveContactSuccess(contact) {
  return {
    type: SAVE_CONTACT_SUCCESS,
    payload: {
      contact: contact
    }
  };
}

export function cancelSaveContact() {
  return {
    type: SAVE_CONTACT_CANCEL
  };
}

export function saveContactFailure(error) {
  return {
    type: SAVE_CONTACT_FAILURE,
    payload: error
  };
}

export function saveContact(token, contactData) {
  return function(dispatch) {
    dispatch(saveContactRequest());
    return fetch(`${backendURL}/api/v0/contactPerson`, {
      method: contactData.id ? 'put' : 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Auth-Token': `${token}`
      },
      body: JSON.stringify(contactData)
    })
    .then(parseResponse)
    .then(({json: json, token: newToken}) => {
      dispatch(saveContactSuccess(json));
      dispatch(loginUserSuccess(newToken));
      dispatch(fetchContactsData(newToken));
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        dispatch(loginUserFailure(error));
      } else {
        dispatch(saveContactFailure(error.json));
        throw error;
      }
    });
  };
}


// DELETE
export function deleteContactRequest() {
  return {
    type: DELETE_CONTACT_REQUEST
  };
}

export function deleteContactSuccess(json, contact) {
  return {
    type: DELETE_CONTACT_SUCCESS,
    payload: contact
  };
}

export function deleteContactFailure(error) {
  return {
    type: DELETE_CONTACT_FAILURE,
    payload: error
  };
}

export function deleteContact(token, contactData) {
  return function(dispatch) {
    dispatch(deleteContactRequest());
    return fetch(`${backendURL}/api/v0/contactPerson/id/${contactData.id}`, {
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
        dispatch(deleteContactSuccess(json, contactData));
        dispatch(pushPath('/contact'));
        dispatch(loginUserSuccess(newToken));
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          dispatch(loginUserFailure(error));
        } else {
          dispatch(deleteContactFailure(error.json));
          throw error;
        }
      });
  };
}
