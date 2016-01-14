import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actionCreators from '../actions';

import PersonSelector from '../components/PersonSelector';
import PersonButtons from '../components/PersonButtons';
import PersonDestroyer from '../components/PersonDestroyer';
import ContactAdder from '../components/ContactAdder';

export default class Contact extends React.Component {
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
      const rootPath = editMode ? '/contact/edit/' : '/contact/';
      this.props.actions.contactClicked(id, rootPath);
      return; // function will recurse
    }

    if (path.indexOf('/contact/edit/') > -1 && editMode === false) {
      this.props.actions.contactEditMode(true);
      return;
    }

    // Index
    if (path === '/contact') {
      if (selectedItem === null) return;
      this.props.actions.clearSelectedContact();
    }

    // Details, select item
    if (path !== '/contact' && id) {
      if (dataSource.length === 0) return;
      if (selectedItem && selectedItem.id === id) return; // Same item
      this.props.actions.contactSelected(id);
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
    const rootPath = this.props.editMode ? '/contact/edit/' : '/contact/';
    return (
      <div className="Person">
        <PersonSelector
          rootPath={rootPath}
          onSelected={
            (item) => this.props.actions.contactClicked(item.id, rootPath)
          }
          dataSource={this.props.dataSource}
          selectedItem={this.props.selectedItem} />
        {this.props.children}
        <PersonButtons
          selectedItem={this.props.selectedItem}
          editMode={this.props.editMode}
          addMode={this.props.addMode}
          deleteMode={this.props.deleteMode}
          onAddClick={this.props.actions.contactAddButtonClicked}
          onEditClick={
            () => this.props.actions.contactEditButtonClicked(this.props.selectedItem.id)
          }
          onDeleteClick={this.props.actions.contactDeleteButtonClicked}
          />
        <PersonDestroyer
          selectedItem={this.props.selectedItem}
          deleteMode={this.props.deleteMode}
          isSaving={this.props.isSaving}
          saveError={this.props.saveError}
          onCancel={this.props.actions.contactDeleteButtonClicked}
          onSubmit={
            () => this.props.actions.deleteContact(this.props.token, this.props.selectedItem)
          }
          />
        <ContactAdder />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataSource: state.contacts.data,
  selectedItem: state.contacts.selected,
  token: state.auth.token,
  path: state.routing.path,
  editMode: state.contacts.editMode,
  addMode: state.contacts.addMode,
  deleteMode: state.contacts.deleteMode,
  isSaving: state.contacts.isSaving,
  saveError: state.contacts.saveError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
