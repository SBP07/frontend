import React from 'react/addons';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import Colors from 'material-ui/lib/styles/colors';
import Divider from 'material-ui/lib/divider';

import CommunicationCall from 'material-ui/lib/svg-icons/communication/call';
import CommunicationAddress from 'material-ui/lib/svg-icons/communication/business';

export class ChildDetails extends React.Component {
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
      for (const relation of this.props.relations) {
        const {relationship, contactPerson} = relation;

        const nestedItems = [];

        if (contactPerson.mobilePhone) {
          nestedItems.push(<ListItem
            leftIcon={<CommunicationCall color={Colors.green500} />}
            primaryText={contactPerson.mobilePhone}
            secondaryText="Mobile" />);
        }

        if (contactPerson.landline) {
          nestedItems.push(<ListItem
            leftIcon={<CommunicationCall color={Colors.green500} />}
            primaryText={contactPerson.landline}
            secondaryText="Landline" />);
        }

        if (contactPerson.address) {
          nestedItems.push(<ListItem
            leftIcon={<CommunicationAddress color={Colors.orange500} />}
            primaryText={contactPerson.address.street}
            secondaryText={`${contactPerson.address.zipCode} ${contactPerson.address.city}`} />);
        }

        contacts.push(
          <ListItem
            key={contactPerson.id}
            title={relationship}
            primaryText={`${contactPerson.firstName} ${contactPerson.lastName}`}
            leftAvatar={
              <Avatar style={{fontSize: 12}} backgroundColor={Colors.indigo600}>{contactPerson.firstName[0]}{contactPerson.lastName[0]}</Avatar>
            }
            nestedItems={nestedItems}
            />
        );

        contacts.push(<Divider inset={true} />);
      }
    }

    if (contacts.length === 0) return null;
    return (<List subheader="contacts">{contacts}</List>);
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
    if (!this.props.selectedItem) {
      return this.renderBlank();
    }
    const item = this.props.selectedItem;
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
          <div className="Person-section">
            <span className="Person-label">birthday</span>
            <span className="Person-value">{new Date(item.birthDate).toDateString()}</span>
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
  selectedItem: state.children.selected,
  relations: state.children.relations
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildDetails);
