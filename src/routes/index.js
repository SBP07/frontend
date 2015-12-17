import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {App, Child} from '../containers';
import {HomeView, LoginView} from '../views';
import {ChildDetails, NoChild, ChildAdd, ChildEdit} from '../views';
import {requireAuthentication} from '../components/AuthenticatedComponent';

export default(
  <Route path="/" component={App}>
    <IndexRoute component={requireAuthentication(HomeView)}/>
    <Route path="login" component={LoginView}/>
    <Route path="child" component={requireAuthentication(Child)}>
      <IndexRoute component={HomeView} />
      <Route path="edit/:id" component={ChildEdit}/>
      <Route path=":id" component={ChildDetails}/>
      <Route path="*" component={NoChild}/>
    </Route>
  </Route>
);
