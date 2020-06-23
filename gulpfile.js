const gulp = require('gulp');
const electronPackage = require('./electron/package.json');
const webPackage = require('./package.json');
const fs = require('fs');

function defaultTask(cb) {
  cb();
}

async function copyBFastJs() {
  electronPackage.version = webPackage.version;
  fs.writeFileSync('./electron/package.json', JSON.stringify(electronPackage));
  return gulp.src('./node_modules/bfastjs/dist/bfast_js.js')
    .pipe(gulp.dest('./src/assets/js'));
}

exports.default = defaultTask;
exports.copyBFastJs = copyBFastJs;
