import React from 'react/addons';
import ReactDOM from 'react-dom';
import reactMixin from 'react-mixin';
import KeyCode from '../utils/key-code';

import { Link } from 'react-router';

export default class PersonSelector extends React.Component {
  static propTypes = {
    /**
     * Array of Person
     */
    dataSource: React.PropTypes.array,
    /**
     * @type Person
     * @prop id {String}
     * @prop firstName {String}
     * @prop lastName {String}
     */
    selectedItem: React.PropTypes.object,
    /**
     * Event on item selected with keyboard
     */
    onSelected: React.PropTypes.func,
    /**
     * The root path for links
     */
    rootPath: React.PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  componentDidMount() {
    this.clearSearch();
  }

  onKeyPress(item) {
    return (e) => {
      if (e.keyCode === KeyCode.ENTER) {
        this.selectItem(item);
      } else if (e.keyCode === KeyCode.DOWN) {
        this.selectNextItem('down', item);
      } else if (e.keyCode === KeyCode.UP) {
        this.selectNextItem('up', item);
      }
    };
  }

  selectNextItem(direction, focusedItem) {
    const filteredList = this.makeFilteredList();
    const currentItem = this.props.selectedItem ?
      this.props.selectedItem : focusedItem;
    const currentIndex = filteredList.indexOf(currentItem);

    if (direction === 'down' && currentIndex < filteredList.length - 1) {
      const nextItem = filteredList[currentIndex + 1];
      this.selectItem(nextItem);
    } else if (direction === 'up' && currentIndex > 0) {
      const nextItem = filteredList[currentIndex - 1];
      this.selectItem(nextItem);
    }
  }

  selectItem(item) {
    if (this.props.selectedItem === item) return;
    this.setState({
      search: ''
    });
    this.props.onSelected(item);
    ReactDOM.findDOMNode(this.refs[item.id]).focus();
  }

  clearSearch() {
    this.setState({
      search: ''
    });
    this._input.focus();
  }

  makeFilteredList() {
    let list = this.props.dataSource;

    if (this.state.search.length > 0) {
      const search = this.state.search.toLowerCase();
      list = this.props.dataSource.filter((item) => {
        const name = item.firstName + ' ' + item.lastName;
        return name.toLowerCase().indexOf(search) > -1;
      });
    }

    return list.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  renderEmpty() {
    return (
      <div className="Selector-sidebar">
        {this.renderSearch()}
        <div className="Selector-list">
          <div className="Selector-empty-item">Empty...</div>
        </div>
      </div>
    );
  }

  renderSearch() {
    return (
      <div className="Selector-search">
        <input
          type="search"
          className="Selector-search-input"
          valueLink={this.linkState('search')}
          ref={(c) => this._input = c}
          />
        {
          this.state.search.length === 0 ?
          <i className="mdi mdi-magnify"></i>
          : <i onClick={this.clearSearch.bind(this)} className="mdi mdi-close"></i>
        }
      </div>
    );
  }

  renderList() {
    const list = this.makeFilteredList();
    const selectedItemId = this.props.selectedItem ? this.props.selectedItem.id : null;

    return (
      <div className="Selector-list">
        {list.map( (item) =>
          <Link
            key={item.id}
            ref={item.id}
            className={
              selectedItemId === item.id ?
              'Selector-list-item Selector-list-item--highlighted'
              : 'Selector-list-item'
            }
            to={this.props.rootPath + item.id}
            tabIndex={list.indexOf(item) + 1}
            onKeyUp={this.onKeyPress(item).bind(this)}
            >
            {item.firstName} <b>{item.lastName}</b>
            {
              selectedItemId === item.id ?
              <strong>•</strong> : ''
            }
          </Link>
        )}
      </div>
    );
  }

  render() {
    const list = this.makeFilteredList();
    const selectedItemId = this.props.selectedItem ? this.props.selectedItem.id : null;

    if (list.length === 0) {
      return this.renderEmpty();
    }

    return (
      <div className={selectedItemId ? 'Selector Selector-sidebar Selector-selected'
        : 'Selector Selector-sidebar'}>
        {this.renderSearch()}
        {this.renderList()}
      </div>
    );
  }
}

reactMixin(PersonSelector.prototype, React.addons.LinkedStateMixin);
