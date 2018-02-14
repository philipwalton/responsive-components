const gulp = require('gulp');

// Ensure referenced tasks are registered.
require('./clean.js');
require('./css.js');
require('./icons.js');
require('./javascript.js');
require('./templates.js');

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('css', 'icons', 'javascript'),
    'templates'));
