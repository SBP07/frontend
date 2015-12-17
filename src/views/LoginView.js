import React from 'react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import actionCreators from '../actions';

import 'styles/login.scss';

export class LoginView extends React.Component {
  static propTypes = {
    location: React.PropTypes.object,
    actions: React.PropTypes.object,
    statusText: React.PropTypes.string,
    isAuthenticating: React.PropTypes.bool
  }

  constructor(props) {
    super(props);
    const redirectRoute = this.props.location.query.next || '/login';
    this.state = {
      email: '',
      password: '',
      redirectTo: redirectRoute
    };
  }

  login(e) {
    e.preventDefault();
    this.props.actions.loginUser(this.state.email, this.state.password, this.state.redirectTo);
  }

  render() {
    const statusText = this.props.statusText;
    return (
      <div className="Login Login--page">
        <h1 className="Title">Login</h1>
        {statusText ? <div className="Message">{statusText}</div> : ''}
        <form role="form">
          <div className="Login-group">
            <input type="email"
              autoFocus="autofocus"
              valueLink={this.linkState('email')}
              placeholder="Email" />
            </div>
          <div className="Login-group">
            <input type="password"
              valueLink={this.linkState('password')}
              placeholder="Password" />
          </div>
          <button type="submit"
            className="Button Button--fluid"
            disabled={this.props.isAuthenticating}
            onClick={this.login.bind(this)}>
              {
                this.props.isAuthenticating ?
                'Logging in...' : 'Log In'
              }
            </button>
      </form>
    </div>
    );
  }
}

reactMixin(LoginView.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  isAuthenticating   : state.auth.isAuthenticating,
  statusText         : state.auth.statusText
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);
