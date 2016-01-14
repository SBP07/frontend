import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import TextField from 'material-ui/lib/text-field';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import { pad } from '../utils/index.js';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import zipCodes from '../constants/zip-be';
import MenuItem from 'material-ui/lib/menus/menu-item';

export class ChildrenAdder extends React.Component {
  static propTypes = {
    selectedChild: React.PropTypes.object,
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
    this.props.actions.cancelSaveChild();
  }


  onDialogSubmit() {
    if (this.props.isSaving === true) return;
    console.log(this.state);
    if (this.verify()) {
      let {day, month, year} = this.state;
      day = pad(parseInt(day, 10));
      month = pad(parseInt(month, 10));
      year = parseInt(year, 10);

      const child = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        birthDate: `${year}-${month}-${day}`,
        tenantCanonicalName: SPEELDATABASE
      };
      this.props.actions.saveChild(this.props.token, child);
    }
  }

  verify() {
    let {day, month, year} = this.state;
    const {firstName, lastName} = this.state;
    let ok = true;

    this.setState({
      dayError: null,
      monthError: null,
      yearError: null
    });

    day = parseInt(day, 10);
    month = parseInt(month, 10);
    year = parseInt(year, 10);

    if (isNaN(day) || day > 31 || day < 1) {
      this.setState({
        dayError: 'Enter a valid day'
      });
      ok = false;
    }

    if (isNaN(month) || month > 12 || month < 1) {
      this.setState({
        monthError: 'Enter a valid month'
      });
      ok = false;
    }

    if (isNaN(year) || year > 2100 || year < 1900) {
      this.setState({
        yearError: 'Enter a valid year'
      });
      ok = false;
    }

    if (firstName.length === 0) {
      this.setState({
        firstNameError: 'Enter a first name'
      });
      ok = false;
    }

    if (lastName.length === 0) {
      this.setState({
        lastNameError: 'Enter a first name'
      });
      ok = false;
    }

    return ok;
  }

  clearErrors() {
    this.setState({
      dayError: null,
      monthError: null,
      yearError: null,
      firstNameError: null,
      lastNameError: null
    });
  }

  handleCountryChange(event, index, value) {
    this.setState({
      country: value
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
                onFocus={this.clearErrors.bind(this)}
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

        </div>
      </Dialog>
    );
  }
}

reactMixin(ChildrenAdder.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  selectedChild: state.children.selected,
  token: state.auth.token,
  addMode: state.children.addMode,
  isSaving: state.children.isSaving,
  saveError: state.children.saveError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenAdder);