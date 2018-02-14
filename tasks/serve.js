const connect = require('connect');
const gulp = require('gulp');
const serveStatic = require('serve-static');

gulp.task('serve', gulp.series('build', () => {
  console.log('Running app on http://localhost:8080 and listening for changes');

  connect().use(serveStatic('./build')).listen(8080);

  gulp.watch('app/**/*.css', gulp.series('css', 'templates'));
  gulp.watch('app/**/*.js', gulp.series('javascript', 'templates'));
  gulp.watch('app/**/*.html', gulp.series('templates'));
}));
