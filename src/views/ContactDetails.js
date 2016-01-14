import React from 'react/addons';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

export class ChildDetails extends React.Component {
  static propTypes = {
    selectedItem: React.PropTypes.object,
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
      <div className="Person-main" >
        <div className="Mobile NavBar">
          <i
            className="mdi mdi-arrow-left"
            onClick={this.goBack.bind(this)}
            ></i>
        </div>
        <div className="Person-details">
          The data might be deleted.
        </div>
      </div>
    );
  }

  render() {
    if (!this.props.selectedItem) {
      return this.renderBlank();
    }
    const item = this.props.selectedItem;

    let address = null;
    if (item.address) {
      address = (
        <div className="Person-section">
          <span className="Person-label">address</span>
          <span className="Person-value">
            {item.address.street},<br/>
            {item.address.zipCode} {item.address.city},<br/>
            {item.address.country}
          </span>
        </div>
      );
    }

    return (
      <div className="Person-main" >
        <div className="Mobile NavBar">
          <i
            className="mdi mdi-arrow-left"
            onClick={this.goBack.bind(this)}
            ></i>
        </div>
        <div className="Person-details">
          <h2 className="Person-name">
            {item.firstName} {item.lastName}
          </h2>
          {address}
          <div className="Person-section">
            <span className="Person-label">mobile</span>
            <span className="Person-value">{item.mobilePhone}</span>
          </div>
          <div className="Person-section">
            <span className="Person-label">landline</span>
            <span className="Person-value">{item.landline}</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedItem: state.contacts.selected
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildDetails);
