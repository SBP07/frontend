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
    return () => {
      this.clearSearch();
      this.props.actions.childSelected(child);
    };
  }

  clearSearch() {
    this.setState({
      search: ''
    });
    this._input.focus();
  }

  render() {
    let children = this.props.children;

    if (this.state.search.length > 0) {
      const search = this.state.search.toLowerCase();
      children = this.props.children.filter((child) => {
        const name = child.firstName + ' ' + child.lastName;
        return name.toLowerCase().indexOf(search) > -1;
      });
    }

    children = children.sort((a, b) => a.lastName.localeCompare(b.lastName));

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
              className={
                selectedChildId === child.id ?
                'Children-list-item Children-list-item--highlighted'
                : 'Children-list-item'
              }
              onClick={this.onClickChild(child).bind(this)}
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
