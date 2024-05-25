import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import {config} from './config.js';

const ENV = config.ENV || 'development';

export default {
  input: 'app/scripts/main.js',
  output: {
    format: 'esm',
    dir: './responsive-components',
  },
  plugins: [
    replace({
      values: {
        'self.__ENV__': JSON.stringify(ENV),
      },
      preventAssignment: true,
    }),
    ENV === 'production' && terser({
      module: true,
      mangle: true,
      compress: true,
    }),
  ],
};
