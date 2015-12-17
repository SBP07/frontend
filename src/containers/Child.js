import React from 'react';
import ChildrenSelector from '../components/ChildrenSelector';
import ChildrenButtons from '../components/ChildrenButtons';
import ChildrenAdder from '../components/ChildrenAdder';
import ChildrenDestroyer from '../components/ChildrenDestroyer';

import 'styles/children.scss';

export default class Child extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    params: React.PropTypes.object
  }

  render() {
    return (
      <div className="Children">
        <ChildrenSelector
          params={this.props.params} />
        {this.props.children}
        <ChildrenButtons params={this.props.params} />
        <ChildrenAdder />
        <ChildrenDestroyer />
      </div>
    );
  }
}
