import EventEmitter from 'autotrack/lib/event-emitter.js';

// Set default state and enumerate valid keys.
let state = {
  selectedPage: null,
  pinnedDemo: null,
  sidebarWidth: null,
  isSidebarHidden: null,
  isSidebarTransitioning: false,
  isSidebarDragging: false,
  isNavInDrawerMode: null,
  isNavDrawerOpen: null,
  isNavSidebarCollapsed: false,
  isNavTransitioning: false,
};

export const stateListener = new EventEmitter();

export const setState = (appliedState) => {
  const changedProps = new Set();
  const oldState = state;
  state = Object.assign({}, oldState, appliedState);

  for (const [key, value] of Object.entries(appliedState)) {
    if (process.env.NODE_ENV !== 'production') {
      if (!oldState.hasOwnProperty(key)) {
        throw new Error(`Invalid state key ${key} passed to setState()`);
      }
    }
    if (oldState[key] !== value) {
      changedProps.add(key);
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    console.log('State change:', appliedState, changedProps, oldState, state);
  }
  stateListener.emit('change', oldState, state, changedProps);
};

export const getState = () => {
  return Object.assign({}, state);
};


