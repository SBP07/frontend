import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actionCreators from '../actions';

import PersonSelector from '../components/PersonSelector';
import ChildrenButtons from '../components/ChildrenButtons';
import ChildrenAdder from '../components/ChildrenAdder';
import ChildrenDestroyer from '../components/ChildrenDestroyer';

export class Child extends React.Component {
  static propTypes = {
    dataSource: React.PropTypes.array,
    selectedItem: React.PropTypes.object,
    children: React.PropTypes.node,
    params: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string,
    editMode: React.PropTypes.bool
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(newProps) {
    const {dataSource, path, params: {id}, selectedItem, editMode} = newProps;

    // Edit mode changed, change path
    if (editMode !== this.props.editMode) {
      const rootPath = editMode ? '/child/edit/' : '/child/';
      this.props.actions.childClicked(id, rootPath);
      return; // function will recurse
    }

    if (path.indexOf('/child/edit/') > -1 && editMode === false) {
      this.props.actions.childEditMode(true);
      return;
    }

    // Index
    if (path === '/child') {
      if (selectedItem === null) return;
      this.props.actions.clearSelectedChild();
    }

    // Details, select child
    if (path !== '/child' && id) {
      if (dataSource.length === 0) return; // No children yet
      if (selectedItem && selectedItem.id === id) return; // Same child
      this.props.actions.childSelected(id);
    }
  }

  fetchData() {
    const {token, dataSource} = this.props;
    if (dataSource.length === 0) {
      this.props.actions.fetchChildrenData(token);
    }
  }

  render() {
    const rootPath = this.props.editMode ? '/child/edit/' : '/child/';
    return (
      <div className="Children">
        <PersonSelector
          rootPath={rootPath}
          onSelected={
            (item) => this.props.actions.childClicked(item.id, rootPath)
          }
          dataSource={this.props.dataSource}
          selectedItem={this.props.selectedItem}
          params={this.props.params} />
        {this.props.children}
        <ChildrenButtons params={this.props.params} />
        <ChildrenAdder />
        <ChildrenDestroyer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataSource: state.children.data,
  selectedItem: state.children.selected,
  token: state.auth.token,
  path: state.routing.path,
  editMode: state.children.editMode
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Child);
