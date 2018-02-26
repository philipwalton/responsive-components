import {stateListener} from './state.js';

export default class Sidebar {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks
    this.onStateChange = this.onStateChange.bind(this);

    stateListener.on('change', this.onStateChange);
  }

  onStateChange(oldState, state, changedProps) {
    if (changedProps.has('pinnedDemo')) {
      const $oldDemo = this.$root.querySelector('[data-demo-root]');
      const $newDemo = this.app.content.cloneSelectedDemo(state.pinnedDemo);
      const $demoParent = $oldDemo.parentElement;

      $demoParent.insertBefore($newDemo, $oldDemo);
      $demoParent.removeChild($oldDemo);
    }

    if (changedProps.has('isSidebarTransitioning')) {
      if (state.isSidebarTransitioning) {
        this.$root.style.minWidth = `${state.sidebarWidth - 1}px`;
      } else {
        this.$root.style.minWidth = null;
      }
    }
  }
}
