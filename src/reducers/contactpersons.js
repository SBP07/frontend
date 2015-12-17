import {createReducer} from '../utils/index.js';

import { GET_CONTACTPERSONS_DATA, GET_CONTACTPERSONS_DATA_SUCCESS } from '../constants';

const initialState = {
  data: [],
  isFetching: false
};

export default createReducer(initialState, {
  [GET_CONTACTPERSONS_DATA]: (state) => {
    return Object.assign({}, state, {
      'isFetching': true
    });
  },
  [GET_CONTACTPERSONS_DATA_SUCCESS]: (state, payload) => {
    return Object.assign({}, state, {
      'data': payload.data,
      'isFetching': false
    });
  }
});
