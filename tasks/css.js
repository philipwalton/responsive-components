const cssnano = require('cssnano');
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const {generateRevisionedAsset} = require('./utils/assets');

const compileCss = async (srcPath) => {
  const css = await fs.readFile(srcPath, 'utf-8');

  const plugins = [
    atImport(),
    cssnext({
      browsers: process.env.NODE_ENV === 'production' ?
          'defaults' : 'last 2 Chrome versions',
      features: {customProperties: false},
    }),
  ];
  if (process.env.NODE_ENV === 'production') {
    plugins.push(cssnano({preset: [
      'default',
      {discardComments: {removeAll: true}},
    ]}));
  }

  const result = await postcss(plugins).process(css, {from: srcPath});

  return result.css;
};

gulp.task('css', async () => {
  try {
    const srcPath = './app/styles/main.css';
    const css = await compileCss(srcPath);
    await generateRevisionedAsset(path.basename(srcPath), css);
  } catch (err) {
    console.error(err);
  }
});
