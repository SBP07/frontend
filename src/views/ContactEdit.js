import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import { pad } from '../utils/index.js';
import TextField from 'material-ui/lib/text-field';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import zipCodes from '../constants/zip-be';
import MenuItem from 'material-ui/lib/menus/menu-item';

export class ContactEdit extends React.Component {
  static propTypes = {
    contacts: React.PropTypes.array,
    selectedItem: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string,
    isSaving: React.PropTypes.bool,
    saveError: React.PropTypes.string,
    path: React.PropTypes.string,
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.setContactData();
  }

  componentWillReceiveProps() {
    this.setContactData();
  }

  onSave() {
    if (this.props.isSaving === true) return;

    const contact = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      mobilePhone: this.state.mobilePhone,
      landline: this.state.landline,
      tenantCanonicalName: SPEELDATABASE,
      id: this.state.id
    };

    const {street, zipCode, city, country} = this.state;
    if (street && zipCode && city && country) {
      contact.address = {street, zipCode, city, country};
      contact.address.zipCode = parseInt(contact.address.zipCode, 10);
    }

    this.props.actions.saveContact(this.props.token, contact);
  }

  setContactData() {
    this.state = Object.assign({
      firstName: '',
      lastName: '',
      mobilePhone: '',
      landline: '',
      street: '',
      zipCode: '',
      city: '',
      country: 'Belgium'
    }, this.props.selectedItem);

    if (this.props.selectedItem && this.props.selectedItem.address) {
      Object.assign(this.state, this.props.selectedItem.address);
    }

    const birthDate = new Date(this.state.birthDate);
    if (!isNaN(birthDate)) {
      Object.assign(this.state, {
        month: pad(birthDate.getMonth() + 1),
        day: pad(birthDate.getDate()),
        year: birthDate.getFullYear()
      });
    }
  }

  goBack() {
    this.props.actions.clearSelectedContact();
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

  renderEmpty() {
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
      return this.renderEmpty();
    }

    let matchedCities = [];
    if (this.state.zipCode.length > 0) {
      matchedCities = zipCodes.filter((obj) => obj.zip === this.state.zipCode);
    }

    return (
      <div className="Person-main" >
        <div className="Mobile NavBar">
          <i
            className="mdi mdi-arrow-left"
            onClick={this.goBack.bind(this)}
            ></i>
        </div>
        <div className="Person-details Form-leftright">
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
                onEnterKeyDown={this.onSave.bind(this)}
                />
              <TextField
                hintText="Last Name"
                floatingLabelText="Last Name"
                valueLink={this.linkState('lastName')}
                errorText={this.state.lastNameError}
                onEnterKeyDown={this.onSave.bind(this)}
                />
            </span>
          </div>

          <div className="Form-section">
            <span className="Form-label">address</span>
            <span className="Form-value">
              <TextField
                floatingLabelText="Street"
                valueLink={this.linkState('street')}
                onEnterKeyDown={this.onSave.bind(this)}
                />
              <TextField
                floatingLabelText="Zip"
                valueLink={this.linkState('zipCode')}
                onEnterKeyDown={this.onSave.bind(this)}
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
                onEnterKeyDown={this.onSave.bind(this)}
                />
              <TextField
                hintText="Landline"
                floatingLabelText="Landline"
                valueLink={this.linkState('landline')}
                errorText={this.state.landlineError}
                onEnterKeyDown={this.onSave.bind(this)}
                />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

reactMixin(ContactEdit.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  contacts: state.contacts.data,
  selectedItem: state.contacts.selected,
  token: state.auth.token,
  isSaving: state.contacts.isSaving,
  saveError: state.contacts.saveError,
  path: state.routing.path
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactEdit);
