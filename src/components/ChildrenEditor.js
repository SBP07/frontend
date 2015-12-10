import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index.js';

import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';


export class ChildrenEditor extends React.Component {
  static propTypes = {
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = Object.assign({
      firstName: '',
      lastName: '',
      birthDate: new Date()
    }, this.props.selectedChild);
  }

  onSave() {
    this.props.actions.saveChild(this.props.token, this.state);
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

  goBack() {
    this.props.actions.clearSelectedChild();
  }

  render() {
    return (
      <div className="Children-main" >
        <div className="Mobile NavBar">
          <i
            className="mdi mdi-arrow-left"
            onClick={this.goBack.bind(this)}
            ></i>
        </div>

        <div className="ChildDetails">
          <div className="Child-section">
            <span className="Child-label">name</span>
            <span className="Child-value">
              <TextField
                hintText="First Name"
                floatingLabelText="First Name"
                valueLink={this.linkState('firstName')}
                />
              <TextField
                hintText="Last Name"
                floatingLabelText="Last Name"
                valueLink={this.linkState('lastName')}
                />
            </span>
          </div>

          <div className="Child-section">
            <span className="Child-label">birthday</span>
            <span className="Child-value">
              <TextField
                hintText="Day"
                floatingLabelText="Day"
                style={{width: 50}}
                valueLink={this.linkState('day')}
                />
              <TextField
                hintText="Month"
                floatingLabelText="Month"
                style={{width: 60}}
                valueLink={this.linkState('month')}
                />
              <TextField
                hintText="Year"
                floatingLabelText="Year"
                style={{width: 60}}
                valueLink={this.linkState('year')}
                />
            </span>
          </div>

          <div className="Child-section">

            <RaisedButton
              primary={true}
              label="Save"
              onTouchTap={this.onSave.bind(this)} />
          </div>
        </div>

      </div>
    );
  }
}

reactMixin(ChildrenEditor.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  selectedChild: state.children.selected,
  token: state.auth.token
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenEditor);
