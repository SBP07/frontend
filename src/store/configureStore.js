import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import { syncReduxAndRouter } from 'redux-simple-router';
import {applyMiddleware, compose, createStore} from 'redux';
import createLogger from 'redux-logger';
import { createHistory } from 'history';
const history = createHistory();

export default function configureStore(initialState) {
  let createStoreWithMiddleware;

  const logger = createLogger();
  const middleware = applyMiddleware(thunk, logger);

  createStoreWithMiddleware = compose(
   middleware
  );

  const store = createStoreWithMiddleware(createStore)(rootReducer, initialState);

  if (module.hot) {
    module.hot
      .accept('../reducers', () => {
        const nextRootReducer = require('../reducers/index');
        store.replaceReducer(nextRootReducer);
      });
  }

  syncReduxAndRouter(history, store);
  return store;
}

export {history};
