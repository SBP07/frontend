import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import {LoadingIcon} from '../components/LoadingIcon';
import ChildrenSelector from '../components/ChildrenSelector';
import ChildrenDetails from '../components/ChildrenDetails';

import 'styles/children.scss';

export class ChildrenIndexView extends React.Component {
  static propTypes = {
    isFetching: React.PropTypes.bool,
    children: React.PropTypes.array,
    token: React.PropTypes.string,
    actions: React.PropTypes.object
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

  renderLoading() {
    return (
      <div className="text--center">
        <LoadingIcon />
      </div>
    );
  }

  render() {
    if (this.props.isFetching === true) {
      return this.renderLoading();
    }
    return (
      <div className="Children">
        <ChildrenSelector />
        <ChildrenDetails />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  children: state.children.data,
  isFetching: state.children.isFetching,
  token: state.auth.token
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenIndexView);
