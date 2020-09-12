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
}

async function syncDesktop() {
  return gulp.src('./dist/smartstock/**/*')
    .pipe(gulp.dest('./electron/public'));
}

exports.default = defaultTask;
exports.copyBFastJs = copyBFastJs;
exports.syncDesktop = syncDesktop;
