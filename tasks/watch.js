import chokidar from 'chokidar';
import {compileCSS} from './styles.js';
import {startServer} from './server.js';
import {compileTemplates} from './templates.js';

const cssWatcher = chokidar.watch('app/styles/**/*');

cssWatcher.on('ready', () => {
  cssWatcher.on('all', (...args) => {
    console.log('css', ...args);
    compileCSS().catch(console.error);
  });
});

const templateWatcher = chokidar.watch('app/templates/**/*');

templateWatcher.on('ready', () => {
  templateWatcher.on('all', (...args) => {
    console.log('content', ...args);
    compileTemplates().catch(console.error);
  });
});

startServer();
