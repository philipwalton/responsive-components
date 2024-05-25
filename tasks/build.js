import {compileCSS} from './styles.js';
import {compileTemplates} from './templates.js';

await Promise.all([
  compileCSS(),
  compileTemplates(),
])
