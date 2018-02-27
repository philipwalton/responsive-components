import {SECTIONS} from './constants.js';
import Content from './Content.js';
import Nav from './Nav.js';
import Sidebar from './Sidebar.js';
import {getState, setState, stateListener} from './state.js';
import {transition} from './transition';

const CONTENT_MIN_WIDTH = 256; /* 16em */
const SIDEBAR_MIN_WIDTH = 257; /* 16em + 1px (border) */

const NAV_OPEN_TIMEOUT = 600;
const SIDEBAR_TRANSITION_TIME = 300;

export default class App {
  constructor($root) {
    this.$root = $root;
    this.$main = document.querySelector('.App-main');
    this.$modalOverlay = document.querySelector('.App-modalOverlay');
    this.$nav = document.querySelector('.App-nav');
    this.$navShow = document.querySelector('.App-navShow');
    this.$navHide = document.querySelector('.App-navHide');
    this.$sidebar = document.querySelector('.App-sidebar');
    this.$sidebarShow = document.querySelector('.App-sidebarShow');
    this.$sidebarHide = document.querySelector('.App-sidebarHide');
    this.$sidebarGutter = document.querySelector('.App-sidebarGutter');

    // Bind callbacks
    this.onStateChange = this.onStateChange.bind(this);
    this.onHashChange = this.onHashChange.bind(this);
    this.onSidebarHide = this.onSidebarHide.bind(this);
    this.onSidebarShow = this.onSidebarShow.bind(this);
    this.hideNav = this.hideNav.bind(this);
    this.showNav = this.showNav.bind(this);
    this.hideSidebar = this.hideSidebar.bind(this);
    this.showSidebar = this.showSidebar.bind(this);
    this.onSidebarStartDrag = this.onSidebarStartDrag.bind(this);
    this.onSidebarStopDrag = this.onSidebarStopDrag.bind(this);
    this.onSidebarDrag = this.onSidebarDrag.bind(this);

    // Initialize sub-components
    this.content = new Content(document.querySelector('.Content'), {app: this});
    this.nav = new Nav(document.querySelector('.Nav'), {app: this});
    this.sidebar = new Sidebar(document.querySelector('.Sidebar'), {app: this});

    // Initialize controls
    this.initNav();
    this.initSidebar();

    window.addEventListener('hashchange', this.onHashChange);
    stateListener.on('change', this.onStateChange);
  }

  initNav() {
    this.$navHide.addEventListener('touchend', this.hideNav);
    this.$navHide.addEventListener('click', this.hideNav);
    this.$modalOverlay.addEventListener('touchend', this.hideNav);
    this.$modalOverlay.addEventListener('click', this.hideNav);

    this.$navShow.addEventListener('touchend', this.showNav);
    this.$navShow.addEventListener('click', this.showNav);
  }

  initSidebar() {
    this.$sidebarShow.addEventListener('touchend', this.onSidebarShow);
    this.$sidebarShow.addEventListener('click', this.onSidebarShow);
    this.$sidebarHide.addEventListener('touchend', this.onSidebarHide);
    this.$sidebarHide.addEventListener('click', this.onSidebarHide);

    this.$sidebarGutter.addEventListener(
        'touchstart', this.onSidebarStartDrag, {passive: true});
    this.$sidebarGutter.addEventListener(
        'mousedown', this.onSidebarStartDrag);
  }

  getSidebarWidth() {
    return this.$sidebar.clientWidth;
  }

  async onStateChange(oldState, state, changedProps) {
    if (changedProps.has('isNavDrawerOpen')) {
      if (state.isNavDrawerOpen) {
        this.openNavDrawer({useTransitions: state.isNavTransitioning});
      } else {
        this.closeNavDrawer({useTransitions: state.isNavTransitioning});
      }
    }

    if (changedProps.has('isNavSidebarCollapsed')) {
      if (state.isNavSidebarCollapsed) {
        this.collapseNav({useTransitions: state.isNavTransitioning});
      } else {
        this.expandNav({useTransitions: state.isNavTransitioning});
      }
    }

    if (changedProps.has('isSidebarHidden')) {
      if (state.isSidebarHidden) {
        this.hideSidebar({useTransitions: state.isSidebarTransitioning});
      } else {
        this.showSidebar({useTransitions: state.isSidebarTransitioning});
      }
    }

    if (changedProps.has('sidebarWidth')) {
      // Only set the sidebar width if the sidebar can be visible.
      if (!state.isNavInDrawerMode) {
        this.$sidebar.style.width = `${state.sidebarWidth}px`;
      }
    }
  }

  showNav(evt) {
    evt.preventDefault();

    const state = getState();
    if (state.isNavInDrawerMode) {
      setState({isNavDrawerOpen: true, isNavTransitioning: true});
    } else {
      setState({isNavSidebarCollapsed: false, isNavTransitioning: true});
    }
  }

  hideNav(evt) {
    evt.preventDefault();

    const state = getState();
    if (state.isNavInDrawerMode) {
      setState({isNavDrawerOpen: false, isNavTransitioning: true});
    } else {
      setState({isNavSidebarCollapsed: true, isNavTransitioning: true});
    }
  }

  async openNavDrawer({useTransitions}) {
    await transition(this.$root, NAV_OPEN_TIMEOUT, {
      to: 'App--isNavDrawerOpen',
      using: 'App--isNavTransitioning',
    });
    // TODO(philipwalton): in addition to adding focus here,
    // consider traping focus in the nav unless the ESC key is pressed
    this.$nav.focus({preventScroll: true});
    if (useTransitions) {
      setState({isNavTransitioning: false});
    }
  }

  async closeNavDrawer({useTransitions}) {
    await transition(this.$root, NAV_OPEN_TIMEOUT, {
      from: 'App--isNavDrawerOpen',
      using: 'App--isNavTransitioning',
    });
    this.$navShow.focus({preventScroll: true});
    if (useTransitions) {
      setState({isNavTransitioning: false});
    }
  }

  async expandNav({useTransitions}) {
    await transition(this.$root, NAV_OPEN_TIMEOUT, {
      from: 'App--isNavSidebarCollapsed',
      using: 'App--isNavTransitioning',
    });
    this.$nav.focus({preventScroll: true});
    if (useTransitions) {
      setState({isNavTransitioning: false});
    }
  }

  async collapseNav({useTransitions}) {
    await transition(this.$root, NAV_OPEN_TIMEOUT, {
      to: 'App--isNavSidebarCollapsed',
      using: 'App--isNavTransitioning',
    });
    this.$navShow.focus({preventScroll: true});
    if (useTransitions) {
      setState({isNavTransitioning: false});
    }
  }

  async hideSidebar({useTransitions}) {
    await transition(this.$root, SIDEBAR_TRANSITION_TIME, {
      to: 'App--isSidebarHidden',
      using: 'App--isSidebarTransitioning',
      useTransitions,
    });
    this.$sidebarShow.focus({preventScroll: true});
    if (useTransitions) {
      setState({isSidebarTransitioning: false});
    }
  }

  async showSidebar({useTransitions}) {
    await transition(this.$root, SIDEBAR_TRANSITION_TIME, {
      from: 'App--isSidebarHidden',
      using: 'App--isSidebarTransitioning',
      useTransitions,
    });

    // Not all browsers support `preventScroll`, so we set scroll just in case.
    this.$sidebar.focus({preventScroll: true});
    window.scrollTo(0, 0);
    if (useTransitions) {
      setState({isSidebarTransitioning: false});
    }
  }

  onHashChange() {
    const sectionId = location.hash.slice(1);
    if (SECTIONS.has(sectionId)) {
      setState({selectedPage: sectionId});
    }
  }

  onSidebarHide(evt) {
    evt.preventDefault();
    setState({isSidebarHidden: true, isSidebarTransitioning: true});
  }

  onSidebarShow(evt) {
    evt.preventDefault();
    setState({isSidebarHidden: false, isSidebarTransitioning: true});
  }

  onSidebarStartDrag(evt) {
    evt.preventDefault();

    // Cache these values at the start of a drag,
    // so constant DOM measurements/lookups aren't required.
    this._screenWidth = this.$root.clientWidth;
    this._navWidth = this.$nav.clientWidth;

    document.addEventListener('touchmove', this.onSidebarDrag);
    document.addEventListener('mousemove', this.onSidebarDrag);
    document.addEventListener('touchend', this.onSidebarStopDrag);
    document.addEventListener('mouseup', this.onSidebarStopDrag);

    setState({isSidebarDragging: true});
  }

  onSidebarStopDrag(evt) {
    evt.preventDefault();

    document.removeEventListener('touchmove', this.onSidebarDrag);
    document.removeEventListener('mousemove', this.onSidebarDrag);
    document.removeEventListener('touchend', this.onSidebarStopDrag);
    document.removeEventListener('mouseup', this.onSidebarStopDrag);

    setState({isSidebarDragging: false});
  }

  onSidebarDrag(evt) {
    evt.preventDefault();

    // Use the touch target's pageX value if it's a touch event.
    const pageX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.pageX;

    // Ensure the sidebar width is greater than --App-sidebarMinWidth
    // but not so big that it would force the content area to be smaller
    // than --App-contentMinWidth.
    const contentWidthCandidate = Math.max(CONTENT_MIN_WIDTH,
        pageX - this._navWidth);

    const sidebarWidth = Math.max(SIDEBAR_MIN_WIDTH,
        this._screenWidth - (this._navWidth + contentWidthCandidate));

    setState({sidebarWidth});
  }
}
