import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';
import FloatingActionButton from 'material-ui/lib/floating-action-button';


export class ChildrenButtons extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object,
    selectedChild: React.PropTypes.object,
    editMode: React.PropTypes.bool,
    addMode: React.PropTypes.bool,
    deleteMode: React.PropTypes.bool
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
          onTouchTap={this.props.actions.childAddButtonClicked}
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
            display: this.props.selectedChild ? 'block' : 'none'
          }}
          onTouchTap={
            () => this.props.actions.childEditButtonClicked(this.props.selectedChild.id)
          }
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
            display: this.props.selectedChild ? 'block' : 'none'
          }}
          onTouchTap={this.props.actions.childDeleteButtonClicked}
        >
          <i className="mdi mdi-delete"></i>
        </FloatingActionButton>
      </div>
    );
  }
}

reactMixin(ChildrenButtons.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  selectedChild: state.children.selected,
  token: state.auth.token,
  editMode: state.children.editMode,
  addMode: state.children.addMode,
  deleteMode: state.children.deleteMode,
  isSaving: state.children.isSaving,
  saveError: state.children.saveError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenButtons);
