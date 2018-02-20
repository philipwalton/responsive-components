import EventEmitter from 'autotrack/lib/event-emitter.js';

// Set defaults.
let state = {};

export const stateListener = new EventEmitter();

export const setState = (newPartialState) => {
  const oldState = state;
  state = Object.assign({}, oldState, newPartialState);

  stateListener.emit('change', oldState, state);
};

export const getState = () => {
  return Object.assign({}, state);
};


