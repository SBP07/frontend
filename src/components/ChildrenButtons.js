import React from 'react/addons';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import actionCreators from '../actions';
import FloatingActionButton from 'material-ui/lib/floating-action-button';


export class ChildrenButtons extends React.Component {
  static propTypes = {
    actions: React.PropTypes.object,
    selectedChild: React.PropTypes.object
  }

  render() {
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
          onTouchTap={
            () => this.props.actions.childEditButtonClicked(this.props.selectedChild)
          }
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
}

reactMixin(ChildrenButtons.prototype, React.addons.LinkedStateMixin);

const mapStateToProps = (state) => ({
  selectedChild: state.children.selected,
  token: state.auth.token,
  isSaving: state.children.isSaving,
  saveError: state.children.saveError
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ChildrenButtons);
