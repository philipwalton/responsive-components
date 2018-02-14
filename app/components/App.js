import Content from './Content.js';
import Nav from './Nav.js';
import Sidebar from './Sidebar.js';
import {transition} from '../transition';

const CONTENT_MIN_WIDTH = 256; /* 16em */
const SIDEBAR_MIN_WIDTH = 256; /* 16em */

const NAV_OPEN_TIMEOUT = 300;
const SIDEBAR_TRANSITION_TIME = 300;

export default class App {
  constructor($root) {
    this.$root = $root;
    this.$main = document.querySelector('.App-main');
    this.$nav = document.querySelector('.App-nav');
    this.$navShow = document.querySelector('.App-navShow');
    this.$navHide = document.querySelector('.App-navHide');
    this.$sidebar = document.querySelector('.App-sidebar');
    this.$sidebarShow = document.querySelector('.App-sidebarShow');
    this.$sidebarHide = document.querySelector('.App-sidebarHide');
    this.$sidebarGutter = document.querySelector('.App-sidebarGutter');
    this.$modalOverlay = document.querySelector('.App-modalOverlay');

    // Listen for breakpoint changes that affect the nav drawer.
    this.mql = window.matchMedia('(min-width: 48em)');
    this.mql.addListener((evt) => {
      if (evt.target.matches) {
        if (this.$root.classList.contains('App--isNavDrawerOpen')) {
          this.$root.classList.remove('App--isNavDrawerOpen');
          this.$root.classList.remove('App--isNavCollapsed');
        }
      }
    });

    this.state = {
      sidebarOpen: true,
      sidebarWidth: null,
    };

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
  }

  initNav() {
    this.$navHide.addEventListener('touchend', this.hideNav);
    this.$navHide.addEventListener('click', this.hideNav);
    this.$modalOverlay.addEventListener('touchend', this.hideNav);
    this.$modalOverlay.addEventListener('click', this.hideNav);

    this.$navShow.addEventListener('touchend', this.showNav);
    this.$navShow.addEventListener('click', this.showNav);
  }

  showNav(evt) {
    evt.preventDefault();
    if (this.isNavInDrawerMode()) {
      this.openNavDrawer();
    } else {
      this.expandNav();
    }
  }

  hideNav(evt) {
    evt.preventDefault();
    if (this.isNavInDrawerMode()) {
      this.closeNavDrawer();
    } else {
      this.collapseNav();
    }
  }

  async openNavDrawer() {
    this.$nav.style.display = 'block';
    await transition(NAV_OPEN_TIMEOUT, () => {
      this.$root.classList.add('App--isNavDrawerOpen');
    });

    // TODO(philipwalton): in addition to adding focus here,
    // consider traping focus in the nav unless the ESC key is pressed
    this.$nav.focus({preventScroll: true});

    // document.addEventListener('touchend', this.onTapOutsideNav);
    // document.addEventListener('click', this.onTapOutsideNav);
  }

  async closeNavDrawer() {
    this.$root.classList.remove('App--isNavDrawerOpen');
    await transition(NAV_OPEN_TIMEOUT);

    this.$navShow.focus({preventScroll: true});
    this.$nav.style.display = 'none';
  }

  async expandNav() {
    this.$nav.style.display = 'block';
    await transition(NAV_OPEN_TIMEOUT, () => {
      this.$root.classList.remove('App--isNavCollapsed');
    });

    this.$nav.focus({preventScroll: true});
  }

  async collapseNav() {
    this.$root.classList.add('App--isNavCollapsed');
    await transition(NAV_OPEN_TIMEOUT);

    this.$nav.style.display = 'none';
    this.$navShow.focus({preventScroll: true});
  }

  initSidebar() {
    this.$sidebarShow.addEventListener('touchend', this.showSidebar);
    this.$sidebarShow.addEventListener('click', this.showSidebar);
    this.$sidebarHide.addEventListener('touchend', this.hideSidebar);
    this.$sidebarHide.addEventListener('click', this.hideSidebar);

    this.$sidebarGutter.addEventListener(
        'touchstart', this.onSidebarStartDrag);
    this.$sidebarGutter.addEventListener(
        'mousedown', this.onSidebarStartDrag);

    document.addEventListener('touchend', this.onSidebarStopDrag);
    document.addEventListener('mouseup', this.onSidebarStopDrag);
  }

  async hideSidebar(evt) {
    evt.preventDefault();
    this.sidebar.freezeMinWidth();
    this.$root.classList.add('App--isSidebarTransitioning');
    await transition(SIDEBAR_TRANSITION_TIME, () => {
      if (this.state.sidebarWidth) {
        this.$sidebar.style.width = null;
      }
      this.$root.classList.add('App--isSidebarHidden');
    });
    this.$root.classList.remove('App--isSidebarTransitioning');
    this.$sidebar.style.display = 'none';
    this.$sidebarShow.focus({preventScroll: true});
  }

  async showSidebar(evt) {
    evt.preventDefault();
    this.$sidebar.style.display = 'block';
    this.$root.classList.add('App--isSidebarTransitioning');
    await transition(SIDEBAR_TRANSITION_TIME, () => {
      if (this.state.sidebarWidth) {
        this.$sidebar.style.width = this.state.sidebarWidth;
      }
      this.$root.classList.remove('App--isSidebarHidden');
    });
    this.$root.classList.remove('App--isSidebarTransitioning');
    this.sidebar.unfreezeMinWidth();
    this.$sidebar.focus({preventScroll: true});
  }

  isNavInDrawerMode() {
    return !this.mql.matches;
  }

  onSidebarStartDrag(evt) {
    evt.preventDefault();

    // Cache these values at the start of a drag,
    // so constant DOM measurements/lookups aren't required.
    this._screenWidth = this.$root.clientWidth;
    this._navWidth = this.$nav.clientWidth;

    document.addEventListener('touchmove', this.onSidebarDrag);
    document.addEventListener('mousemove', this.onSidebarDrag);
  }

  onSidebarStopDrag(evt) {
    evt.preventDefault();
    document.addEventListener('touchmove', this.onSidebarDrag);
    document.removeEventListener('mousemove', this.onSidebarDrag);
  }

  onSidebarDrag(evt) {
    // Use the touch target's pageX value if it's a touch event.
    const pageX = evt.targetTouches ? evt.targetTouches[0].pageX : evt.pageX;

    // Ensure the sidebar width is greater than --App-sidebarMinWidth
    // but not so big that it would force the content area to be smaller
    // than --App-contentMinWidth.
    const contentWidthCandidate = Math.max(CONTENT_MIN_WIDTH,
        pageX - this._navWidth);
    const sidebarWidth = Math.max(SIDEBAR_MIN_WIDTH,
        this._screenWidth - (this._navWidth + contentWidthCandidate));

    this.state.sidebarWidth = this.$sidebar.style.width = `${sidebarWidth}px`;
  }
}
