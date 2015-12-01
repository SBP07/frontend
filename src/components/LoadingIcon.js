import React from 'react';
import icon from '../loading.svg';

export class LoadingIcon extends React.Component {
  static propTypes = {
    size: React.PropTypes.number,
    margin: React.PropTypes.number
  }

  render() {
    const size = this.props.size || 50;
    const margin = this.props.margin || 0;
    return (
      <img src={icon} width={size} height={size} style={{
        margin: margin
      }} />
    );
  }
}
