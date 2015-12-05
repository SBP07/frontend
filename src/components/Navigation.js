import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {logoutAndRedirect} from '../actions/index.js';

@connect((state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated
  };
})
export class Navigation extends React.Component {
  static propTypes = {
    isAuthenticated: React.PropTypes.bool,
    dispatch: React.PropTypes.func
  }

  renderBlank() {
    return (
      <div></div>
    );
  }

  render() {
    if (this.props.isAuthenticated === false) {
      return this.renderBlank();
    }

    const {dispatch} = this.props;
    return (
      <nav className="Navigation">
        <div className="Navigation-menu-left">
          <Link to="/" className="Navigation-logo">
            <img src={require('../speellogo-white.png')} width="auto" height="20px" />
          </Link>
          <Link to="/child">Children</Link>
        </div>
        <div className="Navigation-menu-right">
          <a href="#" onClick={() => dispatch(logoutAndRedirect())}>
            <i className="mdi mdi-logout"></i>
          </a>
        </div>
      </nav>
    );
  }
}
