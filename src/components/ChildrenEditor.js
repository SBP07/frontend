import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index.js';

import TextField from 'material-ui/lib/text-field';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import SelectField from 'material-ui/lib/select-field';
import AutoComplete from 'material-ui/lib/auto-complete';
import RaisedButton from 'material-ui/lib/raised-button';
import zipCodes from '../constants/zip-be';


export class ChildrenEditor extends React.Component {
  static propTypes = {
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({
      firstName: '',
      lastName: '',
      birthday: new Date(),
      street: '',
      number: '',
      zipCode: '',
      city: '',
      country: 'Belgium'
    }, this.props.selectedChild);
  }

  goBack() {
    this.props.actions.clearSelectedChild();
  }

  handleBirthdayChange(arg, birthday) {
    console.log(birthday);
  }

  doNothing() {
    /* ────────────────────────────────────
      ─────────▄███████████▄▄──────────────
      ──────▄██▀──────────▀▀██▄────────────
      ────▄█▀────────────────▀██───────────
      ──▄█▀────────────────────▀█▄─────────
      ─█▀──██──────────────██───▀██────────
      █▀──────────────────────────██───────
      █──███████████████████───────█───────
      █────────────────────────────█───────
      █────────────────────────────█───────
      █────────────────────────────█───────
      █────────────────────────────█───────
      █────────────────────────────█───────
      █▄───────────────────────────█───────
      ▀█▄─────────────────────────██───────
      ─▀█▄───────────────────────██────────
      ──▀█▄────────────────────▄█▀─────────
      ───▀█▄──────────────────██───────────
      ─────▀█▄──────────────▄█▀────────────
      ───────▀█▄▄▄──────▄▄▄███████▄▄───────
      ────────███████████████───▀██████▄───
      ─────▄███▀▀────────▀███▄──────█─███──
      ───▄███▄─────▄▄▄▄────███────▄▄████▀──
      ─▄███▓▓█─────█▓▓█───████████████▀────
      ─▀▀██▀▀▀▀▀▀▀▀▀▀███████████────█──────
      ────█─▄▄▄▄▄▄▄▄█▀█▓▓─────██────█──────
      ────█─█───────█─█─▓▓────██────█──────
      ────█▄█───────█▄█──▓▓▓▓▓███▄▄▄█──────
      ────────────────────────██──────────
      ────────────────────────██───▄███▄───
      ────────────────────────██─▄██▓▓▓██──
      ───────────────▄██████████─█▓▓▓█▓▓██▄
      ─────────────▄██▀───▀▀███──█▓▓▓██▓▓▓█
      ─▄███████▄──███───▄▄████───██▓▓████▓█
      ▄██▀──▀▀█████████████▀▀─────██▓▓▓▓███
      ██▀─────────██──────────────██▓██▓███
      ██──────────███──────────────█████─██
      ██───────────███──────────────█─██──█
      ██────────────██─────────────────█───
      ██─────────────██────────────────────
      ██─────────────███───────────────────
      ██──────────────███▄▄────────────────
      ███──────────────▀▀███───────────────
      ─███─────────────────────────────────
      ──███────────────────────────────────*/
  }

  onSave() {
    console.log(this.state);
  }

  render() {
    let matchedCities = [];
    if (this.state.zipCode.length > 0) {
      matchedCities =
        zipCodes.filter((obj) => obj.zip === this.state.zipCode);
    }

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
            <input type="text"
              autoFocus="autofocus"
              placeholder="First"
              size={this.state.firstName.length}
              valueLink={this.linkState('firstName')} />
            <input type="text"
              placeholder="Last"
              size={this.state.lastName.length}
              valueLink={this.linkState('lastName')} />
          </h2>

          <div className="Child-section">
            <span className="Child-label">birthday</span>
            <span className="Child-value">
              <DatePicker
                hintText="Landscape Dialog"
                value={this.state.birthday}
                maxDate={new Date()}
                mode="landscape"
                valueLink={this.linkState('birthday')}
                onShow={this.doNothing}
                onDismiss={this.doNothing}
                />
            </span>
          </div>

          <div className="Child-section">
            <span className="Child-label">address</span>
            <span className="Child-value">
              <TextField
                hintText="Street"
                fullWidth={true}
                valueLink={this.linkState('street')}
                />

              <div>
                <TextField
                  hintText="Zip"
                  valueLink={this.linkState('zipCode')}
                  />
                <AutoComplete
                  hintText="City"
                  dataSource={matchedCities.map(obj => obj.city)}
                  />
              </div>
                <SelectField
                  style={{marginTop: 24}}
                  hintText="Country"
                  fullWidth={true}
                  valueLink={this.linkState('country')}
                  valueMember="text"
                  displayMember="text"
                  menuItems={[
                    {
                      payload: 1,
                      text: 'Belgium'
                    },
                    {
                      payload: 2,
                      text: 'Netherlands'
                    },
                    {
                      payload: 3,
                      text: 'Germany'
                    }
                  ]} />
            </span>
          </div>

          <div className="Child-section">
            <RaisedButton
              label="Primary"
              primary={true}
              onTouchTap={this.onSave.bind(this)} />
          </div>
        </div>

      </div>
    );
  }
}

reactMixin(ChildrenEditor.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  selectedChild: state.children.selected
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenEditor);
