import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/index.js';
import ChildrenSelector from '../components/ChildrenSelector';
import ChildrenDetails from '../components/ChildrenDetails';
import ChildrenEditor from '../components/ChildrenEditor';
import ChildrenAdder from '../components/ChildrenAdder';

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
        <FloatingActionButton
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
          style={{
            position: 'absolute',
            right: 100,
            bottom: 20,
            fontSize: 24,
            display: this.props.selectedChild ? 'block' : 'none'
          }}
          onTouchTap={this.props.actions.childAddButtonClicked}
        >
          <i className="mdi mdi-pencil"></i>
        </FloatingActionButton>
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
