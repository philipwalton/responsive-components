import delegate from 'dom-utils/lib/delegate';

const SECTIONS = [
  'overview',
  'calendar',
  'card',
  'form',
  'gallery',
  'nested-components',
  'custom-breakpoints',
];

export default class Nav {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks.
    this.onHashChange = this.onHashChange.bind(this);
    this.onLinkClick = this.onLinkClick.bind(this);

    window.addEventListener('hashchange', this.onHashChange);
    delegate(this.$root, 'click', '.Nav-link', this.onLinkClick);

    // Set the initial state per the current hash.
    this.onHashChange();
  }

  updateSelected(id) {
    const prevSelectedLink = this.$root.querySelector(`.Nav-link--selected`);
    if (prevSelectedLink) {
      prevSelectedLink.classList.remove('Nav-link--selected');
    }

    const nextSelectedLink =
        this.$root.querySelector(`.Nav-link[href="#${id}"]`);
    if (nextSelectedLink) {
      nextSelectedLink.classList.add('Nav-link--selected');
    }

    this.app.content.showSection(id);
  }

  onHashChange() {
    const id = location.hash.slice(1);

    if (!id) {
      this.updateSelected('overview');
    } else if (SECTIONS.includes(id)) {
      this.updateSelected(id);
    }
  }

  onLinkClick(evt, link) {
    evt.preventDefault();
    window.location.hash = link.hash;
  }
}
