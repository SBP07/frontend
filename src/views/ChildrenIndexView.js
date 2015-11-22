import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions';
import 'styles/children.scss';
import {LoadingIcon} from '../components/LoadingIcon';

export class ChildrenIndexView extends React.Component {
  static propTypes = {
    isFetching: React.PropTypes.bool,
    data: React.PropTypes.object,
    token: React.PropTypes.string,
    actions: React.PropTypes.object
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    const token = this.props.token;
    this.props.actions.fetchProtectedData(token);
  }

  renderChild(child) {
    return (
      <tr>
        <td>{child.firstName}</td>
        <td>{child.lastName}</td>
        <td>{child.birthDate}</td>
        <td>{child.address.city}</td>
      </tr>
    );
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
    if (this.props.data.length === 0) {
      return this.renderLoading();
    }
    const childrenViews = this.props.data.map(this.renderChild);
    return (
      <div>
        <table className="ChildrenTable ChildrenTable--celled">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birthdate</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {childrenViews}
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.data.data,
  isFetching: state.data.isFetching,
  token: state.auth.token
});

const mapDispatchToProps = (dispatch) => ({
  actions : bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenIndexView);
