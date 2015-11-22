import React from 'react';
import icon from '../loading.svg';

export class LoadingIcon extends React.Component {
  render() {
    return (
      <img src={icon} width="50" height="50" />
    );
  }
}
