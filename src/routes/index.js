import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {App, Child, Contact} from '../containers';
import {HomeView, LoginView} from '../views';
import {ChildDetails, NoChild, ChildEdit} from '../views';
import {ContactDetails, NoContact, ContactEdit} from '../views';
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
    <Route path="contact" component={requireAuthentication(Contact)}>
      <IndexRoute component={HomeView} />
      <Route path="edit/:id" component={ContactEdit} />
      <Route path=":id" component={ContactDetails} />
      <Route path="*" component={NoContact} />
    </Route>
  </Route>
);
