import React from 'react';
import {connect} from 'react-redux';
import {pushPath} from 'redux-simple-router';

export function requireAuthentication(Component) {
  class AuthenticatedComponent extends React.Component {
    static propTypes = {
      isAuthenticated: React.PropTypes.bool,
      location: React.PropTypes.object,
      dispatch: React.PropTypes.func
    }

    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps() {
      this.checkAuth();
    }

    checkAuth() {
      if (!this.props.isAuthenticated) {
        const redirectAfterLogin = this.props.location.pathname;
        this.props.dispatch(pushPath(`/login?next=${redirectAfterLogin}`));
      }
    }

    render() {
      return (
        <div>
          {this.props.isAuthenticated === true
            ? <Component {...this.props}/>
            : null
          }
        </div>
      );
    }
  }

  const mapStateToProps = (state) => ({
    token: state.auth.token,
    isAuthenticated: state.auth.isAuthenticated
  });

  return connect(mapStateToProps)(AuthenticatedComponent);
}
