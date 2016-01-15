import React from 'react/addons';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Colors from 'material-ui/lib/styles/colors';
import Divider from 'material-ui/lib/divider';

export class ContactDetails extends React.Component {
  static propTypes = {
    selectedItem: React.PropTypes.object,
    actions: React.PropTypes.object,
    relations: React.PropTypes.array
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

  renderContacts() {
    const contacts = [];

    if (this.props.relations.length > 0) {
      for (const item of this.props.relations) {
        const nestedItems = [];

        contacts.push(
          <ListItem
            key={item.id}
            primaryText={`${item.firstName} ${item.lastName}`}
            nestedItems={nestedItems}
            secondaryText={new Date(item.birthDate).toDateString()}
            leftAvatar={
              <Avatar style={{fontSize: 12}} backgroundColor={Colors.orange800}>{item.firstName[0]}{item.lastName[0]}</Avatar>
            }
            />
        );

        contacts.push(<Divider inset={true} />);
      }
    }

    if (contacts.length === 0) return null;
    return (<List subheader="children">{contacts}</List>);
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
          <div className="Person-section">
            {this.renderContacts()}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedItem: state.contacts.selected,
  relations: state.contacts.relations
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetails);
