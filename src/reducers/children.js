import {createReducer} from '../utils/index.js';
import {GET_CHILDREN_DATA_SUCCESS, GET_CHILDREN_DATA,
  CHILD_SELECTED, CHILD_CLEAR, CHILD_EDIT_MODE,
  CHILD_ADD_BUTTON_CLICKED, CHILD_EDIT_BUTTON_CLICKED, CHILD_DELETE_BUTTON_CLICKED,
  SAVE_CHILD_FAILURE, SAVE_CHILD_REQUEST, SAVE_CHILD_SUCCESS, SAVE_CHILD_CANCEL,
  DELETE_CHILD_REQUEST, DELETE_CHILD_SUCCESS, DELETE_CHILD_FAILURE,
  GET_CHILD_CONTACTS_SUCCESS, GET_CHILD_CONTACTS,
  ADD_CONTACT_FOR_CHILD_SUCCESS, ADD_CONTACT_FOR_CHILD, ADD_CONTACT_FOR_CHILD_FAILURE} from '../constants/index.js';

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
  [GET_CHILDREN_DATA_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'data': payload.data,
      'isFetching': false
    });
  },
  [GET_CHILDREN_DATA]: (state) => {
    return Object.assign({}, state, {
      'isFetching': true
    });
  },
  // UI
  [CHILD_SELECTED]: (state, itemId) => {
    const item = state.data.filter(c => c.id === itemId)[0];
    return Object.assign({}, state, {
      'selected': item
    });
  },
  [CHILD_CLEAR]: (state) => {
    return Object.assign({}, state, {
      'selected': null,
      'editMode': false
    });
  },
  [CHILD_ADD_BUTTON_CLICKED]: (state) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': null,
      'addMode': true
    });
  },
  [CHILD_EDIT_BUTTON_CLICKED]: (state) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': null,
      'editMode': !state.editMode
    });
  },
  [CHILD_EDIT_MODE]: (state, payload) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': null,
      'editMode': payload
    });
  },
  [CHILD_DELETE_BUTTON_CLICKED]: (state) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': null,
      'deleteMode': !state.deleteMode
    });
  },
  // SAVE
  [SAVE_CHILD_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isSaving': true,
      'saveError': null
    });
  },
  [SAVE_CHILD_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'selected': payload.child,
      'editMode': false,
      'addMode': false,
      'saveError': null
    });
  },
  [SAVE_CHILD_CANCEL]: (state) => {
    return Object.assign({}, state, {
      'addMode': false,
      'isSaving': false
    });
  },
  [SAVE_CHILD_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': payload.message
    });
  },
  // DELETE
  [DELETE_CHILD_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isSaving': true,
      'saveError': null
    });
  },
  [DELETE_CHILD_SUCCESS]: (state, payload) => {
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
  [DELETE_CHILD_FAILURE]: (state, payload) => {
    const msg = payload && payload.message ?
      payload.message : 'Failed to delete child';

    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': msg
    });
  },
  [GET_CHILD_CONTACTS_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'isFetching': false,
      'relations': payload
    });
  },
  [GET_CHILD_CONTACTS]: (state) => {
    return Object.assign({}, state, {
      'isFetching': true,
      'relations': []
    });
  },
  [ADD_CONTACT_FOR_CHILD_SUCCESS]: (state) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': null
    });
  },
  [ADD_CONTACT_FOR_CHILD]: (state) => {
    return Object.assign({}, state, {
      'isSaving': true,
      'saveError': null
    });
  },
  [ADD_CONTACT_FOR_CHILD_FAILURE]: (state, payload) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'saveError': payload.message
    });
  }
});
