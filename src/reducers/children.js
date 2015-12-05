import {createReducer} from '../utils/index.js';
import {RECEIVE_CHILDREN_DATA, FETCH_CHILDREN_DATA_REQUEST, CHILD_SELECTED, CHILD_CLEAR, CHILD_ADD_BUTTON_CLICKED,
  SAVE_CHILD_REQUEST, SAVE_CHILD_SUCCESS} from '../constants/index.js';

const initialState = {
  data: [],
  selected: null,
  isFetching: false,
  editMode: false
};

export default createReducer(initialState, {
  [RECEIVE_CHILDREN_DATA]: (state, payload) => {
    return Object.assign({}, state, {
      'data': payload.data,
      'selected': null,
      'isFetching': false,
      'editMode': false
    });
  },
  [FETCH_CHILDREN_DATA_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isFetching': true,
      'editMode': false,
      'selected': null
    });
  },
  [CHILD_SELECTED]: (state, child) => {
    return Object.assign({}, state, {
      'selected': child,
      'editMode': false
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
      'editMode': true,
      'selected': null
    });
  },
  [SAVE_CHILD_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isSaving': true
    });
  },
  [SAVE_CHILD_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'isSaving': false,
      'selected': payload.child,
      'editMode': false
    });
  },
});
