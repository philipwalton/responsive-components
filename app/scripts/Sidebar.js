export default class Nav {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;
  }

  freezeMinWidth() {
    this.$root.style.minWidth = `${this.$root.clientWidth}px`;
  }

  unfreezeMinWidth() {
    this.$root.style.minWidth = null;
  }

  updatePinnedDemo($newDemo) {
    const $oldDemo = this.$root.querySelector('[data-demo-root]');
    const $demoParent = $oldDemo.parentElement;

    $demoParent.insertBefore($newDemo, $oldDemo);
    $demoParent.removeChild($oldDemo);
  }
}
