import React from 'react/addons';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import ContactPersonSelector from 'components/ContactPersonSelector';

export class ChildDetails extends React.Component {
  static propTypes = {
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      contactInput: ''
    };
  }

  goBack() {
    this.props.actions.clearSelectedChild();
  }

  renderBlank() {
    return (
      <div className="Children-main" >
        <div className="Mobile NavBar">
          <i
            className="mdi mdi-arrow-left"
            onClick={this.goBack.bind(this)}
            ></i>
        </div>
        <div className="ChildDetails">
          The data might be deleted.
        </div>
      </div>
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
          <div className="Child-section">
            <span className="Child-label">contact person</span>
            <ContactPersonSelector
              child={child}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(ChildDetails);
