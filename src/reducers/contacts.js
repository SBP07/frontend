import {createReducer} from '../utils/index.js';
import { GET_CONTACTS_DATA, GET_CONTACTS_DATA_SUCCESS,
  CONTACT_SELECTED, CONTACT_CLEAR,
  CONTACT_ADD_BUTTON_CLICKED, CONTACT_EDIT_BUTTON_CLICKED, CONTACT_DELETE_BUTTON_CLICKED} from '../constants';

const initialState = {
  data: [],
  selected: null,
  isFetching: false,
  editMode: false,
  addMode: false,
  deleteMode: false
};

export default createReducer(initialState, {
  // GET
  [GET_CONTACTS_DATA]: (state) => {
    return Object.assign({}, state, {
      'isFetching': true
    });
  },
  [GET_CONTACTS_DATA_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'data': payload.data,
      'isFetching': false
    });
  },
  // UI
  [CONTACT_SELECTED]: (state, contact) => {
    return Object.assign({}, state, {
      'selected': contact,
      'editMode': false
    });
  },
  [CONTACT_CLEAR]: (state) => {
    return Object.assign({}, state, {
      'selected': null,
      'editMode': false
    });
  },
  [CONTACT_ADD_BUTTON_CLICKED]: (state) => {
    return Object.assign({}, state, {
      'addMode': true,
      'isSaving': false,
      'saveError': null
    });
  },
  [CONTACT_EDIT_BUTTON_CLICKED]: (state) => {
    return Object.assign({}, state, {
      'addMode': false,
      'isSaving': false,
      'saveError': null,
      'editMode': !state.editMode
    });
  },
  [CONTACT_DELETE_BUTTON_CLICKED]: (state) => {
    return Object.assign({}, state, {
      'addMode': false,
      'deleteMode': !state.deleteMode,
      'isSaving': false,
      'saveError': null
    });
  },
});
