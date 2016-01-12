import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import { pad } from '../utils/index.js';
import TextField from 'material-ui/lib/text-field';

import ContactPersonSelector from 'components/ContactPersonSelector';


export class ChildEdit extends React.Component {
  static propTypes = {
    children: React.PropTypes.array,
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string,
    isSaving: React.PropTypes.bool,
    saveError: React.PropTypes.string,
    path: React.PropTypes.string,
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.setChildData();
  }

  componentWillReceiveProps() {
    this.setChildData();
  }

  onSave() {
    if (this.props.isSaving === true) return;
    if (this.verify()) {
      let {day, month, year} = this.state;
      day = pad(parseInt(day, 10));
      month = pad(parseInt(month, 10));
      year = parseInt(year, 10);

      const child = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        birthDate: `${year}-${month}-${day}`,
        tenantCanonicalName: SPEELDATABASE,
        id: this.state.id
      };
      this.props.actions.saveChild(this.props.token, child);
    }
  }

  setChildData() {
    this.state = Object.assign({
      firstName: '',
      lastName: '',
      birthDate: null
    }, this.props.selectedChild);

    const birthDate = new Date(this.state.birthDate);
    if (!isNaN(birthDate)) {
      Object.assign(this.state, {
        month: pad(birthDate.getMonth() + 1),
        day: pad(birthDate.getDate()),
        year: birthDate.getFullYear()
      });
    }
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

  goBack() {
    this.props.actions.clearSelectedChild();
  }

  renderEmpty() {
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
      return this.renderEmpty();
    }

    return (
      <div className="Children-main" >
        <div className="Mobile NavBar">
          <i
            className="mdi mdi-arrow-left"
            onClick={this.goBack.bind(this)}
            ></i>
        </div>
        <div className="ChildDetails Form-leftright">
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
            <span className="Form-label">birthday</span>
            <span className="Form-value">
              <TextField
                hintText="00"
                floatingLabelText="Day"
                style={{width: 200}}
                valueLink={this.linkState('day')}
                errorText={this.state.dayError}
                onFocus={this.clearErrors.bind(this)}
                onEnterKeyDown={this.onSave.bind(this)}
                />
              <TextField
                hintText="00"
                floatingLabelText="Month"
                style={{width: 200}}
                valueLink={this.linkState('month')}
                errorText={this.state.monthError}
                onFocus={this.clearErrors.bind(this)}
                onEnterKeyDown={this.onSave.bind(this)}
                />
              <TextField
                hintText="0000"
                floatingLabelText="Year"
                style={{width: 200}}
                valueLink={this.linkState('year')}
                errorText={this.state.yearError}
                onFocus={this.clearErrors.bind(this)}
                onEnterKeyDown={this.onSave.bind(this)}
                />
            </span>
          </div>

          <div className="Form-section">
            <span className="Form-label">contact person</span>
            <span className="Form-value">
              <ContactPersonSelector
                child={this.props.selectedChild}
                />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

reactMixin(ChildEdit.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  children: state.children.data,
  selectedChild: state.children.selected,
  token: state.auth.token,
  isSaving: state.children.isSaving,
  saveError: state.children.saveError,
  path: state.routing.path
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildEdit);
