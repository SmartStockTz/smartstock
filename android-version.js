console.log('-------ANDROID VERSION UPDATE---START');
const mainPackage = require('./package.json');
const { writeFileSync, readFileSync} = require('fs');
const { join } = require('path');
// const versionChunks = mainPackage.version.split('.');
const versionCode = mainPackage['android-build'] ;//versionChunks[versionChunks.length-1];
const versionName = mainPackage.version;

const vPath = join(__dirname, 'android', 'variables.gradle');
let vFile  = readFileSync(vPath);
vFile = vFile.toString()
.replace(new RegExp('(versionCode).*', 'ig'), `versionCode = ${versionCode}`)
.replace(new RegExp('(versionName).*','ig'), `versionName = ${versionName}`);
writeFileSync(vPath, vFile);
console.log(versionCode);
console.log(versionName);
console.log('-------ANDROID VERSION UPDATE---END');