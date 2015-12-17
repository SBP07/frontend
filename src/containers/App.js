import React from 'react';
import {Navigation} from 'components/Navigation';
import 'styles/app.scss';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node
  }

  render() {
    return (
      <div>
        <Navigation />
        {this.props.children}
      </div>
    );
  }
}
