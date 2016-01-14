import React from 'react/addons';
import FloatingActionButton from 'material-ui/lib/floating-action-button';

export default class PersonButtons extends React.Component {
  static propTypes = {
    selectedItem: React.PropTypes.object,
    editMode: React.PropTypes.bool,
    addMode: React.PropTypes.bool,
    deleteMode: React.PropTypes.bool,
    onEditClick: React.PropTypes.func,
    onDeleteClick: React.PropTypes.func,
    onAddClick: React.PropTypes.func
  }

  render() {
    return (
      <div>
        <FloatingActionButton
          backgroundColor={this.props.addMode ? '#039BE5' : '#212121'}
          style={{
            position: 'absolute',
            right: 30,
            bottom: 20,
            fontSize: 24
          }}
          onTouchTap={this.props.onAddClick}
        >
          <i className="mdi mdi-plus"></i>
        </FloatingActionButton>

        <FloatingActionButton
          backgroundColor={this.props.editMode ? '#039BE5' : '#212121'}
          style={{
            position: 'absolute',
            right: 100,
            bottom: 20,
            fontSize: 24,
            display: this.props.selectedItem ? 'block' : 'none'
          }}
          onTouchTap={this.props.onEditClick}
        >
          <i className="mdi mdi-pencil"></i>
        </FloatingActionButton>

        <FloatingActionButton
          backgroundColor={this.props.deleteMode ? '#039BE5' : '#212121'}
          style={{
            position: 'absolute',
            right: 170,
            bottom: 20,
            fontSize: 24,
            display: this.props.selectedItem ? 'block' : 'none'
          }}
          onTouchTap={this.props.onDeleteClick}
        >
          <i className="mdi mdi-delete"></i>
        </FloatingActionButton>
      </div>
    );
  }
}
