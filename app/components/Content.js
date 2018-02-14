import delegate from 'dom-utils/lib/delegate';

export default class Content {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks
    this.onPinDemoButtonClick = this.onPinDemoButtonClick.bind(this);

    this.showSection(location.hash.slice(1) || 'overview');
    delegate(this.$root, 'click', '[data-pin-action]',
        this.onPinDemoButtonClick);
  }

  showSection(id) {
    this.visibleSection = id;
    this.$root.dataset.visibleSection = id;
  }

  cloneVisibleDemo() {
    const $visibleSection = document.getElementById(this.visibleSection);
    const $demo = $visibleSection.querySelector('[data-demo-root]');
    return $demo.cloneNode(true);
  }

  onPinDemoButtonClick(evt) {
    evt.preventDefault();
    this.app.sidebar.updatePinnedDemo(this.cloneVisibleDemo());
  }
}
