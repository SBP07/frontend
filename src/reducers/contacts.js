import {createReducer} from '../utils/index.js';
import { GET_CONTACTS_DATA, GET_CONTACTS_DATA_SUCCESS,
  CONTACT_SELECTED, CONTACT_CLEAR,
  DELETE_CONTACT_REQUEST, DELETE_CONTACT_SUCCESS, DELETE_CONTACT_FAILURE,
  SAVE_CONTACT_REQUEST, SAVE_CONTACT_SUCCESS, SAVE_CONTACT_CANCEL, SAVE_CONTACT_FAILURE,
  CONTACT_ADD_BUTTON_CLICKED, CONTACT_EDIT_BUTTON_CLICKED, CONTACT_DELETE_BUTTON_CLICKED,
  GET_CONTACT_CHILDREN_SUCCESS, GET_CONTACT_CHILDREN} from '../constants';

const initialState = {
  data: [],
  relations: [],
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
  [CONTACT_SELECTED]: (state, itemId) => {
    const item = state.data.filter(c => c.id === itemId)[0];
    return Object.assign({}, state, {
      'selected': item,
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
      'isSaving': false,
      'saveError': null,
      'editMode': !state.editMode
    });
  },
  [CONTACT_DELETE_BUTTON_CLICKED]: (state) => {
    return Object.assign({}, state, {
      'deleteMode': !state.deleteMode,
      'isSaving': false,
      'saveError': null
    });
  },
  // SAVE
  [SAVE_CONTACT_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isSaving': true,
      'saveError': null
    });
  },
  [SAVE_CONTACT_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'selected': payload.contact,
      'editMode': false,
      'addMode': false,
      'saveError': null
    });
  },
  [SAVE_CONTACT_CANCEL]: (state) => {
    return Object.assign({}, state, {
      'addMode': false,
      'isSaving': false
    });
  },
  [SAVE_CONTACT_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': payload.message
    });
  },
  // DELETE
  [DELETE_CONTACT_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isSaving': true,
      'saveError': null
    });
  },
  [DELETE_CONTACT_SUCCESS]: (state, payload) => {
    const data = state.data.filter((c) => c.id !== payload.id);
    return Object.assign({}, state, {
      'selected': null,
      'isSaving': false,
      'deleteMode': false,
      'editMode': false,
      'saveError': null,
      'data': data
    });
  },
  [DELETE_CONTACT_FAILURE]: (state, payload) => {
    const msg = payload && payload.message ?
      payload.message : 'Failed to delete contact';

    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': msg
    });
  },
  [GET_CONTACT_CHILDREN_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'isFetching': false,
      'relations': payload
    });
  },
  [GET_CONTACT_CHILDREN]: (state) => {
    return Object.assign({}, state, {
      'isFetching': true,
      'relations': []
    });
  }
});
