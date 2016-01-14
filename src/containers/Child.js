import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actionCreators from '../actions';

import PersonSelector from '../components/PersonSelector';
import PersonButtons from '../components/PersonButtons';
import PersonDestroyer from '../components/PersonDestroyer';
import ChildrenAdder from '../components/ChildrenAdder';
import ContactAdder from '../components/ContactAdder';

export class Child extends React.Component {
  static propTypes = {
    dataSource: React.PropTypes.array,
    selectedItem: React.PropTypes.object,
    children: React.PropTypes.node,
    params: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string,
    editMode: React.PropTypes.bool,
    addMode: React.PropTypes.bool,
    deleteMode: React.PropTypes.bool,
    isSaving: React.PropTypes.bool,
    saveError: React.PropTypes.string
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

    // select child
    if (path !== '/child' && id) {
      if (dataSource.length === 0) return; // No children yet
      if (selectedItem && selectedItem.id === id) return; // Same child
      this.props.actions.childSelected(id);
      this.props.actions.fetchContactsForChild(this.props.token, id);
    }
  }

  fetchData() {
    const {token, dataSource} = this.props;
    if (dataSource.length === 0) {
      this.props.actions.fetchChildrenData(token);
      this.props.actions.fetchContactsData(token);
    }
  }

  render() {
    const rootPath = this.props.editMode ? '/child/edit/' : '/child/';
    return (
      <div className="Person">
        <PersonSelector
          rootPath={rootPath}
          onSelected={
            (item) => this.props.actions.childClicked(item.id, rootPath)
          }
          dataSource={this.props.dataSource}
          selectedItem={this.props.selectedItem} />
        {this.props.children}
        <PersonButtons
          selectedItem={this.props.selectedItem}
          editMode={this.props.editMode}
          addMode={this.props.addMode}
          deleteMode={this.props.deleteMode}
          onAddClick={this.props.actions.childAddButtonClicked}
          onEditClick={
            () => this.props.actions.childEditButtonClicked(this.props.selectedItem.id)
          }
          onDeleteClick={this.props.actions.childDeleteButtonClicked}
          />
        <PersonDestroyer
          selectedItem={this.props.selectedItem}
          deleteMode={this.props.deleteMode}
          isSaving={this.props.isSaving}
          saveError={this.props.saveError}
          onCancel={this.props.actions.childDeleteButtonClicked}
          onSubmit={
            () => this.props.actions.deleteChild(this.props.token, this.props.selectedItem)
          }
          />
        <ChildrenAdder />
        <ContactAdder />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataSource: state.children.data,
  selectedItem: state.children.selected,
  token: state.auth.token,
  path: state.routing.path,
  editMode: state.children.editMode,
  addMode: state.children.addMode,
  deleteMode: state.children.deleteMode,
  isSaving: state.children.isSaving,
  saveError: state.children.saveError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Child);
