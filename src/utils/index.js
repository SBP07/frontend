export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}

export function parseResponse(response) {
  return response.json().then( (json) => {
    if (json.status === 'error' || response.status === 401) {
      const error = new Error(json.message || response.statusText);
      error.response = response;
      error.json = json;
      throw error;
    } else {
      return {json: json, token: response.headers.get('X-Auth-Token')};
    }
  });
}

export function pad(n) {
  return n < 10 ? '0' + n : n;
}
