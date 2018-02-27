import delegate from 'dom-utils/lib/delegate';
import {getState, setState, stateListener} from './state.js';

export default class Nav {
  constructor($root, {app}) {
    this.$root = $root;
    this.app = app;

    // Bind callbacks.
    this.onLinkClick = this.onLinkClick.bind(this);
    this.onStateChange = this.onStateChange.bind(this);

    stateListener.on('change', this.onStateChange);
    delegate(this.$root, 'click', '.Nav-link', this.onLinkClick);
  }

  onStateChange(oldState, newState) {
    if (oldState.selectedPage === newState.selectedPage) return;

    const prevSelectedLink = this.$root.querySelector(`.Nav-link--selected`);
    if (prevSelectedLink) {
      prevSelectedLink.classList.remove('Nav-link--selected');
    }

    const nextSelectedLink =
        this.$root.querySelector(`.Nav-link[href="#${newState.selectedPage}"]`);
    if (nextSelectedLink) {
      nextSelectedLink.classList.add('Nav-link--selected');
    }
  }

  onLinkClick(evt, link) {
    evt.preventDefault();
    window.location.hash = link.hash;

    const state = getState();
    if (state.isNavInDrawerMode) {
      setState({isNavDrawerOpen: false});
    }
  }
}
