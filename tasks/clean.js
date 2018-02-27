const fs = require('fs-extra');
const gulp = require('gulp');
const {resetManifest} = require('./utils/assets');
const config = require('../config');

gulp.task('clean', async () => {
  await fs.remove(config.publicDir);
  resetManifest();
});
