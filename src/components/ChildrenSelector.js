import React from 'react/addons';
import {connect} from 'react-redux';
import reactMixin from 'react-mixin';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';

export class ChildrenSelector extends React.Component {
  static propTypes = {
    children: React.PropTypes.array,
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object
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

  onClickChild(child) {
    return () => this.selectChild(child);
  }

  onKeyPress(child) {
    return (e) => {
      if (e.key === 'Enter') {
        this.selectChild(child);
      } else if (e.key === 'ArrowDown') {
        this.selectNextChild('down', child);
      } else if (e.key === 'ArrowUp') {
        this.selectNextChild('up', child);
      }
    };
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
    this.setState({
      search: ''
    });
    this.props.actions.childSelected(child);
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

  render() {
    const children = this.makeFilteredChildren();
    const selectedChildId = this.props.selectedChild ? this.props.selectedChild.id : null;

    return (
      <div className="Children-sidebar">
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
        <div className="Children-list">
          {children.map( (child) =>
            <div
              key={child.id}
              ref={child.id}
              className={
                selectedChildId === child.id ?
                'Children-list-item Children-list-item--highlighted'
                : 'Children-list-item'
              }
              tabIndex={children.indexOf(child) + 1}
              onClick={this.onClickChild(child).bind(this)}
              onKeyUp={this.onKeyPress(child).bind(this)}
              >
              {child.firstName} <b>{child.lastName}</b>
              {
                selectedChildId === child.id ?
                <strong>•</strong> : ''
              }
            </div>
          )}
        </div>
      </div>
    );
  }
}

reactMixin(ChildrenSelector.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  children: state.children.data,
  selectedChild: state.children.selected
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenSelector);
