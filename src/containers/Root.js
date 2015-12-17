import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import routes from '../routes';
import {history} from '../store/configureStore';

export default class Root extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  }

  render() {
    return (
      <Provider store={this.props.store}>
        <Router history={history}>
          {routes}
        </Router>
      </Provider>
    );
  }
}
