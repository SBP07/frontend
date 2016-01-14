import { parseResponse } from '../utils';
import {GET_CONTACTS_DATA, GET_CONTACTS_DATA_SUCCESS,
  CONTACT_SELECTED, CONTACT_CLEAR,
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

export function contactSelected(contact) {
  return {
    type: CONTACT_SELECTED,
    payload: contact
  };
}

export function contactClicked(contact) {
  return (dispatch) => {
    dispatch(pushPath('/contact/' + contact.id, contact));
    dispatch(contactSelected(contact));
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

export function contactEditButtonClicked(contact) {
  return (dispatch) => {
    dispatch(pushPath('/contact/edit/' + contact.id, contact));
    dispatch({
      type: CONTACT_EDIT_BUTTON_CLICKED
    });
  };
}

export function contactDeleteButtonClicked() {
  return {
    type: CONTACT_DELETE_BUTTON_CLICKED
  };
}
