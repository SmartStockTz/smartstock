// const bfast = require('bfast');
const pkg = require('./package.json');
// const {createReadStream} = require("fs");
// const {join} = require("path");
const {execSync} = require("child_process");

// bfast.init({
//   applicationId: 'smartstock_lb',
//   projectId: 'smartstock'
// });
const r = execSync(`curl -F smartstock_${pkg.version}.exe="./dist/smartstock Setup ${pkg.version}.exe" "https://smartstock-daas.bfast.fahamutech.com/storage/smartstock_lb?pn=true"`);
console.log(r.toString());
// bfast.storage().save({
//   filename: `smartstock_${pkg.version}.exe`,
//   pn: true,
//   data: createReadStream(join(__dirname, 'dist', `smartstock Setup ${pkg.version}.exe`))
// }, progress => {
//   console.log(progress);
// }).then(console.log).catch(console.log);
