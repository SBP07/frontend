import {createReducer} from '../utils';
import {RECEIVE_CHILDREN_DATA, FETCH_CHILDREN_DATA_REQUEST, CHILD_SELECTED, CHILD_CLEAR} from '../constants';

const initialState = {
  data: [],
  selected: null,
  isFetching: false
};

export default createReducer(initialState, {
  [RECEIVE_CHILDREN_DATA]: (state, payload) => {
    return Object.assign({}, state, {
      'data': payload.data,
      'selected': null,
      'isFetching': false
    });
  },
  [FETCH_CHILDREN_DATA_REQUEST]: (state) => {
    return Object.assign({}, state, {
      'isFetching': true
    });
  },
  [CHILD_SELECTED]: (state, child) => {
    return Object.assign({}, state, {
      'selected': child
    });
  },
  [CHILD_CLEAR]: (state) => {
    return Object.assign({}, state, {
      'selected': null
    });
  }
});
