import path from 'node:path';
import fs from 'fs-extra';
import {compile} from 'sass';
import {config} from '../config.js';

export async function compileCSS() {
  const result = compile('./app/styles/main.scss', {
    style: config.ENV === 'production' ? 'compressed' : undefined,
    loadPaths: ['node_modules'],
  });

  await fs.outputFile(path.join(config.publicDir, 'main.css'), result.css);
}
