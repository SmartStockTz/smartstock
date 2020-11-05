const gulp = require('gulp');
const electronPackage = require('./desktop/package.json');
const webPackage = require('./package.json');
const fs = require('fs');

function defaultTask(cb) {
  cb();
}

async function updateElectronVersion() {
  electronPackage.version = webPackage.version;
  fs.writeFileSync('./desktop/package.json', JSON.stringify(electronPackage));
}

async function syncDesktop() {
  return gulp.src('./dist/smartstock/**/*')
    .pipe(gulp.dest('./desktop/public'));
}

exports.default = defaultTask;
exports.copyBFastJs = updateElectronVersion;
exports.syncDesktop = syncDesktop;
