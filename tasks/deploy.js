const gulp = require('gulp');
const path = require('path');
const sh = require('shelljs');
const config = require('../config');

// Ensure referenced tasks are registered.
require('./build.js');

gulp.task('deploy', gulp.series('build', (done) => {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Deploying requires NODE_ENV to be set to production');
  }
  // Create a tempory directory and
  // checkout the existing gh-pages branch.
  sh.rm('-rf', '_tmp');
  sh.mkdir('_tmp');
  sh.cd('_tmp');
  sh.exec('git init');
  sh.exec('git remote add origin git@github.com:philipwalton/' +
      config.repo + '.git');
  sh.exec('git pull origin gh-pages');

  // Delete all the static files and add the new ones from the build directory.
  // NOTE: don't delete `responsive-components-demo.mp4`.
  sh.rm('-rf', './static');
  sh.cp('-rf', path.join('..', config.publicDir, '/*'), './');
  sh.exec('git add -A');

  // Commit and push the changes to
  // the gh-pages branch.
  sh.exec('git commit -m "Deploy site"');
  sh.exec('git branch -m gh-pages');
  sh.exec('git push origin gh-pages');

  // Clean up.
  sh.cd('..');
  sh.rm('-rf', '_tmp');
  sh.rm('-rf', config.publicDir);

  done();
}));
