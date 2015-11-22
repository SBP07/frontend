import React from 'react/addons';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import reactMixin from 'react-mixin';
import * as actionCreators from '../actions';

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
    return (
      <div className="Login Login--page">
        <h1>Login</h1>
        {this.props.statusText ? <div className="alert alert-info">{this.props.statusText}</div> : ''}
        <form role="form">
          <div className="Login-group">
            <input type="text"
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
            onClick={this.login.bind(this)}>Log in</button>
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
