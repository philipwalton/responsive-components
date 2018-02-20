import 'babel-polyfill';
import App from './App.js';

const main = async () => {
  new App(document.querySelector('.App'));
  document.querySelector('.App').classList.add('App--isInteractive');

  // Lazily load analytics
  const analytics = await import('./analytics.js');
  analytics.init();
};

main();
