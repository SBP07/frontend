import React from 'react/addons';
import {connect} from 'react-redux';
import reactMixin from 'react-mixin';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';
import KeyCode from '../utils/key-code';

import { Link } from 'react-router';

export class ChildrenSelector extends React.Component {
  static propTypes = {
    children: React.PropTypes.array,
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string,
    path: React.PropTypes.string,
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  componentWillMount() {
    this.fetchData();
    this.props.actions.clearSelectedChild();
  }

  componentDidMount() {
    this.clearSearch();
  }

  componentWillReceiveProps(props) {
    const {children, path, params: {id}} = props;
    if (path !== '/child' && id) {
      if (children.length === 0) return;
      this.props.actions.childSelected(
        this.props.children.filter((c) => c.id === id)[0]
      );
      this.setState({
        search: ''
      });
    } else {
      this.props.actions.clearSelectedChild();
    }
  }

  onKeyPress(child) {
    return (e) => {
      if (e.keyCode === KeyCode.ENTER) {
        this.selectChild(child);
      } else if (e.keyCode === KeyCode.DOWN) {
        this.selectNextChild('down', child);
      } else if (e.keyCode === KeyCode.UP) {
        this.selectNextChild('up', child);
      }
    };
  }

  fetchData() {
    const token = this.props.token;
    if (this.props.children.length === 0) {
      this.props.actions.fetchChildrenData(token);
    }
    /*
    if (this.props.contactpersons.length === 0) {
      this.props.actions.fetchContactPersons(token);
    }*/
  }

  selectNextChild(direction, focusedChild) {
    const children = this.makeFilteredChildren();
    const currentChild = this.props.selectedChild ?
      this.props.selectedChild : focusedChild;
    const currentChildIndex = children.indexOf(currentChild);

    if (direction === 'down' && currentChildIndex < children.length - 1) {
      const nextChild = children[currentChildIndex + 1];
      this.selectChild(nextChild);
    } else if (direction === 'up' && currentChildIndex > 0) {
      const nextChild = children[currentChildIndex - 1];
      this.selectChild(nextChild);
    }
  }

  selectChild(child) {
    if (this.props.selectedChild === child) return;
    this.setState({
      search: ''
    });
    this.props.actions.childClicked(child);
    this.refs[child.id].focus();
  }

  clearSearch() {
    this.setState({
      search: ''
    });
    this._input.focus();
  }

  makeFilteredChildren() {
    let children = this.props.children;

    if (this.state.search.length > 0) {
      const search = this.state.search.toLowerCase();
      children = this.props.children.filter((child) => {
        const name = child.firstName + ' ' + child.lastName;
        return name.toLowerCase().indexOf(search) > -1;
      });
    }

    return children.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }

  renderEmpty() {
    return (
      <div className="Children-sidebar">
        {this.renderSearch()}
        <div className="Children-list">
          <div className="Children-empty-item">No Children...</div>
        </div>
      </div>
    );
  }

  renderSearch() {
    return (
      <div className="Children-search">
        <input
          type="search"
          className="Children-search-input"
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
    const children = this.makeFilteredChildren();
    const selectedChildId = this.props.selectedChild ? this.props.selectedChild.id : null;

    return (
      <div className="Children-list">
        {children.map( (child) =>
          <Link
            key={child.id}
            ref={child.id}
            className={
              selectedChildId === child.id ?
              'Children-list-item Children-list-item--highlighted'
              : 'Children-list-item'
            }
            to={'/child/' + child.id}
            tabIndex={children.indexOf(child) + 1}
            onKeyUp={this.onKeyPress(child).bind(this)}
            >
            {child.firstName} <b>{child.lastName}</b>
            {
              selectedChildId === child.id ?
              <strong>•</strong> : ''
            }
          </Link>
        )}
      </div>
    );
  }

  render() {
    const children = this.makeFilteredChildren();
    const selectedChildId = this.props.selectedChild ? this.props.selectedChild.id : null;

    if (children.length === 0) {
      return this.renderEmpty();
    }

    return (
      <div className={selectedChildId ? 'Children-sidebar Child-selected'
        : 'Children-sidebar'}>
        {this.renderSearch()}
        {this.renderList()}
      </div>
    );
  }
}

reactMixin(ChildrenSelector.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  children: state.children.data,
  token: state.auth.token,
  selectedChild: state.children.selected,
  path: state.routing.path
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenSelector);
