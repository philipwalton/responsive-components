import 'babel-polyfill';

import App from './components/App.js';

const main = async () => {
  new App(document.querySelector('.App'));
  document.querySelector('.App').classList.add('App--isInteractive');
};

main();
