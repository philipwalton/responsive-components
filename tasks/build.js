const gulp = require('gulp');

// Ensure referenced tasks are registered.
require('./clean.js');
require('./css.js');
require('./javascript.js');
require('./templates.js');

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('css', 'javascript'),
    'templates'));
