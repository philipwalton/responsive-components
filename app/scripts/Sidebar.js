import {stateListener} from './state.js';

export default class Nav {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks
    this.onStateChange = this.onStateChange.bind(this);

    stateListener.on('change', this.onStateChange);
  }

  onStateChange(oldState, newState) {
    if (oldState.pinnedDemo === newState.pinnedDemo) return;

    const $oldDemo = this.$root.querySelector('[data-demo-root]');
    const $newDemo = this.app.content.cloneSelectedDemo(newState.pinnedDemo);
    const $demoParent = $oldDemo.parentElement;

    $demoParent.insertBefore($newDemo, $oldDemo);
    $demoParent.removeChild($oldDemo);
  }

  freezeMinWidth() {
    this.$root.style.minWidth = `${this.$root.clientWidth}px`;
  }

  unfreezeMinWidth() {
    this.$root.style.minWidth = null;
  }
}
