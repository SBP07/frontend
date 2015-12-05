import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index.js';

import DatePicker from 'material-ui/lib/date-picker/date-picker';
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
      birthday: new Date()
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
            <RaisedButton
              label="Save"
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
  selectedChild: state.children.selected,
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenEditor);
