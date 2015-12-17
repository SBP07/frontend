import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from 'containers/Root';
import configureStore from './store/configureStore';
import {loginUserSuccess} from './actions/login';

const target = document.getElementById('root');
const store = configureStore(window.__INITIAL_STATE__);

const node = (
  <Root store={store} />
);

const token = localStorage.getItem('token');
if (token !== null) {
  store.dispatch(loginUserSuccess(token));
}

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(node, target);
