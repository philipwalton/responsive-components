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
  const result = await postcss([
    atImport(),
    cssnext({
      browsers: '> 1%, last 1 versions, not ie <= 11',
      features: {customProperties: false},
    }),
    cssnano({preset: [
      'default',
      {discardComments: {removeAll: true}},
    ]}),
  ]).process(css, {
    from: srcPath,
  });

  return result.css;
};

gulp.task('css', async () => {
  try {
    const srcPath = './app/main.css';
    const css = await compileCss(srcPath);
    await generateRevisionedAsset(path.basename(srcPath), css);
  } catch (err) {
    console.error(err);
  }
});
