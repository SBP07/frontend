import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import zipCodes from '../constants/zip-be';
import MenuItem from 'material-ui/lib/menus/menu-item';

export class ContactsAdder extends React.Component {
  static propTypes = {
    selectedItem: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string,
    addMode: React.PropTypes.bool,
    isSaving: React.PropTypes.bool,
    saveError: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      street: '',
      zipCode: '',
      city: '',
      country: 'Belgium',
      landline: '',
      mobilePhone: ''
    };
  }

  onDialogCancel() {
    this.props.actions.cancelSaveContact();
  }


  onDialogSubmit() {
    if (this.props.isSaving === true) return;

    const contact = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      mobilePhone: this.state.mobilePhone,
      landline: this.state.landline,
      tenantCanonicalName: SPEELDATABASE
    };

    const {street, zipCode, city, country} = this.state;
    if (street && zipCode && city && country) {
      contact.address = {street, zipCode, city, country};
      contact.address.zipCode = parseInt(contact.address.zipCode, 10);
    }

    this.props.actions.saveContact(this.props.token, contact);
  }

  handleCountryChange(event, index, value) {
    this.setState({
      country: value
    });
  }

  handleCityChange(value) {
    this.setState({
      city: value
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.onDialogCancel.bind(this)} />,
      <FlatButton
        label={this.props.isSaving === true ? 'Adding...' : 'Add'}
        primary={true}
        onTouchTap={this.onDialogSubmit.bind(this)} />
    ];

    let matchedCities = [];
    if (this.state.zipCode.length > 0) {
      matchedCities = zipCodes.filter((obj) => obj.zip === this.state.zipCode);
    }

    return (
      <Dialog
        autoScrollBodyContent={true}
        title="Register a contact person"
        actions={actions}
        onRequestClose={this.onDialogCancel.bind(this)}
        open={this.props.addMode}>

        <div className="Form-leftright">
          {
            this.props.saveError ?
            <div className="Form-message Form-message--error">
              {this.props.saveError}
            </div> : ''
          }
          <div className="Form-section">
            <span className="Form-label">name</span>
            <span className="Form-value">
              <TextField
                hintText="First Name"
                floatingLabelText="First Name"
                valueLink={this.linkState('firstName')}
                errorText={this.state.firstNameError}
                onEnterKeyDown={this.onDialogSubmit.bind(this)}
                />
              <TextField
                hintText="Last Name"
                floatingLabelText="Last Name"
                valueLink={this.linkState('lastName')}
                errorText={this.state.lastNameError}
                onEnterKeyDown={this.onDialogSubmit.bind(this)}
                />
            </span>
          </div>

          <div className="Form-section">
            <span className="Form-label">address</span>
            <span className="Form-value">
              <TextField
                floatingLabelText="Street"
                valueLink={this.linkState('street')}
                />
              <TextField
                floatingLabelText="Zip"
                valueLink={this.linkState('zipCode')}
                />
              <AutoComplete
                floatingLabelText="City"
                value={this.state.city}
                onNewRequest={this.handleCityChange.bind(this)}
                dataSource={matchedCities.map(obj => obj.city)}
                />
              <SelectField
                hintText="Country"
                floatingLabelText="Country"
                value={this.state.country}
                onChange={this.handleCountryChange.bind(this)}>
                <MenuItem value="Belgium" primaryText="Belgium"/>
                <MenuItem value="Nederland" primaryText="Nederland"/>
                <MenuItem value="Deutschland" primaryText="Deutschland"/>
              </SelectField>
            </span>
          </div>

          <div className="Form-section">
            <span className="Form-label">contact details</span>
            <span className="Form-value">
              <TextField
                hintText="Mobile Phone"
                floatingLabelText="Mobile Phone"
                valueLink={this.linkState('mobilePhone')}
                errorText={this.state.mobilePhoneError}
                onEnterKeyDown={this.onDialogSubmit.bind(this)}
                />
              <TextField
                hintText="Landline"
                floatingLabelText="Landline"
                valueLink={this.linkState('landline')}
                errorText={this.state.landlineError}
                onEnterKeyDown={this.onDialogSubmit.bind(this)}
                />
            </span>
          </div>

        </div>
      </Dialog>
    );
  }
}

reactMixin(ContactsAdder.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  selectedItem: state.contacts.selected,
  token: state.auth.token,
  addMode: state.contacts.addMode,
  isSaving: state.contacts.isSaving,
  saveError: state.contacts.saveError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsAdder);
