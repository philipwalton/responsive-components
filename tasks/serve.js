const connect = require('connect');
const gulp = require('gulp');
const serveStatic = require('serve-static');
const config = require('../config');

gulp.task('serve', gulp.series('build', () => {
  const port = 8080;
  const url = `http://localhost:${port}${config.publicPath}`;
  console.log(`Running app on ${url} and listening for changes`);

  connect().use(serveStatic('./')).listen(port);

  gulp.watch('app/**/*.css', gulp.series('css', 'templates'));
  gulp.watch('app/**/*.js', gulp.series('javascript', 'templates'));
  gulp.watch('app/**/*.html', gulp.series('templates'));
}));
