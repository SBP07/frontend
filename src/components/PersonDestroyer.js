import React from 'react/addons';

import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';

export default class PersonDestroyer extends React.Component {
  static propTypes = {
    selectedItem: React.PropTypes.object,
    deleteMode: React.PropTypes.bool,
    isSaving: React.PropTypes.bool,
    saveError: React.PropTypes.string,
    onCancel: React.PropTypes.func,
    onSubmit: React.PropTypes.func
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

  render() {
    if (!this.props.selectedItem) return null;
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.props.onCancel} />,
      <FlatButton
        label={this.props.isSaving === true ? 'Deleting...' : 'Delete'}
        primary={true}
        onTouchTap={this.props.onSubmit} />
    ];

    return (
      <Dialog
        title="Are you sure?"
        actions={actions}
        onRequestClose={this.props.onCancel}
        open={this.props.deleteMode}>
        {
          this.props.saveError ?
          <div className="Form-message Form-message--error">
            {this.props.saveError}
          </div> : ''
        }
        You are about to delete <b>
          {this.props.selectedItem.firstName}
        </b> <b>
          {this.props.selectedItem.lastName}
        </b>.
      </Dialog>
    );
  }
}
