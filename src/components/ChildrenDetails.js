import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index.js';

export class ChildrenDetails extends React.Component {
  static propTypes = {
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object
  }

  goBack() {
    this.props.actions.clearSelectedChild();
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
      <div className="Children-main" >
        <div className="Mobile NavBar">
          <i
            className="mdi mdi-arrow-left"
            onClick={this.goBack.bind(this)}
            ></i>
        </div>
        <div className="ChildDetails">
          <h2 className="Child-name">
            {child.firstName} {child.lastName}
          </h2>
          <div className="Child-section">
            <span className="Child-label">birthday</span>
            <span className="Child-value">{new Date(child.birthDate).toDateString()}</span>
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
