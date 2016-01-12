import ReactDOM from 'react-dom';
import Events from '../utils/events';
import Dom from '../utils/dom';

export default {

  func: null,

  // When the component mounts, listen to click events and check if we need to
  // Call the componentClickAway function.
  componentDidMount() {
    if (!this.manuallyBindClickAway) this._bindClickAway();
  },

  componentWillUnmount() {
    this._unbindClickAway();
  },

  _checkClickAway(event) {
    const el = ReactDOM.findDOMNode(this);

    // Check if the target is inside the current component
    if (event.target !== el &&
        !Dom.isDescendant(el, event.target) &&
        document.documentElement.contains(event.target)) {
      if (this.componentClickAway) this.componentClickAway(event);
    }
  },

  _bindClickAway() {
    this.func = this._checkClickAway.bind(this);
    Events.on(document, 'mouseup', this.func);
    Events.on(document, 'touchend', this.func);
  },

  _unbindClickAway() {
    Events.off(document, 'mouseup', this.func);
    Events.off(document, 'touchend', this.func);
  }

};
