import { parseResponse } from '../utils';
import {GET_CONTACTPERSONS_DATA, GET_CONTACTPERSONS_DATA_SUCCESS}
  from '../constants';
import { pushPath } from 'redux-simple-router';

import {backendURL} from './index';
import {loginUserSuccess, loginUserFailure} from './login';


// GET
export function receiveContactPersonsData(data) {
  return {
    type: GET_CONTACTPERSONS_DATA_SUCCESS,
    payload: {
      data: data
    }
  };
}

export function fetchContactPersonsDataRequest() {
  return {
    type: GET_CONTACTPERSONS_DATA
  };
}

export function fetchContactPersons(token) {
  return (dispatch) => {
    dispatch(fetchContactPersonsDataRequest());
    return fetch(`${backendURL}/api/v0/contactPerson`, {
      credentials: 'include',
      headers: {
        'X-Auth-Token': `${token}`
      }
    })
    .then(parseResponse)
    .then(({json: contactpersons, token: newToken}) => {
      dispatch(receiveContactPersonsData(contactpersons));
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
