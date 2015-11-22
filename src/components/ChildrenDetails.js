import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';

export class ChildrenDetails extends React.Component {
  static propTypes = {
    selectedChild: React.PropTypes.object
  }

  renderBlank() {
    return (
      <div className="Children-main"></div>
    );
  }

  render() {
    if (!this.props.selectedChild) {
      return this.renderBlank();
    }

    const child = this.props.selectedChild;
    return (
      <div className="Children-main">
        <div className="ChildDetails">
          <h2 className="Child-name">
            {child.firstName} {child.lastName}
          </h2>
          <div className="Child-section">
            <span className="Child-label">birthday</span>
            <span className="Child-value">{new Date(child.birthDate).toDateString()}</span>
          </div>
          <div className="Child-section">
            <span className="Child-label">address</span>
            <span className="Child-value">
              {child.address.street} {child.address.number}, <br />
              {child.address.zipCode} {child.address.city}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedChild: state.children.selected
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenDetails);
