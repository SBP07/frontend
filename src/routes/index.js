import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {App} from '../containers';
import {HomeView, LoginView, ChildrenIndexView} from '../views';
import {requireAuthentication} from '../components/AuthenticatedComponent';

export default(
  <Route path="/" component={App}>
    <IndexRoute component={HomeView}/>
    <Route path="login" component={LoginView}/>
    <Route path="child">
      <IndexRoute component={requireAuthentication(ChildrenIndexView)}/>
    </Route>
  </Route>
);
