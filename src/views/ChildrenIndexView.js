import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index.js';
import ChildrenSelector from '../components/ChildrenSelector';
import ChildrenDetails from '../components/ChildrenDetails';
import ChildrenEditor from '../components/ChildrenEditor';
import ChildrenAdder from '../components/ChildrenAdder';
import ChildrenDestroyer from '../components/ChildrenDestroyer';

import FloatingActionButton from 'material-ui/lib/floating-action-button';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';

import 'styles/children.scss';

export class ChildrenIndexView extends React.Component {
  static propTypes = {
    isFetching: React.PropTypes.bool,
    selectedChild: React.PropTypes.object,
    children: React.PropTypes.array,
    token: React.PropTypes.string,
    actions: React.PropTypes.object,
    editMode: React.PropTypes.bool,
    addMode: React.PropTypes.bool
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    if (this.props.children.length === 0) {
      const token = this.props.token;
      this.props.actions.fetchChildrenData(token);
    }
  }

  renderActions() {
    return (
      <div>
        <FloatingActionButton
          backgroundColor="#212121"
          style={{
            position: 'absolute',
            right: 30,
            bottom: 20,
            fontSize: 24
          }}
          onTouchTap={this.props.actions.childAddButtonClicked}
        >
          <i className="mdi mdi-plus"></i>
        </FloatingActionButton>

        <FloatingActionButton
          backgroundColor="#039BE5"
          style={{
            position: 'absolute',
            right: 100,
            bottom: 20,
            fontSize: 24,
            display: this.props.selectedChild ? 'block' : 'none'
          }}
          onTouchTap={this.props.actions.childEditButtonClicked}
        >
          <i className="mdi mdi-pencil"></i>
        </FloatingActionButton>

        <FloatingActionButton
          backgroundColor="#DD2C00"
          style={{
            position: 'absolute',
            right: 170,
            bottom: 20,
            fontSize: 24,
            display: this.props.selectedChild ? 'block' : 'none'
          }}
          onTouchTap={this.props.actions.childDeleteButtonClicked}
        >
          <i className="mdi mdi-delete"></i>
        </FloatingActionButton>
      </div>
    );
  }

  render() {
    return (
      <div className="Children">
        <RefreshIndicator
          style={{margin: 'auto', left: 0, right: 0, top: 50}}
          size={40}
          status={
            this.props.isFetching ? 'loading' : 'hide'
          } />
        <ChildrenSelector />
        {
          this.props.editMode === true ?
          <ChildrenEditor />
          : <ChildrenDetails />
        }

        <ChildrenAdder />
        {
          this.props.selectedChild ?
          <ChildrenDestroyer /> : ''
        }
        {this.renderActions()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  children: state.children.data,
  isFetching: state.children.isFetching,
  token: state.auth.token,
  editMode: state.children.editMode,
  addMode: state.children.addMode,
  selectedChild: state.children.selected
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenIndexView);
