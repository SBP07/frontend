import React from 'react';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import ReactTransitionGroup from 'react-addons-transition-group';

import ClickAwayable from '../mixins/click-awayable';
import ImmutabilityHelper from '../utils/immutability-helper';
import Styles from '../utils/styles';

import KeyCode from '../utils/key-code';

import TextField from 'material-ui/lib/text-field';
import Menu from 'material-ui/lib/menus/menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import Divider from 'material-ui/lib/menus/menu-divider';

export class ContactPersonSelector extends React.Component {
  static propTypes = {
    contactpersons: React.PropTypes.array,
    animated: React.PropTypes.bool,
    disableFocusRipple: React.PropTypes.bool,
    errorStyle: React.PropTypes.object,
    errorText: React.PropTypes.string,
    fullWidth: React.PropTypes.bool,
    listStyle: React.PropTypes.object,
    menuCloseDelay: React.PropTypes.number,
    menuProps: React.PropTypes.object,
    menuStyle: React.PropTypes.object,
    onNewRequest: React.PropTypes.func,
    onUpdateInput: React.PropTypes.func,
    open: React.PropTypes.bool,
    searchText: React.PropTypes.string,
    style: React.PropTypes.object,
    touchTapCloseDelay: React.PropTypes.number,
    updateWhenFocused: React.PropTypes.bool
  }

  static contextTypes = {
    muiTheme: React.PropTypes.object
  }

  static defaultProps = {
    animated: true,
    fullWidth: false,
    open: false,
    searchText: '',
    menuCloseDelay: 100,
    touchTapCloseDelay: 100,
    disableFocusRipple: true,
    updateWhenFocused: false,
    onUpdateInput: () => {},
    onNewRequest: () => {},
    filter: (searchText, key) => key.includes(searchText)
  }

  constructor(props) {
    super(props);
    this.state = {
      searchText: this.props.searchText,
      open: this.props.open
    };
  }

  componentWillMount() {
    this.focusOnInput = false;
    this.requestsList = [];
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      this.setState({
        searchText: nextProps.searchText
      });
    }
  }

  getStyles() {
    return {
      root: {
        display: 'inline-block',
        position: 'relative',
        width: this.props.fullWidth ? '100%' : 256
      },
      input: {},
      error: {},
      menu: {
        top: 64,
        left: 0,
        width: '100%'
      },
      list: {
        display: 'block',
        width: this.props.fullWidth ? '100%' : 256
      }
    };
  }

  setValue(textValue) {
    this.setState({
      searchText: textValue
    });
  }

  getValue() {
    return this.state.searchText;
  }

  _handleKeyDown(e) {
    switch (e.keyCode) {
    case KeyCode.ESC:
      this.setState({open: false});
      break;
    case KeyCode.DOWN:
      if (this.focusOnInput && this.state.open) {
        e.preventDefault();
        this.focusOnInput = false;
        this.setState({open: true});
      }
      break;
    default:
      break;
    }
  }

  _handleItemTouchTap(e, child) {
    setTimeout(() => {
      this.setState({open: false});
    }, this.props.touchTapCloseDelay);

    const dataSource = this.props.contactpersons;

    let chosenRequest, index, searchText;
    if (typeof dataSource[0] === 'string') {
      chosenRequest = this.requestsList[parseInt(child.key, 10)];
      index = dataSource.indexOf(chosenRequest);
      searchText = dataSource[index];
    } else {
      chosenRequest = child.key;
      index = dataSource.indexOf(
          dataSource.filter((item) => chosenRequest === item.text)[0]);
      searchText = chosenRequest;
    }

    this.setState({searchText: searchText});

    this.props.onNewRequest(chosenRequest, index, dataSource);
  }

  _updateRequests(searchText) {
    this.setState({
      searchText: searchText,
      open: true
    });

    this.focusOnInput = true;

    this.props.onUpdateInput(searchText, this.props.contactpersons);
  }

  componentClickAway() {
    this.setState({open: false});
    this.focusOnInput = false;
  }

  renderMenu() {
    const {
      animated,
      menuStyle,
      menuProps,
      listStyle
    } = this.props;

    const styles = this.getStyles();
    const mergedMenuStyles = ImmutabilityHelper.merge(styles.menu, menuStyle);

    const contactsList = this.props.contactpersons.filter((c) => {
      return c.firstName.indexOf(this.state.searchText);
    });

    return this.state.open && this.state.searchText !== '' ? (
      <Menu
        {...menuProps}
        ref="menu"
        key="dropDownMenu"
        animated={animated}
        autoWidth={false}
        initiallyKeyboardFocused={false}
        onEscKeyDown={() => this.setState({open: false})}
        onItemTouchTap={this._handleItemTouchTap}
        listStyle={Styles.mergeAndPrefix(styles.list, listStyle)}
        openDirection="bottom-left"
        style={mergedMenuStyles}>
        {
          contactsList.map((c, index) =>
            <MenuItem
              innerDivStyle={{overflow: 'hidden'}}
              key={index}
              value={c.id}
              primaryText={c.firstName}
            />
        )}
        <Divider />
        <MenuItem
          key="add"
          vlaue="add"
          primaryText={'Create: ' + this.state.searchText}
        />
      </Menu>
    ) : null;
  }

  render() {
    const {
      style,
      errorStyle
    } = this.props;

    const styles = this.getStyles();
    const textFieldProps = {
      style: Styles.mergeAndPrefix(styles.input, style),
      floatingLabelText: 'Contact Person',
      hintText: 'Contact Person',
      fullWidth: true,
      multiLine: false,
      errorStyle: Styles.mergeAndPrefix(styles.error, errorStyle)
    };

    const mergedRootStyles = Styles.mergeAndPrefix(styles.root, style);

    return (
      <div style={mergedRootStyles}
        onKeyDown={this._handleKeyDown.bind(this)}>
        <div
          style={{
            width: '100%'
          }}>
          <TextField
            ref="searchTextField"
            value={this.state.searchText}
            onEnterKeyDown={() => {
              setTimeout(() => {
                this.setState({open: false});
              }, this.props.touchTapCloseDelay);
              this.props.onNewRequest(this.state.searchText);
            }}
            onChange={(e) => {
              const searchText = e.target.value;
              this._updateRequests(searchText);
            }}
            onBlur={() => {
              if (this.focusOnInput && this.state.open) {
                this.refs.searchTextField.focus();
              }
            }}
            onFocus={() => {
              if (!this.state.open && (this.props.updateWhenFocused ||
                this.state.searchText !== '')) {
                this._updateRequests(this.state.searchText);
              }
              this.focusOnInput = true;
            }}
            {...textFieldProps} />
        </div>
        <ReactTransitionGroup>{
          this.renderMenu()
        }</ReactTransitionGroup>
      </div>
    );
  }
}

reactMixin(ContactPersonSelector.prototype, ClickAwayable);
reactMixin(ContactPersonSelector.prototype, React.addons.LinkedStateMixin);

ContactPersonSelector.Item = MenuItem;
ContactPersonSelector.Divider = Divider;

const mapStateToProps = (state) => ({
  children: state.children.data,
  selectedChild: state.children.selected,
  contactpersons: state.contactpersons.data
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactPersonSelector);
