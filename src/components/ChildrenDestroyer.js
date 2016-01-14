import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';

import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';

export class ChildrenDestroyer extends React.Component {
  static propTypes = {
    selectedChild: React.PropTypes.object,
    actions: React.PropTypes.object,
    token: React.PropTypes.string,
    deleteMode: React.PropTypes.bool,
    isSaving: React.PropTypes.bool,
    saveError: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: ''
    };
  }

  onDialogCancel() {
    this.props.actions.childDeleteButtonClicked();
  }


  onDialogSubmit() {
    this.props.actions.deleteChild(this.props.token, this.props.selectedChild);
  }

  render() {
    if (!this.props.selectedChild) return null;
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.onDialogCancel.bind(this)} />,
      <FlatButton
        label={this.props.isSaving === true ? 'Deleting...' : 'Delete'}
        primary={true}
        onTouchTap={this.onDialogSubmit.bind(this)} />
    ];

    return (
      <Dialog
        title="Are you sure?"
        actions={actions}
        onRequestClose={this.onDialogCancel.bind(this)}
        open={this.props.deleteMode}>
        {
          this.props.saveError ?
          <div className="Form-message Form-message--error">
            {this.props.saveError}
          </div> : ''
        }
        You are about to delete <b>
          {this.props.selectedChild.firstName}
        </b> <b>
          {this.props.selectedChild.lastName}
        </b>.
      </Dialog>
    );
  }
}

reactMixin(ChildrenDestroyer.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  selectedChild: state.children.selected,
  token: state.auth.token,
  deleteMode: state.children.deleteMode,
  isSaving: state.children.isSaving,
  saveError: state.children.saveError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenDestroyer);
