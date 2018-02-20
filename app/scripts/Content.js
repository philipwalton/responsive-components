import delegate from 'dom-utils/lib/delegate';
import {SECTIONS} from './sections.js';

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
    // No-op if the section is already being shown.
    if (this.visibleSection === id) return;

    if (!SECTIONS.includes(id)) {
      location.hash = 'overview';
      return;
    }

    const shownSections = this.$root.querySelectorAll(
        `.Section--isSelected:not([data-section="${id}"])`)

    for (var $section of shownSections) {
      $section.classList.remove('Section--isSelected')
    }

    this.$root.querySelector(`[data-section="${id}"]`).classList
        .add('Section--isSelected');

    this.visibleSection = id;
    window.scrollTo(0, 0);
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
