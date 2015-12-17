import React from 'react';

export default class HomeView extends React.Component {
  render() {
    return (
      <div className="container" style={{
        'textAlign': 'center'
      }}>
        <img src={require('../speellogo.png')} width="auto" height="50px" style={{
          'margin': '10px'
        }} />
      </div>
    );
  }
}
