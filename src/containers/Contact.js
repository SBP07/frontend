import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import actionCreators from '../actions';

import PersonSelector from '../components/PersonSelector';
import ChildrenButtons from '../components/ChildrenButtons';
import ContactAdder from '../components/ContactAdder';
import ChildrenDestroyer from '../components/ChildrenDestroyer';

export default class Contact extends React.Component {
  static propTypes = {
    dataSource: React.PropTypes.array,
    selectedItem: React.PropTypes.object,
    children: React.PropTypes.node,
    params: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string
  }

  componentWillMount() {
    this.fetchData();
  }

  componentWillReceiveProps(newProps) {
    const {dataSource, path, params: {id}, selectedItem} = newProps;
    if (path !== '/contact' && id) {
      if (dataSource.length === 0) return;
      this.props.actions.contactSelected(
        this.props.dataSource.filter((c) => c.id === id)[0]
      );
      this.setState({
        search: ''
      });
    } else {
      if (selectedItem === null) return;
      this.props.actions.clearSelectedContact();
    }
  }

  fetchData() {
    const {token, dataSource} = this.props;
    if (dataSource.length === 0) {
      this.props.actions.fetchContactsData(token);
    }
  }

  render() {
    return (
      <div className="Contacts">
        <PersonSelector
          rootPath="/contact/"
          onSelected={
            (item) => this.props.actions.contactClicked(item)
          }
          dataSource={this.props.dataSource}
          selectedItem={this.props.selectedItem}
          params={this.props.params} />
        {this.props.children}
        <ChildrenButtons params={this.props.params} />
        <ContactAdder />
        <ChildrenDestroyer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  dataSource: state.contacts.data,
  selectedItem: state.contacts.selected,
  token: state.auth.token,
  path: state.routing.path
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Contact);
