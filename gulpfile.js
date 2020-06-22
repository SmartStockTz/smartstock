const gulp = require('gulp');

function defaultTask(cb) {
  // place code for your default task here
  cb();
}

async function copyBFastJs() {
  return gulp.src('./node_modules/bfastjs/dist/bfast_js.js')
    .pipe(gulp.dest('./src/assets/js'));
}

exports.default = defaultTask;
exports.copyBFastJs = copyBFastJs;
