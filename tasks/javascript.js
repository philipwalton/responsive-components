const fs = require('fs-extra');
const gulp = require('gulp');
const md5 = require('md5');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const UglifyJS = require('uglify-es');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const config = require('../config');
const {generateRevisionedAsset, getManifest, addAsset} =
    require('./utils/assets');

const configurePlugins = (opts = {}) => {
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':
          JSON.stringify(process.env.NODE_ENV || 'development'),
    }),

    // Give modules a deterministic name for better long-term caching:
    // https://github.com/webpack/webpack.js.org/issues/652#issuecomment-273023082
    new webpack.NamedModulesPlugin(),

    // Give dynamically `import()`-ed scripts a deterministic name for better
    // long-term caching. Solution adapted from:
    // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    new webpack.NamedChunksPlugin((chunk) => chunk.name ? chunk.name :
        md5(chunk.mapModules((m) => m.identifier()).join()).slice(0, 10)),

    // Extract runtime code so updates don't affect app-code caching:
    // https://webpack.js.org/guides/caching/
    new webpack.optimize.CommonsChunkPlugin({
      name: opts.runtimeName || 'runtime',
    }),

    // Give deterministic names to all webpacks non-"normal" modules
    // https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
    new NameAllModulesPlugin(),

    new ManifestPlugin({
      seed: getManifest(),
      fileName: config.manifestFileName,
      reduce: (oldManifest, {name, path}) => {
        addAsset(name, path);
        return getManifest();
      },
    }),
  ];

  if (process.env.NODE_ENV === 'production') {
    plugins.push(new UglifyJSPlugin({
      sourceMap: true,
      uglifyOptions: {
        mangle: {
          // Works around a Safari 10 bug:
          // https://github.com/mishoo/UglifyJS2/issues/1753
          safari10: true,
        },
      },
    }));
  }

  return plugins;
};

const configureBabelLoader = (browserlist) => {
  return {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          ['env', {
            debug: true,
            modules: false,
            useBuiltIns: true,
            targets: {
              browsers: browserlist,
            },
          }],
        ],
        plugins: ['dynamic-import-system-import'],
      },
    },
  };
};

const baseConfig = {
  output: {
    path: path.resolve(__dirname, '..', config.publicStaticDir),
    publicPath: config.publicStaticPath,
    filename: '[name]-[chunkhash:10].js',
  },
  cache: {},
  devtool: '#source-map',
};

const getModernConfig = () => Object.assign({}, baseConfig, {
  entry: {
    'main': './app/scripts/main.js',
  },
  plugins: configurePlugins({runtimeName: 'runtime'}),
  module: {
    rules: [
      configureBabelLoader([
        // The last two versions of each browser, excluding versions
        // that don't support <script type="module">.
        'last 2 Chrome versions', 'not Chrome < 60',
        'last 2 Safari versions', 'not Safari < 10.1',
        'last 2 iOS versions', 'not iOS < 10.3',
        'last 2 Firefox versions', 'not Firefox < 54',
        'last 2 Edge versions', 'not Edge < 15',
      ]),
    ],
  },
});

const getLegacyConfig = () => Object.assign({}, baseConfig, {
  entry: {
    'main-legacy': './app/scripts/main.js',
  },
  plugins: configurePlugins({runtimeName: 'runtime-legacy'}),
  module: {
    rules: [
      configureBabelLoader([
        '> 1%',
        'last 2 versions',
        'Firefox ESR',
      ]),
    ],
  },
});

const createCompiler = (config) => {
  const compiler = webpack(config);
  return () => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) return reject(err);
        console.log(stats.toString({colors: true}) + '\n');
        resolve();
      });
    });
  };
};


const getCustomElementsPolyfill = async () => {
  const customElementsPolyfill = await fs.readFile(
      'node_modules/@webcomponents/custom-elements/custom-elements.min.js',
      'utf-8');

  return customElementsPolyfill
      .replace(/\/\/# sourceMappingURL=.*?\.map\n/, '');
};

const getResizeObserverPolyfill = async () => {
  let resizeObserverPolyfill = await fs.readFile(
      './node_modules/resize-observer-polyfill/dist/ResizeObserver.global.js',
      'utf-8');

  return UglifyJS.minify(resizeObserverPolyfill).code;
};


const bundlePolyfills = async () => {
  const polyfills = await Promise.all([
    getCustomElementsPolyfill(),
    getResizeObserverPolyfill(),
  ]);

  generateRevisionedAsset('polyfills.js', polyfills.join('\n'));
}

gulp.task('javascript', async () => {
  // Generate the main bundle.
  const compileModernBundle = createCompiler(getModernConfig());
  await compileModernBundle();
  await bundlePolyfills();

  if (['debug', 'production'].includes(process.env.NODE_ENV)) {
    // Generate the main-legacy bundle.
    const compileLegacyBundle = createCompiler(getLegacyConfig());
    await compileLegacyBundle();
  }
});
